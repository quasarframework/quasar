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
  glob.sync('src/components/**/Q*.js')
    .forEach(file => {
      const name = path.basename(file)
      map[getWithoutExtension(name)] = file
    })
}

function addDirectives (map) {
  glob.sync('src/directives/*.js')
    .forEach(file => {
      const name = path.basename(file)
      map[camelCase(getWithoutExtension(name))] = file
    })
}

function addPlugins (map) {
  glob.sync('src/plugins/*.js')
    .forEach(file => {
      const name = path.basename(file)
      map[camelCase(getWithoutExtension(name))] = file
    })
}

function addUtils (map) {
  glob.sync('src/utils/*.js')
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file))
      if (isExternalUtil(name)) {
        map[name === 'open-url' ? 'openURL' : name] = file
      }
    })
}

function generateFile (map) {
  return `
const map = ${JSON.stringify(map, null, 2)}

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

  console.log(generateFile(map))
}

module.exports.generate()
