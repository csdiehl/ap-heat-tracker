const path = require('path')
const fs = require('fs')
const glob = require('glob')
const seo = require('ap-interactives-plumbing/seo')
const ejs = require('ejs')
const pkg = require('../package.json')
const project = pkg.associatedpress

const repoRoot = path.resolve(path.dirname(__dirname))
const contentDir = path.resolve(repoRoot, './src/content')
const clientsDir = path.resolve(repoRoot, path.join('src', 'js'))
const pagesDir = path.resolve(repoRoot, path.join('src', 'pages'))
const visualsDir = path.resolve(repoRoot, path.join('src', 'js', 'visuals'))
const templatesDir = path.resolve(repoRoot, path.join('src', 'js'))

function getVirtualEntry({ name, contents }) {
	const base64 = Buffer.from(contents).toString('base64')
  const moduleName = /\.js$/.test(name) ? name : `${name}.js`
	return `${moduleName}!=!data:text/javascript;base64,${base64}`
}

function getTemplate(name) {
  const template = path.join(templatesDir, name)
  if (fs.existsSync(template)) return fs.readFileSync(template).toString()
  throw new Error(`Template file not found at ${template}`)
}

function getClientEntrypoints() {
  return glob.sync(`${clientsDir}/*-client.js`).reduce((ent, file) => {
    const name = path.basename(file, '.js')
    return { ...ent, [name]: `./${path.relative(repoRoot, file)}` }
  }, {})
}

function getPageEntrypoints() {
  const template = getTemplate('page-app.template.js')
  return glob.sync(`${pagesDir}/**/*.js`).reduce((ent, file) => {
    const name = path.relative(pagesDir, file).replace(/\.js$/, '')
    const importPath = `./${path.relative(repoRoot, file)}`
    return {
      ...ent,
      [name]: getVirtualEntry({
        name,
        contents: ejs.render(template, { name, importPath }),
      }),
    }
  }, {})
}

function getVisualEntrypoints() {
  const template = getTemplate('visual-app.template.js')
  return glob.sync(`${visualsDir}/{*.js,*/index.js}`).reduce((ent, file) => {
    const base = /index\.js$/.test(file) ? path.basename(path.dirname(file)) : path.basename(file, '.js')
    const name = `visuals/${base}`
    const importPath = `./${path.relative(repoRoot, file)}`
    return {
      ...ent,
      [name]: getVirtualEntry({
        name,
        contents: ejs.render(template, { name, importPath }),
      }),
    }
  }, {})
}

function canonical(opts = {}) {
  return seo.canonical(project, opts)
}

function shareImg(opts = {}) {
  return seo.shareImage(project, opts)
}

function pageName(page) {
  const pg = page || 'index.html'
  const url = utils.canonical({ page: pg })
  return new URL(url).pathname.slice(1)
}

module.exports = {
  project,
  repoRoot,
  contentDir,
  clientsDir,
  pagesDir,
  visualsDir,
  templatesDir,
  getVirtualEntry,
  getTemplate,
  getClientEntrypoints,
  getPageEntrypoints,
  getVisualEntrypoints,
  canonical,
  shareImg,
  pageName,
}
