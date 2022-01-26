const createChain = require('./create-chain')
const { log } = require('../helpers/logger')
const { webpackNames } = require('./symbols')
const extensionRunner = require('../app-extension/extensions-runner')

async function getWebpackConfig (chain, cfg, {
  name,
  cfgExtendBase = cfg.build,
  hookSuffix = '',
  cmdSuffix = '',
  invokeParams
}) {
  await extensionRunner.runHook('chainWebpack' + hookSuffix, async hook => {
    log(`Extension(${hook.api.extId}): Chaining "${name}" Webpack config`)
    await hook.fn(chain, invokeParams, hook.api)
  })

  if (typeof cfgExtendBase[ 'chainWebpack' + cmdSuffix ] === 'function') {
    log(`Chaining "${name}" Webpack config`)
    await cfgExtendBase[ 'chainWebpack' + cmdSuffix ](chain, invokeParams)
  }

  const webpackConfig = chain.toConfig()

  await extensionRunner.runHook('extendWebpack' + hookSuffix, async hook => {
    log(`Extension(${hook.api.extId}): Extending "${name}" Webpack config`)
    await hook.fn(webpackConfig, invokeParams, hook.api)
  })

  if (typeof cfgExtendBase[ 'extendWebpack' + cmdSuffix ] === 'function') {
    log(`Extending "${name}" Webpack config`)
    await cfgExtendBase[ 'extendWebpack' + cmdSuffix ](webpackConfig, invokeParams)
  }

  if (cfg.ctx.dev) {
    webpackConfig.optimization = webpackConfig.optimization || {}
    webpackConfig.optimization.emitOnErrors = false

    webpackConfig.infrastructureLogging = Object.assign(
      { colors: true, level: 'warn' },
      webpackConfig.infrastructureLogging
    )
  }

  return webpackConfig
}

function getCSW (cfg) {
  const createCSW = require('./pwa/create-custom-sw')

  // csw - custom service worker
  return getWebpackConfig(createCSW(cfg, webpackNames.pwa.csw), cfg, {
    name: webpackNames.pwa.csw,
    cfgExtendBase: cfg.pwa,
    hookSuffix: 'PwaCustomSW',
    cmdSuffix: 'CustomSW',
    invokeParams: { isClient: true, isServer: false }
  })
}

async function getSPA (cfg) {
  const chain = createChain(cfg, webpackNames.spa.renderer)

  require('./spa')(chain, cfg)

  return {
    renderer: await getWebpackConfig(chain, cfg, {
      name: webpackNames.spa.renderer,
      invokeParams: { isClient: true, isServer: false }
    })
  }
}

async function getPWA (cfg) {
  // inner function so csw gets created first
  // (affects progress bar order)

  function getRenderer () {
    const chain = createChain(cfg, webpackNames.pwa.renderer)

    require('./spa')(chain, cfg) // extending a SPA
    require('./pwa')(chain, cfg)

    return getWebpackConfig(chain, cfg, {
      name: webpackNames.pwa.renderer,
      invokeParams: { isClient: true, isServer: false }
    })
  }

  return {
    ...(cfg.pwa.workboxPluginMode === 'InjectManifest' ? { csw: await getCSW(cfg) } : {}),
    renderer: await getRenderer()
  }
}

async function getCordova (cfg) {
  const chain = createChain(cfg, webpackNames.cordova.renderer)

  require('./cordova')(chain, cfg)

  return {
    renderer: await getWebpackConfig(chain, cfg, {
      name: webpackNames.cordova.renderer,
      invokeParams: { isClient: true, isServer: false }
    })
  }
}

async function getCapacitor (cfg) {
  const chain = createChain(cfg, webpackNames.capacitor.renderer)
  require('./capacitor')(chain, cfg)

  return {
    renderer: await getWebpackConfig(chain, cfg, {
      name: webpackNames.capacitor.renderer,
      invokeParams: { isClient: true, isServer: false }
    })
  }
}

async function getElectron (cfg) {
  const rendererChain = createChain(cfg, webpackNames.electron.renderer)
  const preloadChain = require('./electron/preload')(cfg, webpackNames.electron.preload)
  const mainChain = require('./electron/main')(cfg, webpackNames.electron.main)

  require('./electron/renderer')(rendererChain, cfg)

  return {
    renderer: await getWebpackConfig(rendererChain, cfg, {
      name: webpackNames.electron.renderer,
      invokeParams: { isClient: true, isServer: false }
    }),
    preload: await getWebpackConfig(preloadChain, cfg, {
      name: webpackNames.electron.preload,
      cfgExtendBase: cfg.electron,
      hookSuffix: 'PreloadElectronProcess',
      cmdSuffix: 'Preload',
      invokeParams: { isClient: false, isServer: true }
    }),
    main: await getWebpackConfig(mainChain, cfg, {
      name: webpackNames.electron.main,
      cfgExtendBase: cfg.electron,
      hookSuffix: 'MainElectronProcess',
      cmdSuffix: 'Main',
      invokeParams: { isClient: false, isServer: true }
    })
  }
}

async function getSSR (cfg) {
  const client = createChain(cfg, webpackNames.ssr.clientSide)
  require('./ssr/client')(client, cfg)

  if (cfg.ctx.mode.pwa) {
    require('./pwa')(client, cfg) // extending a PWA
  }

  const server = createChain(cfg, webpackNames.ssr.serverSide)
  require('./ssr/server')(server, cfg)

  const webserver = require('./ssr/webserver')(cfg, webpackNames.ssr.webserver)

  return {
    ...(cfg.pwa.workboxPluginMode === 'InjectManifest' ? { csw: await getCSW(cfg) } : {}),

    webserver: await getWebpackConfig(webserver, cfg, {
      name: webpackNames.ssr.webserver,
      cfgExtendBase: cfg.ssr,
      hookSuffix: 'Webserver',
      cmdSuffix: 'Webserver',
      invokeParams: { isClient: false, isServer: true }
    }),

    clientSide: await getWebpackConfig(client, cfg, {
      name: webpackNames.ssr.clientSide,
      invokeParams: { isClient: true, isServer: false }
    }),

    serverSide: await getWebpackConfig(server, cfg, {
      name: webpackNames.ssr.serverSide,
      invokeParams: { isClient: false, isServer: true }
    })
  }
}

async function getBEX (cfg) {
  const rendererChain = createChain(cfg, webpackNames.bex.renderer)
  require('./bex/renderer')(rendererChain, cfg)

  const mainChain = createChain(cfg, webpackNames.bex.main)
  require('./bex/main')(mainChain, cfg)

  return {
    renderer: await getWebpackConfig(rendererChain, cfg, {
      name: webpackNames.bex.renderer,
      invokeParams: { isClient: true, isServer: false }
    }),

    main: await getWebpackConfig(mainChain, cfg, {
      name: webpackNames.bex.main,
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
