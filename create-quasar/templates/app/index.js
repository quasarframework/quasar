export async function script ({ scope, utils }) {
  await utils.prompts(scope, [
    utils.commonPrompts.quasarVersion,
    utils.commonPrompts.scriptType
  ])

  const { script } = await import(`./quasar-${ scope.quasarVersion }/index.js`)
  await script({ scope, utils })
}
