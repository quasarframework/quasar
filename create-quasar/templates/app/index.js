
module.exports = async function ({ scope, utils }) {
  await utils.prompts(scope, [
    utils.commonPrompts.quasarVersion,
    utils.commonPrompts.scriptType
  ])

  const script = require(`./quasar-${scope.quasarVersion}`)
  await script({ scope, utils })
}
