// Used with babel-plugin-transform-imports

const
  glob = require('glob'),
  path = require('path')

const
  root = path.resolve(__dirname, '..'),
  resolve = file => path.resolve(root, file),
  { writeFile } = require('./build.utils')

function relative (name) {
  return path.relative(root, name)
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

function addComponents (map, theme) {
  const
    currentThemeEnding = `.${theme}.`,
    otherThemeEnding = `.${theme === 'mat' ? 'ios' : 'mat'}.`

  glob.sync(resolve('src/components/**/Q*.js'))
    .map(relative)
    .filter(file => file.indexOf(otherThemeEnding) === -1)
    .forEach(file => {
      let name = path.basename(file)
      if (name.indexOf(currentThemeEnding) > -1) {
        name = name.replace(currentThemeEnding, '.js')
      }
      map[getWithoutExtension(name)] = file
    })

  map['QSpinner'] = relative(resolve('src/components/spinner/QSpinner.js'))
  map['QSpinnerMat'] = relative(resolve('src/components/spinner/QSpinner.mat.js'))
  map['QSpinnerIos'] = relative(resolve('src/components/spinner/QSpinner.ios.js'))
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
  return 'quasar-framework/' + map[importName]
}
`
}

function generateTheme (theme) {
  const map = {
    Quasar: relative(resolve('src/vue-plugin.js'))
  }

  addComponents(map, theme)
  addDirectives(map)
  addPlugins(map)
  addUtils(map)

  writeFile(
    resolve(`dist/babel-transforms/imports.${theme}.js`),
    generateFile(map)
  )
}

module.exports.generate = function () {
  generateTheme('mat')
  generateTheme('ios')
}
