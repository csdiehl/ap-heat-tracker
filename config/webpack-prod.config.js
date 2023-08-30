const webpack = require("webpack")
const path = require("path")
const del = require("del")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackJsdomPrerenderPlugin = require("html-webpack-jsdom-prerender-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const MetataggerPlugin = require("metatagger-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const seo = require("ap-interactives-plumbing/seo")
const utils = require("./webpack-utils")

const pages = utils.getPageEntrypoints()
const visuals = utils.getVisualEntrypoints()
const clients = utils.getClientEntrypoints()

const entrypoints = {
  ...pages,
  ...visuals,
}

const local = !!process.env.LOCAL
const port = process.env.PORT
const preview = !!process.env.PREVIEW
const apnewsQa = !!process.env.APNEWS_QA
const apnewsProd = !!process.env.APNEWS_PROD

const baseUrl = seo.canonical(utils.project, { local, port, preview })

const outputFolder = apnewsQa || apnewsProd ? "apnews-public" : "public"

const getConfig = (entrypoints, assetPublicPath) => ({
  mode: "production",
  devtool: "source-map",
  resolve: {
    modules: ["node_modules", "src"],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  entry: {
    ...entrypoints,
    ...clients,
  },
  output: {
    path: path.resolve(utils.repoRoot, outputFolder),
    chunkFilename: "__cdn__/js/[id].[contenthash].js",
    filename: (pathData) => {
      if (clients[pathData.chunk.name]) return "[name].js"
      const name = pathData.chunk.name.replace(/\//g, "--")
      return `__cdn__/js/${name}.[contenthash].js`
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: "pre",
        loader: "eslint-loader",
        exclude: /node_modules/,
        options: {
          emitWarning: true,
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                  targets: {
                    browsers: "defaults",
                  },
                },
              ],
              "@babel/preset-react",
            ],
            plugins: [
              "@babel/proposal-class-properties",
              "@babel/plugin-proposal-object-rest-spread",
              "transform-react-remove-prop-types",
            ],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /.*\.s?css$/,
        sideEffects: true,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "resolve-url-loader",
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|font\.svg)$/,
        type: "asset/resource",
        generator: {
          filename: "__cdn__/fonts/[name].[contenthash][ext]",
        },
      },
      {
        test: /\.(png|svg|jpg|gif|webp|avif)$/,
        exclude: /\.(font\.svg)$/,
        type: "asset",
        generator: {
          filename: "__cdn__/images/[name].[contenthash][ext]",
          publicPath: assetPublicPath,
        },
      },
      {
        test: /\.(mp4|mov|webm)$/,
        type: "asset",
        generator: {
          filename: "__cdn__/videos/[name].[contenthash][ext]",
        },
      },
      {
        test: /\.ai$/,
        use: {
          loader: "ai2react-loader",
          options: {
            skipBuild: true,
          },
        },
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()],
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify("production"),
      PROJECT_BASE_URL: JSON.stringify(baseUrl),
      PROJECT_DATA_URL: JSON.stringify(`${baseUrl}live-data`),
      GOOGLE_ANALYTICS_ID: JSON.stringify("UA-19104461-7"),
    }),
    ...Object.keys(entrypoints).map(
      (name) =>
        new HtmlWebpackPlugin({
          filename: `${name}.html`,
          template: "src/index.html",
          templateParameters: {
            content: `<div class="ap-interactive" data-interactive="${utils.project.metadata.slug}" data-entrypoint="${name}"></div>`,
          },
          chunks: [name],
        })
    ),
    ...Object.keys(entrypoints).map((name) => {
      const page = `${name}.html`
      return new MetataggerPlugin({
        pages: [page],
        tags: seo.metaTags(utils.project, {
          page,
          preview,
          local,
          port,
          contentDir: utils.contentDir,
        }),
      })
    }),
    new HtmlWebpackJsdomPrerenderPlugin(
      Object.keys(entrypoints).reduce(
        (es, name) => ({
          ...es,
          [`${name}.html`]: {
            chunks: [name],
          },
        }),
        {}
      )
    ),
    new MiniCssExtractPlugin({
      filename: "__cdn__/css/[name].[contenthash].css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "static/**",
          to: ({ absoluteFilename }) => {
            return path.relative("./static", absoluteFilename)
          },
        },
        ...Object.keys(pages).map((name) => ({
          from: "package.json",
          to: `${name}-metadata.json`,
          transform: () => {
            const page = `${name}.html`
            return JSON.stringify({
              image: seo.shareImage(utils.project, {
                page,
                preview,
                local,
                port,
              }),
              url: seo.canonical(utils.project, { page, preview, local, port }),
              updated: new Date(),
              ...seo.pageMetadata(utils.project, {
                page,
                contentDir: utils.contentDir,
              }),
            })
          },
        })),
      ],
    }),
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [] }),
  ],
})

// Clean out project files when webpack is loaded. This is required because of how CleanWepbackPlugin
// is configured, in way that permits multiple configs. Discussion here:
// https://github.com/johnagan/clean-webpack-plugin/issues/122
del.sync([path.resolve(utils.repoRoot, outputFolder, "**/*")])

module.exports = [
  getConfig(pages, "./"),
  // Different relative public path for visuals since they are not served from the root
  // getConfig(visuals, "../"),
]
