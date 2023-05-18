const path = require('node:path')
const { existsSync, readFileSync } = require('node:fs')
const { removeSync } = require('fs-extra')
const { merge } = require('webpack-merge')
const debounce = require('lodash/debounce.js')
const { build: esBuild, context: esContextBuild } = require('esbuild')
const { transformAssetUrls } = require('@quasar/vite-plugin')

const appPaths = require('./app-paths.js')
const { log, warn, fatal, tip } = require('./utils/logger.js')
const { extensionRunner } = require('./app-extension/extensions-runner.js')
const { appFilesValidations } = require('./utils/app-files-validations.js')
const { cssVariables } = require('./utils/css-variables.js')
const { getPackageMajorVersion } = require('./utils/get-package-major-version.js')
const { resolveExtension } = require('./utils/resolve-extension.js')
const { storeProvider } = require('./utils/store-provider.js')
const { appPkg } = require('./app-pkg.js')

const urlRegex = /^http(s)?:\/\//i
const { findClosestOpenPort } = require('../lib/utils/net.js')
const { isMinimalTerminal } = require('./utils/is-minimal-terminal.js')
const { readFileEnv } = require('./utils/env.js')

const defaultPortMapping = {
  spa: 9000,
  ssr: 9100, // 9150 for SSR + PWA
  pwa: 9200,
  electron: 9300,
  cordova: 9400,
  capacitor: 9500
}

const tempFile = `${ appPaths.quasarConfigFilename }.temporary.compiled.cjs`

function getEsbuildConfig () {
  return {
    platform: 'node',
    format: 'cjs',
    bundle: true,
    packages: 'external',
    entryPoints: [ appPaths.quasarConfigFilename ],
    outfile: tempFile,
    plugins: []
  }
}

function escapeHTMLTagContent (str) {
  return str ? str.replace(/[<>]/g, '') : ''
}
function escapeHTMLAttribute (str) {
  return str ? str.replace(/\"/g, '') : ''
}

function formatPublicPath (path) {
  if (!path) {
    return '/'
  }

  if (!path.endsWith('/')) {
    path = `${ path }/`
  }

  if (urlRegex.test(path) === true) {
    return path
  }

  if (!path.startsWith('/')) {
    path = `/${ path }`
  }

  return path
}

function formatRouterBase (publicPath) {
  if (!publicPath || !publicPath.startsWith('http')) {
    return publicPath
  }

  const match = publicPath.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/)
  return formatPublicPath(match[ 5 ] || '')
}

function parseAssetProperty (prefix) {
  return asset => {
    if (typeof asset === 'string') {
      return {
        path: asset[ 0 ] === '~' ? asset.substring(1) : prefix + `/${ asset }`
      }
    }

    return {
      ...asset,
      path: typeof asset.path === 'string'
        ? (asset.path[ 0 ] === '~' ? asset.path.substring(1) : prefix + `/${ asset.path }`)
        : asset.path
    }
  }
}

function getUniqueArray (original) {
  return Array.from(new Set(original))
}

function uniquePathFilter (value, index, self) {
  return self.map(obj => obj.path).indexOf(value.path) === index
}

async function onAddress ({ host, port }, mode) {
  if (this.chosenHost) {
    host = this.chosenHost
  }
  else if (
    [ 'cordova', 'capacitor' ].includes(mode)
    && (!host || [ '0.0.0.0', 'localhost', '127.0.0.1', '::1' ].includes(host.toLowerCase()))
  ) {
    const { getExternalIP } = require('../lib/utils/get-external-ip.js')
    host = await getExternalIP()
    this.chosenHost = host
  }

  try {
    const openPort = await findClosestOpenPort(port, host)
    if (port !== openPort) {
      warn()
      warn(`️️Setting port to closest one available: ${ openPort }`)
      warn()

      port = openPort
    }
  }
  catch (e) {
    warn()

    if (e.message === 'ERROR_NETWORK_PORT_NOT_AVAIL') {
      warn('Could not find an open port. Please configure a lower one to start searching with.')
    }
    else if (e.message === 'ERROR_NETWORK_ADDRESS_NOT_AVAIL') {
      warn('Invalid host specified. No network address matches. Please specify another one.')
    }
    else {
      warn('Unknown network error occurred')
      console.error(e)
    }

    warn()

    if (!this.running) {
      process.exit(1)
    }

    return null
  }

  this.running = true
  return { host, port }
}

