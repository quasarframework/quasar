// Partly used with babel-plugin-transform-imports
// and by @quasar/app auto-import feature

const glob = require('fast-glob')
const path = require('path')

const root = path.resolve(__dirname, '..')
const resolvePath = file => path.resolve(root, file)
const { writeFile, kebabCase } = require('./build.utils')

const sourceFileSuffixRE = /__tests__/

function relative (name) {
  return path.relative(root, name).split('\\').join('/')
}

function getWithoutExtension (filename) {
  const insertionPoint = filename.lastIndexOf('.')
  return filename.slice(0, insertionPoint)
}

function lowerCamelCase (name) {
  return name.replace(/-([a-z])/g, g => g[ 1 ].toUpperCase())
}

function addComponents (map, autoImport) {
  glob.sync(resolvePath('src/components/**/Q*.js'))
    .filter(file => sourceFileSuffixRE.test(file) === false)
    .map(relative)
    .forEach(file => {
      const
        name = getWithoutExtension(path.basename(file)),
        kebab = kebabCase(name)

      map[ name ] = file

      autoImport.kebabComponents.push(kebab)
      autoImport.pascalComponents.push(name)
      autoImport.importName[ name ] = name
      autoImport.importName[ kebab ] = name
    })
}

function addDirectives (map, autoImport) {
  glob.sync(resolvePath('src/directives/*.js'))
    .filter(file => sourceFileSuffixRE.test(file) === false)
    .map(relative)
    .forEach(file => {
      const
        name = getWithoutExtension(path.basename(file)),
        kebab = 'v-' + kebabCase(name)

      map[ name ] = file

      autoImport.directives.push(kebab)
      autoImport.importName[ kebab ] = name
    })
}

function addPlugins (map) {
  glob.sync(resolvePath('src/plugins/*.js'))
    .filter(file => sourceFileSuffixRE.test(file) === false)
    .map(relative)
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file))
      map[ name ] = file
    })
}

function addComposables (map) {
  glob.sync(resolvePath('src/composables/*.js'))
    .filter(file => sourceFileSuffixRE.test(file) === false)
    .map(relative)
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file))
      map[ lowerCamelCase(name) ] = file
    })
}

function addUtils (map) {
  glob.sync(resolvePath('src/utils/*.js'))
    .filter(file => sourceFileSuffixRE.test(file) === false)
    .map(relative)
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file))
      map[ name === 'open-url' ? 'openURL' : lowerCamelCase(name) ] = file
    })
}

function getImportMapContent (map) {
  return JSON.stringify(map, null, 2)
}

function getImportTransformationsContent () {
  return `const map = require('./import-map.json')

module.exports = function (importName) {
  const file = map[importName]
  if (file === void 0) {
    throw new Error('Unknown import from Quasar: ' + importName)
  }
  return 'quasar/' + file
}
`
}

function getAutoImportFile (autoImport) {
  autoImport.kebabComponents.sort((a, b) => (a.length > b.length ? -1 : 1))
  autoImport.pascalComponents.sort((a, b) => (a.length > b.length ? -1 : 1))
  autoImport.components = autoImport.kebabComponents.concat(autoImport.pascalComponents)
  autoImport.directives.sort((a, b) => (a.length > b.length ? -1 : 1))

  return JSON.stringify({
    importName: autoImport.importName,
    regex: {
      kebabComponents: '(' + autoImport.kebabComponents.join('|') + ')',
      pascalComponents: '(' + autoImport.pascalComponents.join('|') + ')',
      components: '(' + autoImport.components.join('|') + ')',
      directives: '(' + autoImport.directives.join('|') + ')'
    }
  }, null, 2)
}

module.exports.generate = function () {
  const map = {
    Quasar: relative(resolvePath('src/vue-plugin.js'))
  }
  const autoImport = {
    kebabComponents: [],
    pascalComponents: [],
    directives: [],
    importName: {}
  }

  addComponents(map, autoImport)
  addDirectives(map, autoImport)
  addPlugins(map)
  addComposables(map)
  addUtils(map)

  writeFile(
    resolvePath('dist/transforms/import-map.json'),
    getImportMapContent(map)
  )

  writeFile(
    resolvePath('dist/transforms/import-transformation.js'),
    getImportTransformationsContent()
  )

  writeFile(
    resolvePath('dist/transforms/auto-import.json'),
    getAutoImportFile(autoImport)
  )
}
