const createChain = require('./create-chain')
const { log } = require('../helpers/logger')
const extensionRunner = require('../app-extension/extensions-runner')

async function getWebpackConfig (chain, cfg, {
  name,
  hot,
  cfgExtendBase = cfg.build,
  hookSuffix = '',
  invokeParams
}) {
  await extensionRunner.runHook('chainWebpack' + hookSuffix, async hook => {
    log(`Extension(${hook.api.extId}): Chaining ${name ? name + ' ' : ''}Webpack config`)
    await hook.fn(chain, invokeParams, hook.api)
  })

  if (typeof cfgExtendBase.chainWebpack === 'function') {
    log(`Chaining ${name ? name + ' ' : ''}Webpack config`)
    await cfgExtendBase.chainWebpack(chain, invokeParams)
  }

  const webpackConfig = chain.toConfig()

  await extensionRunner.runHook('extendWebpack' + hookSuffix, async hook => {
    log(`Extension(${hook.api.extId}): Extending ${name ? name + ' ' : ''}Webpack config`)
    await hook.fn(webpackConfig, invokeParams, hook.api)
  })

  if (typeof cfgExtendBase.extendWebpack === 'function') {
    log(`Extending ${name ? name + ' ' : ''}Webpack config`)
    await cfgExtendBase.extendWebpack(webpackConfig, invokeParams)
  }

  if (hot && cfg.ctx.dev && cfg.devServer.hot) {
    // tap entries for HMR
    require('webpack-dev-server').addDevServerEntrypoints(webpackConfig, cfg.devServer)
  }

  return webpackConfig
}

async function getSPA (cfg) {
  const chain = createChain(cfg, 'SPA')

  require('./spa')(chain, cfg)

  return await getWebpackConfig(chain, cfg, {
    name: 'SPA',
    hot: true,
    invokeParams: { isClient: true, isServer: false }
  })
}

async function getPWA (cfg) {
  const chain = createChain(cfg, 'PWA')

  require('./spa')(chain, cfg) // extending a SPA
  require('./pwa')(chain, cfg)

  return await getWebpackConfig(chain, cfg, {
    name: 'PWA',
    hot: true,
    invokeParams: { isClient: true, isServer: false }
  })
}

async function getCordova (cfg) {
  const chain = createChain(cfg, 'Cordova')

  require('./cordova')(chain, cfg)

  return await getWebpackConfig(chain, cfg, {
    name: 'Cordova',
    hot: true,
    invokeParams: { isClient: true, isServer: false }
  })
}

async function getCapacitor (cfg) {
  const chain = createChain(cfg, 'Capacitor')
  require('./capacitor')(chain, cfg)

  return await getWebpackConfig(chain, cfg, {
    name: 'Capacitor',
    hot: true,
    invokeParams: { isClient: true, isServer: false }
  })
}

async function getElectron (cfg) {
  const rendererChain = createChain(cfg, 'Renderer process')
  const mainChain = require('./electron/main')(cfg, 'Main process')

  require('./electron/renderer')(rendererChain, cfg)

  return {
    renderer: await getWebpackConfig(rendererChain, cfg, {
      name: 'Renderer process',
      hot: true,
      invokeParams: { isClient: true, isServer: false }
    }),
    main: await getWebpackConfig(mainChain, cfg, {
      name: 'Main process',
      cfgExtendBase: cfg.electron,
      hookSuffix: 'MainElectronProcess',
      invokeParams: { isClient: false, isServer: true }
    })
  }
}

async function getSSR (cfg) {
  const client = createChain(cfg, 'Client')
  const server = createChain(cfg, 'Server')

  require('./ssr/client')(client, cfg)
  if (cfg.ctx.mode.pwa) {
    require('./pwa')(client, cfg) // extending a PWA
  }

  require('./ssr/server')(server, cfg)

  const webpackCfg = {
    client: await getWebpackConfig(client, cfg, {
      name: 'Client',
      hot: true,
      invokeParams: { isClient: true, isServer: false }
    }),
    server: await getWebpackConfig(server, cfg, {
      name: 'Server',
      invokeParams: { isClient: false, isServer: true }
    })
  }

  if (cfg.ctx.prod) {
    const webserverChain = require('./ssr/webserver')(cfg, 'Webserver')
    webpackCfg.webserver = await getWebpackConfig(webserverChain, cfg, {
      name: 'Webserver',
      cfgExtendBase: cfg.ssr,
      hookSuffix: 'Webserver',
      invokeParams: { isClient: false, isServer: true }
    })
  }

  return webpackCfg
}

async function getBEX (cfg) {
  const rendererChain = createChain(cfg, 'Renderer process')
  const mainChain = createChain(cfg, 'Main process')

  require('./bex/renderer')(rendererChain, cfg) // before SPA so we can set some vars
  require('./spa')(rendererChain, cfg) // extending a SPA

  require('./bex/main')(mainChain, cfg)

  return {
    renderer: await getWebpackConfig(rendererChain, cfg, {
      name: 'Renderer process',
      hot: true,
      invokeParams: { isClient: true, isServer: false }
    }),
    main: await getWebpackConfig(mainChain, cfg, {
      name: 'Main process',
      hookSuffix: 'MainBexProcess',
      invokeParams: { isClient: true, isServer: false }
    })
  }
}

module.exports = async function (cfg) {
  const mode = cfg.ctx.mode

  if (mode.ssr) {
    return await getSSR(cfg)
  }
  else if (mode.electron) {
    return await getElectron(cfg)
  }
  else if (mode.cordova) {
    return await getCordova(cfg)
  }
  else if (mode.capacitor) {
    return await getCapacitor(cfg)
  }
  else if (mode.pwa) {
    return await getPWA(cfg)
  }
  else if (mode.bex) {
    return await getBEX(cfg)
  }
  else {
    return await getSPA(cfg)
  }
}
