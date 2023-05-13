const { createChain } = require('./create-chain.js')
const { log } = require('../utils/logger.js')
const { webpackNames } = require('./symbols.js')
const { extensionsRunner } = require('../app-extension/extensions-runner.js')

async function getWebpackConfig (chain, cfg, {
  name,
  cfgExtendBase = cfg.build,
  hookSuffix = '',
  cmdSuffix = '',
  invokeParams
}) {
  await extensionsRunner.runHook('chainWebpack' + hookSuffix, async hook => {
    log(`Extension(${ hook.api.extId }): Chaining "${ name }" Webpack config`)
    await hook.fn(chain, invokeParams, hook.api)
  })

  if (typeof cfgExtendBase[ 'chainWebpack' + cmdSuffix ] === 'function') {
    log(`Chaining "${ name }" Webpack config`)
    await cfgExtendBase[ 'chainWebpack' + cmdSuffix ](chain, invokeParams)
  }

  const webpackConfig = chain.toConfig()

  await extensionsRunner.runHook('extendWebpack' + hookSuffix, async hook => {
    log(`Extension(${ hook.api.extId }): Extending "${ name }" Webpack config`)
    await hook.fn(webpackConfig, invokeParams, hook.api)
  })

  if (typeof cfgExtendBase[ 'extendWebpack' + cmdSuffix ] === 'function') {
    log(`Extending "${ name }" Webpack config`)
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
  const { createCustomSw } = require('./pwa/create-custom-sw.js')

  // csw - custom service worker
  return getWebpackConfig(createCustomSw(cfg, webpackNames.pwa.csw), cfg, {
    name: webpackNames.pwa.csw,
    cfgExtendBase: cfg.pwa,
    hookSuffix: 'PwaCustomSW',
    cmdSuffix: 'CustomSW',
    invokeParams: { isClient: true, isServer: false }
  })
}

async function getSPA (cfg) {
  const { injectSpa } = require('./spa/index.js')
  const chain = createChain(cfg, webpackNames.spa.renderer)
  injectSpa(chain, cfg)

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

    const { injectSpa } = require('./spa/index.js')
    injectSpa(chain, cfg) // extending a SPA

    const { injectPwa } = require('./pwa/index.js')
    injectPwa(chain, cfg)

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
  const { injectCordova } = require('./cordova/index.js')
  const chain = createChain(cfg, webpackNames.cordova.renderer)
  injectCordova(chain, cfg)

  return {
    renderer: await getWebpackConfig(chain, cfg, {
      name: webpackNames.cordova.renderer,
      invokeParams: { isClient: true, isServer: false }
    })
  }
}

async function getCapacitor (cfg) {
  const { injectCapacitor } = require('./capacitor/index.js')
  const chain = createChain(cfg, webpackNames.capacitor.renderer)

  injectCapacitor(chain, cfg)

  return {
    renderer: await getWebpackConfig(chain, cfg, {
      name: webpackNames.capacitor.renderer,
      invokeParams: { isClient: true, isServer: false }
    })
  }
}

async function getElectron (cfg) {
  const rendererChain = createChain(cfg, webpackNames.electron.renderer)

  const { injectElectronPreload } = require('./electron/preload.js')
  const preloadChain = injectElectronPreload(cfg, webpackNames.electron.preload)

  const { injectElectronMain } = require('./electron/main.js')
  const mainChain = injectElectronMain(cfg, webpackNames.electron.main)

  const { injectElectronRenderer } = require('./electron/renderer.js')
  injectElectronRenderer(rendererChain, cfg)

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
  const { injectSSRClient } = require('./ssr/client.js')
  const client = createChain(cfg, webpackNames.ssr.clientSide)
  injectSSRClient(client, cfg)

  if (cfg.ctx.mode.pwa) {
    const { injectPwa } = require('./pwa/index.js')
    injectPwa(client, cfg) // extending a PWA
  }

  const { injectSSRServer } = require('./ssr/server.js')
  const server = createChain(cfg, webpackNames.ssr.serverSide)
  injectSSRServer(server, cfg)

  const { createSSRWebserverChain } = require('./ssr/webserver.js')
  const webserver = createSSRWebserverChain(cfg, webpackNames.ssr.webserver)

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
  const { injectBexRenderer } = require('./bex/renderer.js')
  const rendererChain = createChain(cfg, webpackNames.bex.renderer)
  injectBexRenderer(rendererChain, cfg)

  const { injectBexMain } = require('./bex/main.js')
  const mainChain = createChain(cfg, webpackNames.bex.main)
  injectBexMain(mainChain, cfg)

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

module.exports.createWebpackConfig = async function (cfg) {
  const mode = cfg.ctx.mode

  if (mode.ssr) {
    return await getSSR(cfg)
  }

  if (mode.electron) {
    return await getElectron(cfg)
  }

  if (mode.cordova) {
    return await getCordova(cfg)
  }

  if (mode.capacitor) {
    return await getCapacitor(cfg)
  }

  if (mode.pwa) {
    return await getPWA(cfg)
  }

  if (mode.bex) {
    return await getBEX(cfg)
  }

  return await getSPA(cfg)
}
