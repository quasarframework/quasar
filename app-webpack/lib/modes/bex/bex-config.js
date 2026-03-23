const { join } = require('node:path')

const {
  createWebpackChain,
  extendWebpackChain,
  createBrowserEsbuildConfig,
  extendEsbuildConfig
} = require('../../config-tools.js')

const { getBuildSystemDefine } = require('../../utils/env.js')
const { injectWebpackHtml } = require('../../utils/html-template.js')

function generateDefaultEntry(quasarConf) {
  return {
    name: 'file', // or subdir/file (regardless of OS)
    from: quasarConf.ctx.appPaths.resolve.bex('file.js'),
    to: join(quasarConf.build.distDir, 'file.js')
  }
}

const quasarBexConfig = {
  webpack: async quasarConf => {
    const webpackChain = await createWebpackChain(quasarConf, {
      compileId: 'webpack-bex',
      threadName: 'BEX UI'
    })

    if (quasarConf.ctx.prod === true || quasarConf.ctx.target.firefox) {
      webpackChain.output.path(join(quasarConf.build.distDir, 'www'))
    }

    // We shouldn't minify BEX code. This option is disabled by default for BEX mode in quasar-conf.js.
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Source_Code_Submission#Provide_your_extension_source_code
    webpackChain.optimization.minimize(quasarConf.build.minify)

    injectWebpackHtml(webpackChain, quasarConf)

    return extendWebpackChain(webpackChain, quasarConf, { isClient: true })
  },

  async bexScript(quasarConf, entry = generateDefaultEntry(quasarConf)) {
    const cfg = await createBrowserEsbuildConfig(quasarConf, {
      compileId: `bex:script:${entry.name}`
    })

    cfg.define = {
      ...cfg.define,
      ...getBuildSystemDefine({
        buildEnv: {
          __QUASAR_BEX_SCRIPT_NAME__: entry.name,
          __QUASAR_BEX_SERVER_PORT__: quasarConf.devServer.port || 0
        }
      })
    }

    cfg.entryPoints = [entry.from]
    cfg.outfile = entry.to

    return extendEsbuildConfig(
      cfg,
      quasarConf.bex,
      quasarConf.ctx,
      'extendBexScriptsConf'
    )
  }
}

module.exports.quasarBexConfig = quasarBexConfig
module.exports.modeConfig = quasarBexConfig
