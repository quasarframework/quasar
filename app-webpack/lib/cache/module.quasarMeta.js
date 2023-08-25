const { getPackage } = require('../utils/get-package.js')

module.exports.createInstance = function createInstance ({ appPaths }) {
  const autoImportData = getPackage('quasar/dist/transforms/auto-import.json', appPaths.appDir)
  const importTransformation = getPackage('quasar/dist/transforms/import-transformation.js', appPaths.appDir)

  return {
    transformAssetUrls: getPackage('quasar/dist/transforms/loader-asset-urls.json', appPaths.appDir),
    autoImport: {
      autoImportData,
      importTransformation,

      compRegex: {
        kebab: new RegExp(autoImportData.regex.kebabComponents || autoImportData.regex.components, 'g'),
        pascal: new RegExp(autoImportData.regex.pascalComponents || autoImportData.regex.components, 'g'),
        combined: new RegExp(autoImportData.regex.components, 'g')
      },

      dirRegex: new RegExp(autoImportData.regex.directives, 'g')
    }
  }
}
