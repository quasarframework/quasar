const { join } = require('node:path')
const { readFileSync, writeFileSync } = require('node:fs')

const {
  createWebpackChain, extendWebpackChain,
  createBrowserEsbuildConfig, extendEsbuildConfig
} = require('../../config-tools.js')

const { resolveToCliDir } = require('../../utils/cli-runtime.js')
const { injectWebpackHtml } = require('../../utils/html-template.js')

const contentScriptTemplate = readFileSync(
  resolveToCliDir('templates/bex/entry-content-script.js'),
  'utf-8'
)

async function createScript (quasarConf, scriptName, entry) {
  const cfg = await createBrowserEsbuildConfig(quasarConf, { compileId: `browser-bex-${ scriptName }` })

  cfg.entryPoints = [
    entry || quasarConf.ctx.appPaths.resolve.entry(`bex-entry-${ scriptName }.js`)
  ]

  cfg.outfile = join(quasarConf.build.distDir, `${ scriptName }.js`)

  return extendEsbuildConfig(cfg, quasarConf.bex, quasarConf.ctx, 'extendBexScriptsConf')
}

const quasarBexConfig = {
  webpack: async quasarConf => {
    const webpackChain = await createWebpackChain(quasarConf, { compileId: 'webpack-bex', threadName: 'BEX UI' })

    webpackChain.output
      .path(
        join(quasarConf.build.distDir, 'www')
      )

    // We shouldn't minify BEX code. This option is disabled by default for BEX mode in quasar-conf.js.
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Source_Code_Submission#Provide_your_extension_source_code
    webpackChain.optimization.minimize(quasarConf.build.minify)

    injectWebpackHtml(webpackChain, quasarConf)

    return extendWebpackChain(webpackChain, quasarConf, { isClient: true })
  },

  contentScript: (quasarConf, name) => {
    const entry = quasarConf.ctx.appPaths.resolve.entry(`bex-entry-content-script-${ name }.js`)

    writeFileSync(
      entry,
      contentScriptTemplate.replace('__NAME__', name),
      'utf-8'
    )

    return createScript(quasarConf, name, entry)
  },

  backgroundScript: quasarConf => createScript(quasarConf, 'background'),
  domScript: quasarConf => createScript(quasarConf, 'dom')
}

module.exports.quasarBexConfig = quasarBexConfig
module.exports.modeConfig = quasarBexConfig
