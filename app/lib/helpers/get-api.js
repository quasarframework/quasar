const appPaths = require('../app-paths')
const logger = require('./logger')
const warn = logger('app:docs', 'red')

module.exports = async function getApi(item) {
  try {
    const api = require(
      require.resolve(`quasar/dist/api/${item}.json`, {
        paths: [appPaths.appDir]
      })
    )
    return {
      api
    }
  }
  catch (e) {}

  const extensionJson = require('../app-extension/extension-json')
  const extensions = Object.keys(extensionJson.getList())

  if (extensions.length > 0) {
    const Extension = require('../app-extension/Extension.js')

    for (let ext of extensions) {
      const instance = new Extension(ext)
      const hooks = await instance.run({})

      if (hooks.describeApi !== void 0 && hooks.describeApi[item]) {
        const fs = require('fs')
        const path = require('path')

        let file
        const {
          callerPath,
          relativePath
        } = hooks.describeApi[item]

        if (relativePath.charAt(0) === '~') {
          try {
            file = relativePath.slice(1)
            file = require.resolve(
              file, {
                paths: [callerPath, appPaths.appDir]
              }
            )
          }
          catch (e) {
            warn(`⚠️  Extension(${instance.extId}): registerDescribeApi - there is no package "${file}" installed`)
            process.exit(1)
          }
        }
        else {
          file = path.resolve(callerPath, relativePath)

          if (!fs.existsSync(file)) {
            warn(`⚠️  Extension(${instance.extId}): registerDescribeApi - there is no file at ${file}`)
            process.exit(1)
          }
        }

        try {
          return {
            api: require(file),
            supplier: instance.extId
          }
        }
        catch (e) {
          warn(`⚠️  Extension(${instance.extId}): Malformed API file at ${file}`)
          process.exit(1)
        }
      }
    }
  }

  warn(`⚠️  No API found for requested "${item}"`)
  warn()
  process.exit(1)
}
