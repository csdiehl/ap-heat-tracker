const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MetataggerPlugin = require('metatagger-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const portfinder = require('portfinder')
const seo = require('ap-interactives-plumbing/seo')
const utils = require('./webpack-utils')

portfinder.basePort = 8000

const parseArgs = (env) => {
  const defaultProxyPort = env.PROXY || '3000'
  const args = require('yargs').default('proxy', defaultProxyPort).argv
  return args
}

const config = (env, argv, port, args) => {
  const canonical = (opts = {}) => utils.canonical({ local: true, port, ...opts })
  const shareImg = (opts = {}) => utils.shareImg({ local: true, port, ...opts })

  const pages = utils.getPageEntrypoints()
  const visuals = utils.getVisualEntrypoints()
  const clients = utils.getClientEntrypoints()

  const entrypoints = {
    ...pages,
    ...visuals,
  }

  return {
    mode: 'development',
    devtool: 'eval-source-map',
    resolve: {
      modules: [
        'node_modules',
        'src',
      ],
      extensions: ['.js', '.jsx'],
    },
    target: 'web',
    entry: {
      ...entrypoints,
      ...clients,
    },
    output: {
      path: path.resolve(utils.repoRoot, 'public'),
      chunkFilename: '__cdn__/js/[id].[contenthash].js',
      filename: (pathData) => {
        if (clients[pathData.chunk.name]) return '[name].js'
        return '__cdn__/js/[name].[contenthash].js';
      },
    },
    devServer: {
      compress: true,
      port,
      open: '/',
      hot: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      proxy: {
        '/live-data/': {
          /**
           * Uncomment these lines (and comment out the rest of this object) to
           * serve live-data locally
           */
          target: `http://localhost:${args.proxy}`,
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          enforce: 'pre',
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            emitWarning: true,
          }
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/env', {
                  useBuiltIns: 'usage',
                  corejs: 3,
                  targets: {
                    browsers: 'defaults',
                  },
                }],
                '@babel/preset-react',
              ],
              plugins: [
                '@babel/proposal-class-properties',
                '@babel/plugin-proposal-object-rest-spread',
              ],
            },
          },
        },
        {
          test: /.*\.s?css$/,
          sideEffects: true,
          use: [
            'style-loader',
            'css-loader',
            'resolve-url-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|font\.svg)$/,
          type: 'asset/resource',
          generator: {
            filename: '__cdn__/fonts/[name].[contenthash][ext]',
          },
        },
        {
          test: /\.(png|svg|jpg|gif|webp|avif)$/,
          exclude: /\.(font\.svg)$/,
          type: 'asset',
          generator: {
            filename: '__cdn__/images/[name].[contenthash][ext]',
          },
        },
        {
          test: /\.(mp4|mov|webm)$/,
          type: 'asset',
          generator: {
            filename: '__cdn__/videos/[name].[contenthash][ext]',
          },
        },
        {
          test: /\.ai$/,
          use: {
            loader: 'ai2react-loader',
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify('development'),
        PROJECT_BASE_URL: JSON.stringify(canonical()),
        PROJECT_DATA_URL: JSON.stringify('/live-data'),
        GOOGLE_ANALYTICS_ID: JSON.stringify(''),
      }),
      ...Object.keys(entrypoints).map(name => (
        new HtmlWebpackPlugin({
          filename: `${name}.html`,
          template: 'src/index.html',
          templateParameters: {
            content: `<div class="ap-interactive" data-interactive="${utils.project.metadata.slug}" data-entrypoint="${name}"></div>`,
          },
          chunks: [name],
        })
      )),
      ...Object.keys(entrypoints).map(name => {
        const page = `${name}.html`
        return new MetataggerPlugin({
          pages: [page],
          tags: seo.metaTags(utils.project, {
            page,
            local: true,
            port,
            contentDir: utils.contentDir,
          }),
        })
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'static/**',
            to: ({ absoluteFilename }) => {
              return path.relative('./static', absoluteFilename)
            },
          },
          ...Object.keys(pages).map(name => ({
            from: 'package.json',
            to: `${name}-metadata.json`,
            transform: () => {
              const page = `${name}.html`
              return JSON.stringify({
                image: shareImg({ page }),
                url: canonical({ page }),
                updated: new Date(),
                ...seo.pageMetadata(utils.project, { page, contentDir: utils.contentDir }),
              })
            },
          })),
        ],
      }),
    ],
  }
}

module.exports = (env, argv) =>
  portfinder.getPortPromise()
    .then(port => config(env, argv, port, parseArgs(env)))
