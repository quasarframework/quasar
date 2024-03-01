export async function script ({ scope, utils }) {
  utils.createTargetDir(scope)
  utils.renderTemplate(utils.join(import.meta.url, 'BASE'), scope)

  if (scope.features.ae) {
    utils.renderTemplate(utils.join(import.meta.url, 'ae'), scope)
    if (scope.preset.install) utils.renderTemplate(utils.join(import.meta.url, 'ae-install'), scope)
    if (scope.preset.prompts) utils.renderTemplate(utils.join(import.meta.url, 'ae-prompts'), scope)
    if (scope.preset.uninstall) utils.renderTemplate(utils.join(import.meta.url, 'ae-uninstall'), scope)
  }

  if (scope.features.component) utils.renderTemplate(utils.join(import.meta.url, 'ui-component'), scope)
  if (scope.features.directive) utils.renderTemplate(utils.join(import.meta.url, 'ui-directive'), scope)

  if (scope.features.ae && (scope.features.component || scope.features.directive)) {
    utils.renderTemplate(utils.join(import.meta.url, 'ui-ae'), scope)
  }
}
