export async function script ({ scope, utils }) {
  /**
   * Temporarily disable scriptType prompt (TS not ready yet)
   */

  // await utils.prompts(scope, [
  //   utils.commonPrompts.scriptType
  // ])

  // const { script } = await import(`./ae-${ scope.scriptType }/index.js`)
  // await script({ scope, utils })

  const { script } = await import('./ae-js/index.js')
  await script({ scope, utils })
}
