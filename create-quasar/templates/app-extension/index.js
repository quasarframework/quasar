module.exports = async function ({ scope, utils }) {
  await utils.prompts(scope, [
    {
      type: 'select',
      name: 'extFormat',
      message: 'Pick AE format:',
      initial: 0,
      choices: [
        { title: 'ESM (q/app-vite >= 1.5, q/app-webpack >= 3.10)', value: 'esm', description: 'recommended' },
        { title: 'CommonJS', value: 'commonjs' }
      ]
    }
  ])

  const script = require(`./ae-v1-${ scope.extFormat }`)
  await script({ scope, utils })
}
