// Used with babel-plugin-transform-imports

const
  glob = require('glob'),
  path = require('path')

const
  root = path.resolve(__dirname, '..'),
  resolve = file => path.resolve(root, file),
  { writeFile } = require('./build.utils')

function relative (name) {
  return path.relative(root, name).split('\\').join('/')
}

function getWithoutExtension (filename) {
  const insertionPoint = filename.lastIndexOf('.')
  return filename.slice(0, insertionPoint)
}

function camelCase (name) {
  const out = name.replace(/-([a-z])/g, g => g[1].toUpperCase())
  return out.charAt(0).toUpperCase() + out.substr(1)
}

function lowerCamelCase (name) {
  return name.replace(/-([a-z])/g, g => g[1].toUpperCase())
}

function isExternalUtil (name) {
  return !['escape-key', 'modal-fn', 'popup', 'sort', 'router-link', 'is', 'noop', 'web-storage'].includes(name)
}

function addComponents (map) {
  glob.sync(resolve('src/components/**/Q*.js'))
    .map(relative)
    .forEach(file => {
      const name = path.basename(file)
      map[getWithoutExtension(name)] = file
    })
}

function addDirectives (map) {
  glob.sync(resolve('src/directives/*.js'))
    .map(relative)
    .forEach(file => {
      const name = path.basename(file)
      map[camelCase(getWithoutExtension(name))] = file
    })
}

function addPlugins (map) {
  glob.sync(resolve('src/plugins/*.js'))
    .map(relative)
    .forEach(file => {
      const name = path.basename(file)
      map[camelCase(getWithoutExtension(name))] = file
    })
}

function addUtils (map) {
  glob.sync(resolve('src/utils/*.js'))
    .map(relative)
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file))
      if (isExternalUtil(name)) {
        map[name === 'open-url' ? 'openURL' : lowerCamelCase(name)] = file
      }
    })
}

function generateFile (map) {
  return `const map = ${JSON.stringify(map, null, 2)}

module.exports = function (importName) {
  if (typeof map[importName] === 'undefined') {
    throw new Error('Unknown import from Quasar: ' + importName)
  }
  return 'quasar-framework/' + map[importName]
}
`
}

module.exports.generate = function () {
  const map = {
    Quasar: relative(resolve('src/vue-plugin.js'))
  }

  addComponents(map)
  addDirectives(map)
  addPlugins(map)
  addUtils(map)

  writeFile(
    resolve(`dist/babel-transforms/imports.js`),
    generateFile(map)
  )
}
