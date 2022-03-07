
module.exports = async function (initialAnswers, utils) {
  const answer = await utils.prompts([
    {
      type: 'select',
      name: 'engine',
      message: 'Pick Quasar App CLI variant:',
      initial: 0,
      choices: [
        { title: 'Quasar App CLI with Webpack', value: 'webpack' },
        { title: 'Quasar App CLI with Vite (currently in alpha/beta)', value: 'vite' }
      ]
    }
  ])

  return `${initialAnswers.scriptType}-${answer.engine}`
}
