
module.exports = async function ({ scope, utils }) {
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
    utils.commonPrompts.description,
    utils.commonPrompts.author
  ])

  const script = require(`./${scope.scriptType}`)
  await script({ scope, utils })
}
