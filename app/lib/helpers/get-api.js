const appPaths = require('../app-paths')

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
  } catch (e) {}

  const extensionJson = require('../app-extension/extension-json')
  const extensions = Object.keys(extensionJson.getList())

  if (extensions.length > 0) {
    const Extension = require('../app-extension/Extension.js')

    for (let ext of extensions) {
      const instance = new Extension(ext)
      const hooks = await instance.run({})

      if (hooks.describeApi !== void 0 && hooks.describeApi[item]) {
        const fs = require('fs')
        const file = hooks.describeApi[item]

        if (!fs.existsSync(file)) {
          throw `⚠️  Extension(${instance.extId}): registerDescribeApi - there is no file at ${file}`
        }

        try {
          return {
            api: require(file),
            supplier: instance.extId
          }
        } catch (e) {
          throw `⚠️  Extension(${instance.extId}): Malformed API file at ${file}`
        }
      }
    }
  }

  throw `No API found for requested "${item}"`
}