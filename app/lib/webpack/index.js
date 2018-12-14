const
  createChain = require('./create-chain'),
  log = require('../helpers/logger')('app:webpack')

function getWebpackConfig (chain, cfg, {
  name,
  hot,
  cfgExtendBase = cfg.build,
  invokeParams
}) {
  if (typeof cfgExtendBase.chainWebpack === 'function') {
    log(`Chaining ${name ? name + ' ' : ''}Webpack config`)
    cfgExtendBase.chainWebpack(chain, invokeParams)
  }

  const webpackConfig = chain.toConfig()

  if (typeof cfgExtendBase.extendWebpack === 'function') {
    log(`Extending ${name ? name + ' ' : ''}Webpack config`)
    cfgExtendBase.extendWebpack(webpackConfig, invokeParams)
  }

  if (hot && cfg.ctx.dev && cfg.devServer.hot) {
    // tap entries for HMR
    require('webpack-dev-server').addDevServerEntrypoints(webpackConfig, cfg.devServer)
  }

  return webpackConfig
}

function getSPA (cfg) {
  const chain = createChain(cfg, 'SPA')
  require('./spa')(chain, cfg)
  return getWebpackConfig(chain, cfg, {
    name: 'SPA',
    hot: true,
    invokeParams: { isClient: true, isServer: false }
  })
}

function getPWA (cfg) {
  const chain = createChain(cfg, 'PWA')
  require('./spa')(chain, cfg) // extending a SPA
  require('./pwa')(chain, cfg)
  return getWebpackConfig(chain, cfg, {
    name: 'PWA',
    hot: true,
    invokeParams: { isClient: true, isServer: false }
  })
}

function getCordova (cfg) {
  const chain = createChain(cfg, 'Cordova')
  require('./cordova')(chain, cfg)
  return getWebpackConfig(chain, cfg, {
    name: 'Cordova',
    hot: true,
    invokeParams: { isClient: true, isServer: false }
  })
}

function getElectron (cfg) {
  const
    rendererChain = createChain(cfg, 'Renderer process'),
    mainChain = require('./electron/main')(cfg, 'Main process')

  require('./electron/renderer')(rendererChain, cfg)

  return {
    renderer: getWebpackConfig(rendererChain, cfg, {
      name: 'Renderer process',
      hot: true,
      invokeParams: { isClient: true, isServer: false }
    }),
    main: getWebpackConfig(mainChain, cfg, {
      name: 'Main process',
      cfgExtendBase: cfg.electron
    })
  }
}

function getSSR (cfg) {
  const
    client = createChain(cfg, 'Client'),
    server = createChain(cfg, 'Server')

  require('./ssr/client')(client, cfg)
  if (cfg.ctx.mode.pwa) {
    require('./pwa')(client, cfg) // extending a PWA
  }

  require('./ssr/server')(server, cfg)

  return {
    client: getWebpackConfig(client, cfg, {
      name: 'Client',
      hot: true,
      invokeParams: { isClient: true, isServer: false }
    }),
    server: getWebpackConfig(server, cfg, {
      name: 'Server',
      invokeParams: { isClient: false, isServer: true }
    })
  }
}

module.exports = function (cfg) {
  const mode = cfg.ctx.mode

  if (mode.ssr) {
    return getSSR(cfg)
  }
  else if (mode.electron) {
    return getElectron(cfg)
  }
  else if (mode.cordova) {
    return getCordova(cfg)
  }
  else if (mode.pwa) {
    return getPWA(cfg)
  }
  else {
    return getSPA(cfg)
  }
}
