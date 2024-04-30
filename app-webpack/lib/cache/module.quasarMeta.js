const { getPackage } = require('../utils/get-package.js')

module.exports.createInstance = function createInstance ({ appPaths }) {
  const autoImportData = getPackage('quasar/dist/transforms/auto-import.json', appPaths.appDir)
  const importMap = getPackage('quasar/dist/transforms/import-map.json', appPaths.appDir)

  return {
    transformAssetUrls: getPackage('quasar/dist/transforms/loader-asset-urls.json', appPaths.appDir),
    autoImport: {
      autoImportData,
      importTransformation (importName) {
        const file = importMap[ importName ]
        if (file === void 0) {
          throw new Error('Unknown import from Quasar: ' + importName)
        }
        return 'quasar/' + file
      },

      compRegex: {
        kebab: new RegExp(autoImportData.regex.kebabComponents || autoImportData.regex.components, 'g'),
        pascal: new RegExp(autoImportData.regex.pascalComponents || autoImportData.regex.components, 'g'),
        combined: new RegExp(autoImportData.regex.components, 'g')
      },

      dirRegex: new RegExp(autoImportData.regex.directives, 'g')
    }
  }
}
