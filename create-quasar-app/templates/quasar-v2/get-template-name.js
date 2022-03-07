
module.exports = async function (initialAnswers, utils) {
  const answer = await utils.prompts([
    {
      type: 'select',
      name: 'engine',
      message: 'Pick Quasar CLI variant:',
      initial: 0,
      choices: [
        { title: 'Quasar App with Webpack', value: 'webpack' },
        { title: 'Quasar App with Vite (currently in alpha/beta)', value: 'vite' }
      ]
    }
  ])

  return `${initialAnswers.scriptType}-${answer.engine}`
}
