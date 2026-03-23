export async function createQuasarScript ({ scope, utils }) {
  await utils.prompts(scope, [
    utils.commonPrompts.scriptType
  ])

  const { script } = await import(`./quasar-v2/create-quasar-script.js`)
  await script({ scope, utils })
}
