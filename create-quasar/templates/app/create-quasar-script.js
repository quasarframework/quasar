export async function createQuasarScript({ scope, utils }) {
  await utils.promptUser(scope, {
    name: () => {
      const defaultName = utils.definitions.name.default(
        scope.projectFolderName
      )

      return utils.prompts.text({
        message: 'Package name:',
        placeholder: defaultName,
        defaultValue: defaultName,
        validate: val => {
          if (!utils.definitions.name.isValid(val ?? defaultName)) {
            return 'Invalid package.json name'
          }
        }
      })
    },

    product: () =>
      utils.prompts.text({
        message:
          'Project product name: (must start with letter if building mobile apps)',
        placeholder: utils.definitions.product.default,
        defaultValue: utils.definitions.product.default
      })
  })

  const { createQuasarScript: create } = await import(
    `./vite-3/create-quasar-script.js`
  )
  await create({ scope, utils })

  scope.meta.runDevCmd = 'quasar dev'
}
