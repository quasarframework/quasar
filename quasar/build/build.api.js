// Used with babel-plugin-transform-imports

const
  glob = require('glob'),
  path = require('path'),
  merge = require('webpack-merge'),
  fs = require('fs'),
  { logError, writeFile } = require('./build.utils')

const
  root = path.resolve(__dirname, '..'),
  resolve = file => path.resolve(root, file),
  dest = path.join(root, 'dist/api'),
  extendApi = require(resolve('src/api.extends.json'))

function getWithoutExtension (filename) {
  const insertionPoint = filename.lastIndexOf('.')
  return filename.slice(0, insertionPoint)
}

function getMixedInAPI (api, mainFile) {
  api.mixins.forEach(mixin => {
    const mixinFile = resolve('src/' + mixin + '.json')

    if (!fs.existsSync(mixinFile)) {
      logError(`api.build.js: ${path.relative(root, mainFile)} -> no such mixin ${mixin}`)
      process.exit(1)
    }

    const content = require(mixinFile)

    api = merge(
      content.mixins !== void 0
        ? getMixedInAPI(content, mixinFile)
        : content,
      api
    )
  })

  const { mixins, ...finalApi } = api
  return finalApi
}

function parseAPI (file, extendApi) {
  let api = require(file)

  if (api.mixins !== void 0) {
    api = getMixedInAPI(api, file)
  }

  // "props", "slots", ...
  for (let type in api) {
    for (let item in api[type]) {
      const definition = api[type][item]

      if (extendApi[type] !== void 0) {
        if (definition.extends !== void 0) {
          api[type][item] = merge(
            extendApi[type][definition.extends],
            api[type][item]
          )
          delete api[type][item].extends
        }
      }

      const obj = api[type][item]

      if (obj.desc === void 0) {
        logError(`api.build.js: ${path.relative(root, file)} -> "${type}"/"${item}" missing "desc" prop`)
        process.exit(1)
      }

      if (type === 'props') {
        if (obj.type === void 0) {
          logError(`api.build.js: ${path.relative(root, file)} -> "${type}"/"${item}" missing "type" prop`)
          process.exit(1)
        }

        if (obj.type !== 'Boolean' && obj.examples === void 0) {
          logError(`api.build.js: ${path.relative(root, file)} -> "${type}"/"${item}" missing "examples" prop`)
          process.exit(1)
        }

        if (obj.examples && !Array.isArray(obj.examples)) {
          logError(`api.build.js: ${path.relative(root, file)} -> "${type}"/"${item}"/"examples" is not an Array`)
          process.exit(1)
        }
        if (obj.values && !Array.isArray(obj.values)) {
          logError(`api.build.js: ${path.relative(root, file)} -> "${type}"/"${item}"/"values" is not an Array`)
          process.exit(1)
        }
      }
      else if (type === 'events' || type === 'methods') {
        if (obj.params !== void 0) {
          for (let paramName in obj.params) {
            const param = obj.params[paramName]

            if (
              param.type === void 0 ||
              param.desc === void 0
            ) {
              logError(`api.build.js: ${path.relative(root, file)} -> "${type}"/"${item}"/"${paramName}" missing either "type" or "desc" props`)
              process.exit(1)
            }
          }
        }
      }
    }
  }

  api.type = 'component'

  return api
}

module.exports.generate = function () {
  const API = {}

  glob.sync(resolve('src/components/**/Q*.json'))
    .forEach(file => {
      const
        name = path.basename(file),
        filePath = path.join(dest, name)

      const api = parseAPI(file, extendApi.components)

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
