export async function createQuasarScript ({ scope, utils }) {
  /**
   * Temporarily disable scriptType prompt (TS not ready yet)
   */

  // await utils.prompts(scope, [
  //   utils.commonPrompts.scriptType
  // ])

  // const { script } = await import(`./ae-${ scope.scriptType }/create-quasar-script.js`)
  // await script({ scope, utils })

  const { script } = await import('./ae-js/create-quasar-script.js')
  await script({ scope, utils })
}
