
module.exports = async function ({ scope, utils }) {
  utils.createTargetDir(scope)
  utils.renderTemplate(utils.join(__dirname, 'BASE'), scope)

  if (scope.features.ae) {
    utils.renderTemplate(utils.join(__dirname, 'ae'), scope)
    if (scope.preset.install) utils.renderTemplate(utils.join(__dirname, 'ae-install'), scope)
    if (scope.preset.prompts) utils.renderTemplate(utils.join(__dirname, 'ae-prompts'), scope)
    if (scope.preset.uninstall) utils.renderTemplate(utils.join(__dirname, 'ae-uninstall'), scope)
  }

  if (scope.features.component) utils.renderTemplate(utils.join(__dirname, 'ui-component'), scope)
  if (scope.features.directive) utils.renderTemplate(utils.join(__dirname, 'ui-directive'), scope)

  if (scope.features.ae && (scope.features.component || scope.features.directive)) {
    utils.renderTemplate(utils.join(__dirname, 'ui-ae'), scope)
  }
}
