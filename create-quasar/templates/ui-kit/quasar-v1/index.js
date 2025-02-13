export async function script ({ scope, utils }) {
  utils.createTargetDir(scope)
  utils.renderTemplate('BASE', scope)

  if (scope.features.ae) {
    utils.renderTemplate('ae', scope)
    if (scope.preset.install) utils.renderTemplate('ae-install', scope)
    if (scope.preset.prompts) utils.renderTemplate('ae-prompts', scope)
    if (scope.preset.uninstall) utils.renderTemplate('ae-uninstall', scope)
  }

  if (scope.features.component) utils.renderTemplate('ui-component', scope)
  if (scope.features.directive) utils.renderTemplate('ui-directive', scope)

  if (scope.features.ae && (scope.features.component || scope.features.directive)) {
    utils.renderTemplate('ui-ae', scope)
  }
}
