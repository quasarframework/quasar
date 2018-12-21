// Used with babel-plugin-transform-imports

const
  glob = require('glob'),
  path = require('path'),
  fs = require('fs'),
  { writeFile } = require('./build.utils')

function getWithoutExtension (filename) {
  const insertionPoint = filename.lastIndexOf('.')
  return filename.slice(0, insertionPoint)
}

function parseAPI (api, extendApi) {
  // "props", "slots", ...
  for (let type in api) {
    if (extendApi[type] === void 0) {
      continue
    }

    for (let item in api[type]) {
      const definition = api[type][item]
      if (definition.extends !== void 0) {
        api[type][item] = Object.assign(
          extendApi[type][definition.extends],
          api[type][item]
        )
        delete api[type][item].extends
      }
    }
  }

  api.type = 'component'

  return api
}

module.exports.generate = function () {
  const
    root = path.resolve(__dirname, '..'),
    resolve = file => path.resolve(root, file),
    dest = path.join(root, 'dist/api'),
    extendApi = require(resolve('src/api.extends.json'))

  const API = {}

  glob.sync(resolve('src/components/**/Q*.json'))
    .forEach(file => {
      const
        name = path.basename(file),
        filePath = path.join(dest, name)

      const api = parseAPI(require(file), extendApi.components)

      // copy API file to dest
      writeFile(filePath, JSON.stringify(api, null, 2))

      // add into API index
      API[getWithoutExtension(name)] = api
    })

  writeFile(
    path.join(dest, 'index.json'),
    JSON.stringify(API, null, 2)
  )
}
