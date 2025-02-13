export async function script ({ scope, utils }) {
  await utils.prompts(scope, [
    {
      type: 'text',
      name: 'name',
      message: 'Package name:',
      initial: () => utils.inferPackageName(scope.projectFolderName),
      validate: (val) =>
        utils.isValidPackageName(val) || 'Invalid package.json name'
    },
    utils.commonPrompts.productName,
    utils.commonPrompts.description
  ])

  await utils.injectAuthor(scope)

  const { script } = await import(`./${ scope.scriptType }/index.js`)
  await script({ scope, utils })
}
