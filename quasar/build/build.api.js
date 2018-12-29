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
      logError(`build.api.js: ${path.relative(root, mainFile)} -> no such mixin ${mixin}`)
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

function parseAPI (file, apiType) {
  let api = require(file)

  if (api.mixins !== void 0) {
    api = getMixedInAPI(api, file)
  }

  // "props", "slots", ...
  for (let type in api) {
    if (['injection', 'quasarConfOptions'].includes(type)) { // only for plugins, validated above
      continue
    }

    for (let item in api[type]) {
      const definition = api[type][item]

      if (definition.extends !== void 0 && extendApi[apiType][type] !== void 0) {
        api[type][item] = merge(
          extendApi[apiType][type][definition.extends],
          api[type][item]
        )
        delete api[type][item].extends
      }

      const obj = api[type][item]

      if (obj.desc === void 0) {
        logError(`build.api.js: ${path.relative(root, file)} -> "${type}"/"${item}" missing "desc" prop`)
        process.exit(1)
      }

      if (type === 'props') {
        if (obj.type === void 0) {
          logError(`build.api.js: ${path.relative(root, file)} -> "${type}"/"${item}" missing "type" prop`)
          process.exit(1)
        }

        if (obj.type !== 'Boolean' && obj.examples === void 0) {
          logError(`build.api.js: ${path.relative(root, file)} -> "${type}"/"${item}" missing "examples" prop`)
          process.exit(1)
        }

        if (obj.examples && !Array.isArray(obj.examples)) {
          logError(`build.api.js: ${path.relative(root, file)} -> "${type}"/"${item}"/"examples" is not an Array`)
          process.exit(1)
        }
        if (obj.values && !Array.isArray(obj.values)) {
          logError(`build.api.js: ${path.relative(root, file)} -> "${type}"/"${item}"/"values" is not an Array`)
          process.exit(1)
        }

        if (obj.type === 'Object' && obj.definition !== void 0) {
          for (let p in obj.definition) {
            if (obj.definition[p].type === void 0) {
              logError(`build.api.js: ${path.relative(root, file)} -> "${type}"/"${item}"/"props"/"${p}" missing "type"`)
              process.exit(1)
            }
            if (obj.definition[p].desc === void 0) {
              logError(`build.api.js: ${path.relative(root, file)} -> "${type}"/"${item}"/"props"/"${p}" missing "desc"`)
              process.exit(1)
            }
          }
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
              logError(`build.api.js: ${path.relative(root, file)} -> "${type}"/"${item}"/"${paramName}" missing either "type" or "desc" props`)
              process.exit(1)
            }
          }
        }
      }
    }
  }

  api.type = apiType

  return api
}

function fillAPI (API, apiType) {
  return file => {
    const
      name = path.basename(file),
      filePath = path.join(dest, name)

    const api = parseAPI(file, apiType)

    // copy API file to dest
    writeFile(filePath, JSON.stringify(api, null, 2))

    // add into API index
    API[getWithoutExtension(name)] = api
  }
}

module.exports.generate = function () {
  const API = {}

  try {
    glob.sync(resolve('src/components/**/Q*.json'))
      .forEach(fillAPI(API, 'component'))

    glob.sync(resolve('src/plugins/*.json'))
      .forEach(fillAPI(API, 'plugin'))

    writeFile(
      path.join(dest, 'index.json'),
      JSON.stringify(API, null, 2)
    )
  }
  catch (err) {
    logError(`build.api.js: something went wrong...`)
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
