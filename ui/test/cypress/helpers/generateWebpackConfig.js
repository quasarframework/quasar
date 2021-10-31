module.exports = async function generateWebpackConfig () {
  const extensionRunner = require('@quasar/app/lib/app-extension/extensions-runner')
  const getQuasarCtx = require('@quasar/app/lib/helpers/get-quasar-ctx')

  const ctx = getQuasarCtx({
    mode: 'spa',
    target: void 0,
    debug: false,
    dev: true,
    prod: false
  })

  const QuasarConfFile = require('@quasar/app/lib/quasar-conf-file')

  // register app extensions
  await extensionRunner.registerExtensions(ctx)

  const quasarConfFile = new QuasarConfFile(ctx)

  try {
    await quasarConfFile.prepare()
  }
  catch (e) {
    console.log(e)
    return
  }
  await quasarConfFile.compile()
  return quasarConfFile.webpackConf
}
