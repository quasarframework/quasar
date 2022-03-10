
module.exports = async function (initialAnswers, utils) {
  const answer = await utils.prompts([
    {
      type: 'select',
      name: 'engine',
      message: 'Pick Quasar App CLI variant:',
      initial: 0,
      choices: [
        { title: 'Quasar App CLI with Webpack (stable)', value: 'webpack' },
        { title: 'Quasar App CLI with Vite (beta stage)', value: 'vite' }
      ]
    }
  ])

  return `${initialAnswers.scriptType}-${answer.engine}`
}
