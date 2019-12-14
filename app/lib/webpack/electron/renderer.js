const injectHtml = require('../inject.html')
const injectClientSpecifics = require('../inject.client-specifics')
const injectHotUpdate = require('../inject.hot-update')

module.exports = function (chain, cfg) {
  const nodeIntegration = cfg.electron.nodeIntegration === true

  injectHtml(chain, cfg)
  injectClientSpecifics(chain, cfg)
  injectHotUpdate(chain, cfg)

  if (cfg.ctx.build) {
    chain.output
      .libraryTarget(nodeIntegration ? 'var' : 'commonjs2')
  }

  chain.node
    .merge({
      __dirname: cfg.ctx.dev,
      __filename: cfg.ctx.dev
    })

  if (nodeIntegration) {
    chain.resolve.extensions
      .add('.node')

    chain.target('electron-renderer')

    chain.module.rule('node')
      .test(/\.node$/)
      .use('node-loader')
        .loader('node-loader')
  }
}
