
module.exports = async function ({
  scope,
  dir,
  utils
}) {
  utils.createTargetDir(dir, scope)
  utils.renderTemplate(utils.join(__dirname, 'BASE'), dir, scope)

  if (scope.preset.prompts) utils.renderTemplate(utils.join(__dirname, 'prompts-script'), dir, scope)
  if (scope.preset.install) utils.renderTemplate(utils.join(__dirname, 'install-script'), dir, scope)
  if (scope.preset.uninstall) utils.renderTemplate(utils.join(__dirname, 'uninstall-script'), dir, scope)
}
