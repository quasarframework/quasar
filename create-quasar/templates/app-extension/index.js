export async function script ({ scope, utils }) {
  await utils.prompts(scope, [
    utils.commonPrompts.scriptType
  ])

  const { script } = await import(`./ae-${ scope.scriptType }/index.js`)
  await script({ scope, utils })
}