module.exports.QuasarConfFile = class QuasarConfFile {
  #ctx
  #opts
  #initialVersions = {}
  #address
  #isWatching = false

  constructor ({ ctx, host, port, watch }) {
    this.#ctx = ctx
    this.#opts = { host, port }

    if (watch !== void 0) {
      this.#opts.watch = debounce(watch, 550)
    }

    if (this.#ctx.mode.pwa) {
      // Enable this when workbox bumps version (as of writing these lines, we're handling v6)
      // this.#initialVersions.workbox = getPackageMajorVersion('workbox-build')
    }
    else if (this.#ctx.mode.capacitor) {
      const { capVersion } = require('./modes/capacitor/cap-cli.js')
      const getCapPluginVersion = capVersion <= 2
        ? () => true
        : name => {
          const version = getPackageMajorVersion(name, appPaths.capacitorDir)
          return version === void 0
            ? false
            : version || true
        }

      Object.assign(this.#initialVersions, {
        capacitor: capVersion,
        capacitorPluginApp: getCapPluginVersion('@capacitor/app'),
        capacitorPluginSplashscreen: getCapPluginVersion('@capacitor/splash-screen')
      })
    }
  }

  read () {
    const esbuildConfig = getEsbuildConfig()
    return this.#opts.watch !== void 0
      ? this.#buildAndWatch(esbuildConfig)
      : this.#build(esbuildConfig)
  }

  // start watching for changes
  watch () {
    this.#isWatching = true
  }

  async #build (esbuildConfig) {
    try {
      await esBuild(esbuildConfig)
    }
    catch (e) {
      removeSync(tempFile)
      console.log()
      console.error(e)
      fatal('Could not compile quasar.config file because it has errors', 'FAIL')
    }

    let fnResult
    try {
      fnResult = require(tempFile)
    }
    catch (e) {
      removeSync(tempFile)
      console.log()
      console.error(e)
      fatal('The quasar.config file has runtime errors', 'FAIL')
    }

    removeSync(tempFile)

    const quasarConfigFn = fnResult.default || fnResult
    return this.#computeConfig(quasarConfigFn, true)
  }

  async #buildAndWatch (esbuildConfig) {
    let firstBuildIsDone

    esbuildConfig.plugins.push({
      name: 'quasar:watcher',
      setup: build => {
        let isFirst = true

        build.onStart(() => {
          if (isFirst === false) {
            log()
            log('The quasar.config file changed. Reading it...')
          }
        })

        build.onEnd(async result => {
          if (isFirst === false && this.#isWatching === false) {
            // not ready yet; watch() has not been issued yet
            return
          }

          delete require.cache[ tempFile ]

          if (result.errors.length !== 0) {
            removeSync(tempFile)

            if (isFirst === true) {
              fatal('Could not compile quasar.config file because it has errors', 'FAIL')
            }

            warn('Could not compile quasar.config file because it has errors. Please fix them then save the file again.\n')
            return
          }

          let quasarConfigFn

          try {
            const result = require(tempFile)
            quasarConfigFn = result.default || result
          }
          catch (e) {
            removeSync(tempFile)
            console.log()
            console.error(e)

            if (isFirst === true) {
              fatal('Importing quasar.config file results in error', 'FAIL')
            }

            warn('Importing quasar.config file results in error. Please review the file then save it again.\n')
            return
          }

          removeSync(tempFile)
          delete require.cache[ tempFile ]

          const quasarConf = await this.#computeConfig(quasarConfigFn, isFirst)

          if (isFirst === true) {
            isFirst = false
            firstBuildIsDone(quasarConf)
            return
          }

          if (quasarConf !== void 0) {
            log('Scheduled to apply quasar.config changes in 550ms')
            this.#opts.watch(quasarConf)
          }
        })
      }
    })

    const esbuildCtx = await esContextBuild(esbuildConfig)
    await esbuildCtx.watch()

    return new Promise(res => { // eslint-disable-line promise/param-names
      firstBuildIsDone = res
    })
  }

  // return void 0 if it encounters errors
  // and quasarConf otherwise
  async #computeConfig (quasarConfigFn, failOnError) {
    if (typeof quasarConfigFn !== 'function') {
      if (failOnError === true) {
        fatal('The default export value of the quasar.config file is not a function', 'FAIL')
      }

      warn('The default export value of the quasar.config file is not a function. Please fix it then save the file again.\n')
      return
    }

    let userCfg

    try {
      userCfg = await quasarConfigFn(this.#ctx)
    }
    catch (e) {
      console.log()
      console.error(e)

      if (failOnError === true) {
        fatal('The quasar.config file has runtime errors', 'FAIL')
      }

      warn('The quasar.config file has runtime errors. Please fix them then save the file again.\n')
      return
    }

    if (Object(userCfg) !== userCfg) {
      if (failOnError === true) {
        fatal('The quasar.config file does not default exports an Object', 'FAIL')
      }

      warn('The quasar.config file does not default exports an Object. Please fix it then save the file again.\n')
      return
    }

    const rawQuasarConf = merge({
      ctx: this.#ctx,

      boot: [],
      css: [],
      extras: [],
      animations: [],
      framework: {
        components: [],
        directives: [],
        plugins: [],
        config: {}
      },

      eslint: {},

      sourceFiles: {},
      bin: {},
      htmlVariables: {},

      devServer: {
        fs: {}
      },

      build: {
        target: {},
        viteVuePluginOptions: {},
        vitePlugins: [],
        env: {},
        rawDefine: {},
        envFiles: [],
        resolve: {}
      },

      ssr: {
        middlewares: []
      },
      pwa: {},
      electron: {
        unPackagedInstallParams: [],
        packager: {},
        builder: {}
      },
      cordova: {},
      capacitor: {
        capacitorCliPreparationParams: []
      },
      bex: {
        contentScripts: []
      }
    }, userCfg)

    const metaConf = {
      debugging: this.#ctx.dev === true || this.#ctx.debug === true,
      needsAppMountHook: false,
      vueDevtools: false,
      versions: { ...this.#initialVersions }, // used by .quasar entry templates
      css: { ...cssVariables }
    }

    if (rawQuasarConf.animations === 'all') {
      rawQuasarConf.animations = require('./utils/animations.js')
    }

    try {
      await extensionRunner.runHook('extendQuasarConf', async hook => {
        log(`Extension(${ hook.api.extId }): Extending quasar.config file configuration...`)
        await hook.fn(rawQuasarConf, hook.api)
      })
    }
    catch (e) {
      console.log()
      console.error(e)

      if (failOnError === true) {
        fatal('One of your installed App Extensions failed to run', 'FAIL')
      }

      warn('One of your installed App Extensions failed to run.\n')
      return
    }

    const cfg = {
      ...rawQuasarConf,
      metaConf
    }

    // we need to know if using SSR + PWA immediately
    if (this.#ctx.mode.ssr) {
      cfg.ssr = merge({
        pwa: false,
        ssrPwaHtmlFilename: 'offline.html',
        manualStoreHydration: false,
        manualPostHydrationTrigger: false,
        prodPort: 3000 // gets superseded in production by an eventual process.env.PORT
      }, cfg.ssr)
    }

    // if DEV and not BEX mode (BEX does not use a regular devserver)
    if (this.#ctx.dev && this.#ctx.mode.bex !== true) {
      if (this.#opts.host) {
        cfg.devServer.host = this.#opts.host
      }
      else if (!cfg.devServer.host) {
        cfg.devServer.host = '0.0.0.0'
      }

      if (this.#opts.port) {
        cfg.devServer.port = this.#opts.port
        tip('You are using the --port parameter. It is recommended to use a different devServer port for each Quasar mode to avoid browser cache issues')
      }
      else if (!cfg.devServer.port) {
        cfg.devServer.port = defaultPortMapping[ this.#ctx.modeName ]
          + (this.#ctx.mode.ssr === true && cfg.ssr.pwa === true ? 50 : 0)
      }
      else {
        tip('You specified an explicit quasar.config file > devServer > port. It is recommended to use a different devServer > port for each Quasar mode to avoid browser cache issues. Example: ctx.mode.ssr ? 9100 : ...')
      }

      if (
        this.#address
        && this.#address.from.host === cfg.devServer.host
        && this.#address.from.port === cfg.devServer.port
      ) {
        cfg.devServer.host = this.#address.to.host
        cfg.devServer.port = this.#address.to.port
      }
      else {
        const addr = {
          host: cfg.devServer.host,
          port: cfg.devServer.port
        }
        const to = this.#ctx.dev === true
          ? await onAddress(addr, this.#ctx.modeName)
          : addr

        // if network error while running
        if (to === null) {
          if (failOnError === true) {
            fatal('Network error encountered while following the quasar.config file host/port config', 'FAIL')
          }

          warn('Network error encountered while following the quasar.config file host/port config. Reconfigure and save the file again.\n')
          return
        }

        cfg.devServer = merge({ open: true }, cfg.devServer, to)
        this.#address = {
          from: addr,
          to: {
            host: cfg.devServer.host,
            port: cfg.devServer.port
          }
        }
      }
    }

    if (cfg.css.length > 0) {
      cfg.css = cfg.css.filter(_ => _)
        .map(parseAssetProperty('src/css'))
        .filter(asset => asset.path)
        .filter(uniquePathFilter)
    }

    if (cfg.boot.length > 0) {
      cfg.boot = cfg.boot.filter(_ => _)
        .map(parseAssetProperty('boot'))
        .filter(asset => asset.path)
        .filter(uniquePathFilter)
    }

    if (cfg.extras.length > 0) {
      cfg.extras = getUniqueArray(cfg.extras)
    }

    if (cfg.animations.length > 0) {
      cfg.animations = getUniqueArray(cfg.animations)
    }

    if (![ 'kebab', 'pascal', 'combined' ].includes(cfg.framework.autoImportComponentCase)) {
      cfg.framework.autoImportComponentCase = 'kebab'
    }

    // special case where a component can be designated for a framework > config prop
    if (cfg.framework.config && cfg.framework.config.loading) {
      const component = cfg.framework.config.loading.spinner
      // Is a component and is a QComponent
      if (component !== void 0 && /^(Q[A-Z]|q-)/.test(component) === true) {
        cfg.framework.components.push(component)
      }
    }

    cfg.framework.components = getUniqueArray(cfg.framework.components)
    cfg.framework.directives = getUniqueArray(cfg.framework.directives)
    cfg.framework.plugins = getUniqueArray(cfg.framework.plugins)

    Object.assign(cfg.metaConf, {
      hasLoadingBarPlugin: cfg.framework.plugins.includes('LoadingBar'),
      hasMetaPlugin: cfg.framework.plugins.includes('Meta'),
      storePackage: storeProvider.name
    })

    cfg.build = merge({
      viteVuePluginOptions: {
        isProduction: this.#ctx.prod === true,
        template: {
          isProd: this.#ctx.prod === true,
          transformAssetUrls
        }
      },

      vueOptionsAPI: true,
      polyfillModulePreload: false,
      distDir: path.join('dist', this.#ctx.modeName),

      rawDefine: {
        // vue
        __VUE_OPTIONS_API__: cfg.build.vueOptionsAPI !== false,
        __VUE_PROD_DEVTOOLS__: cfg.metaConf.debugging,

        // vue-i18n
        __VUE_I18N_FULL_INSTALL__: true,
        __VUE_I18N_LEGACY_API__: true,
        __VUE_I18N_PROD_DEVTOOLS__: cfg.metaConf.debugging,
        __INTLIFY_PROD_DEVTOOLS__: cfg.metaConf.debugging
      },

      alias: {
        src: appPaths.srcDir,
        app: appPaths.appDir,
        components: appPaths.resolve.src('components'),
        layouts: appPaths.resolve.src('layouts'),
        pages: appPaths.resolve.src('pages'),
        assets: appPaths.resolve.src('assets'),
        boot: appPaths.resolve.src('boot'),
        stores: appPaths.resolve.src('stores')
      },

      useFilenameHashes: true,
      vueRouterMode: 'hash',
      minify: cfg.metaConf.debugging !== true
        && (this.#ctx.mode.bex !== true || cfg.bex.minify === true),
      sourcemap: cfg.metaConf.debugging === true
    }, cfg.build)

    if (!cfg.build.target.browser) {
      cfg.build.target.browser = [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1' ]
    }

    if (!cfg.build.target.node) {
      cfg.build.target.node = 'node16'
    }

    if (this.#ctx.mode.ssr) {
      cfg.build.vueRouterMode = 'history'
    }
    else if (this.#ctx.mode.cordova || this.#ctx.mode.capacitor || this.#ctx.mode.electron || this.#ctx.mode.bex) {
      cfg.build.vueRouterMode = 'hash'
    }

    if (!path.isAbsolute(cfg.build.distDir)) {
      cfg.build.distDir = appPaths.resolve.app(cfg.build.distDir)
    }

    cfg.build.publicPath
      = cfg.build.publicPath && [ 'spa', 'pwa', 'ssr' ].includes(this.#ctx.modeName)
        ? formatPublicPath(cfg.build.publicPath)
        : ([ 'capacitor', 'cordova', 'electron', 'bex' ].includes(this.#ctx.modeName) ? '' : '/')

    /* careful if you configure the following; make sure that you really know what you are doing */
    cfg.build.vueRouterBase = cfg.build.vueRouterBase !== void 0
      ? cfg.build.vueRouterBase
      : formatRouterBase(cfg.build.publicPath)

    // when adding new props here be sure to update
    // all impacted devserver diffs (look for this.registerDiff() calls)
    cfg.sourceFiles = merge({
      rootComponent: 'src/App.vue',
      router: 'src/router/index',
      store: `src/${ storeProvider.pathKey }/index`,
      pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
      pwaServiceWorker: 'src-pwa/custom-service-worker',
      pwaManifestFile: 'src-pwa/manifest.json',
      electronMain: 'src-electron/electron-main',
      electronPreload: 'src-electron/electron-preload'
    }, cfg.sourceFiles)

    if (appFilesValidations() === false) {
      if (failOnError === true) {
        fatal('Files validation not passed successfully', 'FAIL')
      }

      warn('Files validation not passed successfully. Please fix the issues then save the file again.\n')
      return
    }

    // do we have a store?
    const storePath = appPaths.resolve.app(cfg.sourceFiles.store)
    cfg.store = resolveExtension(storePath) !== void 0

    // make sure we have preFetch in config
    cfg.preFetch = cfg.preFetch || false

    if (this.#ctx.mode.capacitor & cfg.capacitor.capacitorCliPreparationParams.length === 0) {
      cfg.capacitor.capacitorCliPreparationParams = [ 'sync', this.#ctx.targetName ]
    }

    if (this.#ctx.mode.ssr) {
      if (cfg.ssr.manualPostHydrationTrigger !== true) {
        cfg.metaConf.needsAppMountHook = true
      }

      if (cfg.ssr.middlewares.length > 0) {
        cfg.ssr.middlewares = cfg.ssr.middlewares.filter(_ => _)
          .map(parseAssetProperty('src-ssr/middlewares'))
          .filter(asset => asset.path)
          .filter(uniquePathFilter)
      }

      if (cfg.ssr.pwa === true) {
        // install pwa mode if it's missing
        const { addMode } = require('../lib/modes/pwa/pwa-installation.js')
        await addMode(true)
      }

      this.#ctx.mode.pwa = cfg.ctx.mode.pwa = cfg.ssr.pwa === true

      if (this.#ctx.dev) {
        if (cfg.devServer.https === true) {
          const { getCertificate } = await import('@quasar/ssl-certificate')
          const sslCertificate = getCertificate({ log, fatal })
          cfg.devServer.https = {
            key: sslCertificate,
            cert: sslCertificate
          }
        }
        else if (Object(cfg.devServer.https) === cfg.devServer.https) {
          const { https } = cfg.devServer

          // we now check if config is specifying a file path
          // and we actually read the contents so we can later supply correct
          // params to the node HTTPS server
          ;[ 'ca', 'pfx', 'key', 'cert' ].forEach(prop => {
            if (typeof https[ prop ] === 'string') {
              try {
                https[ prop ] = readFileSync(https[ prop ])
              }
              catch (e) {
                console.error(e)
                console.log()
                delete https[ prop ]
                warn(`The devServer.https.${ prop } file could not be read. Removed the config.`)
              }
            }
          })
        }
      }
    }

    if (this.#ctx.dev) {
      if (this.#ctx.vueDevtools === true || cfg.build.vueDevtools === true) {
        cfg.metaConf.needsAppMountHook = true
        cfg.metaConf.vueDevtools = {
          host: cfg.devServer.host === '0.0.0.0' ? 'localhost' : cfg.devServer.host,
          port: 8098
        }
      }

      if (this.#ctx.mode.cordova || this.#ctx.mode.capacitor || this.#ctx.mode.electron) {
        if (this.#ctx.mode.electron) {
          cfg.devServer.https = false
        }
      }
      else if (cfg.devServer.open) {
        cfg.metaConf.openBrowser = !isMinimalTerminal
          ? cfg.devServer.open
          : false
      }

      delete cfg.devServer.open
    }

    if (this.#ctx.mode.pwa) {
      cfg.pwa = merge({
        workboxMode: 'generateSW',
        injectPwaMetaTags: true,
        swFilename: 'sw.js', // should be .js (as it's the distribution file, not the input file)
        manifestFilename: 'manifest.json',
        useCredentialsForManifestTag: false
      }, cfg.pwa)

      if (![ 'generateSW', 'injectManifest' ].includes(cfg.pwa.workboxMode)) {
        const msg = `Workbox strategy "${ cfg.pwa.workboxMode }" is invalid. `
          + 'Valid quasar.config file > pwa > workboxMode options are: generateSW or injectManifest.'

        if (failOnError === true) {
          fatal(msg, 'FAIL')
        }

        warn(msg + ' Please fix it then save the file again.\n')
        return
      }

      cfg.build.env.SERVICE_WORKER_FILE = `${ cfg.build.publicPath }${ cfg.pwa.swFilename }`
      cfg.metaConf.pwaManifestFile = appPaths.resolve.app(cfg.sourceFiles.pwaManifestFile)

      // resolve extension
      const swPath = appPaths.resolve.app(cfg.sourceFiles.pwaServiceWorker)
      cfg.sourceFiles.pwaServiceWorker = resolveExtension(swPath) || cfg.sourceFiles.pwaServiceWorker
    }

    if (this.#ctx.dev) {
      const getUrl = hostname => `http${ cfg.devServer.https ? 's' : '' }://${ hostname }:${ cfg.devServer.port }${ cfg.build.publicPath }`
      const hostname = cfg.devServer.host === '0.0.0.0'
        ? 'localhost'
        : cfg.devServer.host

      cfg.metaConf.APP_URL = getUrl(hostname)
      cfg.metaConf.getUrl = getUrl
    }
    else if (this.#ctx.mode.cordova || this.#ctx.mode.capacitor || this.#ctx.mode.bex) {
      cfg.metaConf.APP_URL = 'index.html'
    }
    // Electron is handled in lib/modes/electron/electron-builder.js -> #replaceAppUrl()

    Object.assign(cfg.build.env, {
      NODE_ENV: this.#ctx.prod ? 'production' : 'development',
      CLIENT: true,
      SERVER: false,
      DEV: this.#ctx.dev === true,
      PROD: this.#ctx.prod === true,
      DEBUGGING: cfg.metaConf.debugging === true,
      MODE: this.#ctx.modeName,
      VUE_ROUTER_MODE: cfg.build.vueRouterMode,
      VUE_ROUTER_BASE: cfg.build.vueRouterBase
    })

    if (cfg.metaConf.APP_URL) {
      cfg.build.env.APP_URL = cfg.metaConf.APP_URL
    }

    // get the env variables from host project env files
    const { fileEnv, usedEnvFiles, envFromCache } = readFileEnv({
      quasarMode: this.#ctx.modeName,
      buildType: this.#ctx.dev ? 'dev' : 'prod',
      envFolder: cfg.build.envFolder,
      envFiles: cfg.build.envFiles
    })

    cfg.metaConf.fileEnv = fileEnv

    if (envFromCache === false && usedEnvFiles.length !== 0) {
      log(`Using .env files: ${ usedEnvFiles.join(', ') }`)
    }

    if (this.#ctx.mode.electron && this.#ctx.prod) {
      const bundler = require('./modes/electron/bundler.js')

      const icon = appPaths.resolve.electron('icons/icon.png')
      const builderIcon = process.platform === 'linux'
        // backward compatible (linux-512x512.png)
        ? (existsSync(icon) === true ? icon : appPaths.resolve.electron('icons/linux-512x512.png'))
        : appPaths.resolve.electron('icons/icon')

      cfg.electron = merge({
        inspectPort: 5858,
        packager: {
          asar: true,
          icon: appPaths.resolve.electron('icons/icon'),
          overwrite: true
        },
        builder: {
          appId: 'quasar-app',
          icon: builderIcon,
          productName: appPkg.productName || appPkg.name || 'Quasar App',
          directories: {
            buildResources: appPaths.resolve.electron('')
          }
        }
      }, cfg.electron, {
        packager: {
          dir: path.join(cfg.build.distDir, 'UnPackaged'),
          out: path.join(cfg.build.distDir, 'Packaged')
        },
        builder: {
          directories: {
            app: path.join(cfg.build.distDir, 'UnPackaged'),
            output: path.join(cfg.build.distDir, 'Packaged')
          }
        }
      })

      if (cfg.ctx.bundlerName) {
        cfg.electron.bundler = cfg.ctx.bundlerName
      }
      else if (!cfg.electron.bundler) {
        cfg.electron.bundler = bundler.getDefaultName()
      }

      if (this.#opts.argv !== void 0) {
        const { ensureElectronArgv } = require('./utils/ensure-argv.js')
        ensureElectronArgv(cfg.electron.bundler, this.#opts.argv)
      }

      if (cfg.electron.bundler === 'packager') {
        if (cfg.ctx.targetName) {
          cfg.electron.packager.platform = cfg.ctx.targetName
        }
        if (cfg.ctx.archName) {
          cfg.electron.packager.arch = cfg.ctx.archName
        }
      }
      else {
        cfg.electron.builder = {
          config: cfg.electron.builder
        }

        if (cfg.ctx.targetName === 'mac' || cfg.ctx.targetName === 'darwin' || cfg.ctx.targetName === 'all') {
          cfg.electron.builder.mac = []
        }

        if (cfg.ctx.targetName === 'linux' || cfg.ctx.targetName === 'all') {
          cfg.electron.builder.linux = []
        }

        if (cfg.ctx.targetName === 'win' || cfg.ctx.targetName === 'win32' || cfg.ctx.targetName === 'all') {
          cfg.electron.builder.win = []
        }

        if (cfg.ctx.archName) {
          cfg.electron.builder[ cfg.ctx.archName ] = true
        }

        if (cfg.ctx.publish) {
          cfg.electron.builder.publish = cfg.ctx.publish
        }
      }

      bundler.ensureInstall(cfg.electron.bundler)
    }

    cfg.htmlVariables = merge({
      ctx: cfg.ctx,
      process: { env: cfg.build.env },
      productName: escapeHTMLTagContent(appPkg.productName),
      productDescription: escapeHTMLAttribute(appPkg.description)
    }, cfg.htmlVariables)

    if (this.#ctx.mode.capacitor && cfg.metaConf.versions.capacitorPluginSplashscreen && cfg.capacitor.hideSplashscreen !== false) {
      cfg.metaConf.needsAppMountHook = true
    }

    return cfg
  }
}
