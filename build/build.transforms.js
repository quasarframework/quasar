// === work in progress ===
// To be used with babel-plugin-transform-imports
/*
[
  "transform-imports", {
    "quasar": {
      "transform": "../../transforms.js"
    }
  }
]
*/

const
  glob = require('glob'),
  path = require('path')

const
  resolve = file => path.resolve(__dirname, '..', file),
  { writeFile } = require('./build.utils')

function getWithoutExtension (filename) {
  const insertionPoint = filename.lastIndexOf('.')
  return filename.slice(0, insertionPoint)
}

function camelCase (name) {
  const out = name.replace(/-([a-z])/g, g => g[1].toUpperCase())
  return out.charAt(0).toUpperCase() + out.substr(1)
}

function isExternalUtil (name) {
  return !['escape-key', 'modal-fn', 'popup', 'sort', 'router-link', 'is', 'noop'].includes(name)
}

function addComponents (map) {
  glob.sync(resolve('src/components/**/Q*.js'))
    .forEach(file => {
      const name = path.basename(file)
      map[getWithoutExtension(name)] = file
    })
}

function addDirectives (map) {
  glob.sync(resolve('src/directives/*.js'))
    .forEach(file => {
      const name = path.basename(file)
      map[camelCase(getWithoutExtension(name))] = file
    })
}

function addPlugins (map) {
  glob.sync(resolve('src/plugins/*.js'))
    .forEach(file => {
      const name = path.basename(file)
      map[camelCase(getWithoutExtension(name))] = file
    })
}

function addUtils (map) {
  glob.sync(resolve('src/utils/*.js'))
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file))
      if (isExternalUtil(name)) {
        map[name === 'open-url' ? 'openURL' : name] = file
      }
    })
}

function generateFile (map) {
  return `const map = ${JSON.stringify(map, null, 2)}

module.exports = function (importName) {
  const path = 'quasar-framework/' + map[importName]
  console.log(importName, path)
  return path
}
`
}

module.exports.generate = function () {
  const map = {}

  addComponents(map)
  addDirectives(map)
  addPlugins(map)
  addUtils(map)

  writeFile(resolve('dist/babel-transforms/transform-imports.js'), generateFile(map))
}
