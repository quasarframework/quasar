// Partly used with babel-plugin-transform-imports
// and by @quasar/app auto-import feature

const
  glob = require('glob'),
  path = require('path')

const
  root = path.resolve(__dirname, '..'),
  resolvePath = file => path.resolve(root, file),
  { writeFile, kebabCase } = require('./build.utils')

function relative (name) {
  return path.relative(root, name).split('\\').join('/')
}

function getWithoutExtension (filename) {
  const insertionPoint = filename.lastIndexOf('.')
  return filename.slice(0, insertionPoint)
}

function lowerCamelCase (name) {
  return name.replace(/-([a-z])/g, g => g[1].toUpperCase())
}

function isExternalUtil (name) {
  return !['escape-key', 'modal-fn', 'popup', 'sort', 'router-link', 'is', 'noop', 'web-storage'].includes(name)
}

function addComponents (map, autoImport) {
  glob.sync(resolvePath('src/components/**/Q*.js'))
    .map(relative)
    .forEach(file => {
      const
        name = getWithoutExtension(path.basename(file)),
        kebab = kebabCase(name)

      map[name] = file

      autoImport.components.push(kebab)
      autoImport.importName[kebab] = name
    })
}

function addDirectives (map, autoImport) {
  glob.sync(resolvePath('src/directives/*.js'))
    .map(relative)
    .forEach(file => {
      const
        name = getWithoutExtension(path.basename(file)),
        kebab = 'v-' + kebabCase(name)

      map[name] = file

      autoImport.directives.push(kebab)
      autoImport.importName[kebab] = name
    })
}

function addPlugins (map) {
  glob.sync(resolvePath('src/plugins/*.js'))
    .map(relative)
    .forEach(file => {
      const name = path.basename(file)
      map[getWithoutExtension(name)] = file
    })
}

function addUtils (map) {
  glob.sync(resolvePath('src/utils/*.js'))
    .map(relative)
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file))
      if (isExternalUtil(name)) {
        map[name === 'open-url' ? 'openURL' : lowerCamelCase(name)] = file
      }
    })
}

function getImportsFile (map) {
  return `const map = ${JSON.stringify(map, null, 2)}

module.exports = function (importName) {
  if (typeof map[importName] === 'undefined') {
    throw new Error('Unknown import from Quasar: ' + importName)
  }
  return 'quasar/' + map[importName]
}
`
}

function getAutoImportFile (autoImport) {
  autoImport.components.sort((a, b) => a.length > b.length ? -1 : 1)
  autoImport.directives.sort((a, b) => a.length > b.length ? -1 : 1)

  autoImport.regex = {
    components: '(' + autoImport.components.join('|') + ')',
    directives: '(' + autoImport.directives.join('|') + ')'
  }

  delete autoImport.components
  delete autoImport.directives

  return JSON.stringify(autoImport, null, 2)
}

module.exports.generate = function () {
  const map = {
    Quasar: relative(resolvePath('src/vue-plugin.js'))
  }
  const autoImport = {
    components: [],
    directives: [],
    importName: {}
  }

  addComponents(map, autoImport)
  addDirectives(map, autoImport)
  addPlugins(map)
  addUtils(map)

  writeFile(
    resolvePath(`dist/babel-transforms/imports.js`),
    getImportsFile(map)
  )

  writeFile(
    resolvePath(`dist/babel-transforms/auto-import.json`),
    getAutoImportFile(autoImport)
  )
}
