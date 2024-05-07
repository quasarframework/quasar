const path = require('path')
const { existsSync } = require('fs')
const { merge } = require('webpack-merge')
const chokidar = require('chokidar')
const debounce = require('lodash/debounce')
const { transformAssetUrls } = require('@quasar/vite-plugin')

const appPaths = require('./app-paths')
const { log, warn, tip } = require('./helpers/logger')
const extensionRunner = require('./app-extension/extensions-runner')
const appFilesValidations = require('./helpers/app-files-validations')
const cssVariables = require('./helpers/css-variables')
const getPackageMajorVersion = require('./helpers/get-package-major-version')
const resolveExtension = require('./helpers/resolve-extension')
const storeProvider = require('./helpers/store-provider')

const urlRegex = /^http(s)?:\/\//i
const quasarComponentRE = /^(Q[A-Z]|q-)/
const { findClosestOpenPort, localHostList } = require('./helpers/net')
const isMinimalTerminal = require('./helpers/is-minimal-terminal')

const appPkg = require(appPaths.resolve.app('package.json'))

const defaultPortMapping = {
  spa: 9000,
  ssr: 9100, // 9150 for SSR + PWA
  pwa: 9200,
  electron: 9300,
  cordova: 9400,
  capacitor: 9500
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

const extRE = /\.[m|c]?[j|t]s$/
function formatQuasarAssetPath (asset, type) {
  return asset.indexOf('/') !== -1
    ? (
        extRE.test(asset) === true
          ? asset
          : `${ asset }.js`
      )
    : `quasar/${ type }/${ asset }.js`
}

async function onAddress ({ host, port }, mode) {
  if (this.chosenHost) {
    host = this.chosenHost
  }
  else if (
    [ 'cordova', 'capacitor' ].includes(mode)
    && (!host || localHostList.includes(host.toLowerCase()))
  ) {
    const getExternalIP = require('./helpers/get-external-ip')
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

class QuasarConfFile {
  #ctx
  #opts
  #initialVersions = {}
  #address
  #vueDevtools

  constructor ({ ctx, host, port, verifyAddress }) {
    this.#ctx = ctx
    this.#opts = { host, port, verifyAddress }

    if (this.#ctx.mode.pwa) {
      // Enable this when workbox bumps version (as of writing these lines, we're handling v6)
      // this.#initialVersions.workbox = getPackageMajorVersion('workbox-build')
    }
    else if (this.#ctx.mode.capacitor) {
      const { capVersion } = require('./modes/capacitor/cap-cli')
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

  watch (onChange) {
    // Watch for quasar.conf(ig).js changes
    chokidar
      .watch(appPaths.quasarConfigFilename, { ignoreInitial: true })
      .on('change', debounce(async () => {
        console.log()
        log('Reading quasar.config.js as it changed')

        const result = await this.read()

        if (result.error !== void 0) {
          warn(result.error)
          warn('Changes to quasar.config.js have NOT been applied due to error above')
        }
        else {
          log('Applying quasar.config.js changes')
          log()

          onChange(result)
        }
      }, 550))
  }

  async read () {
    let quasarConfigFunction

    try {
      delete require.cache[ appPaths.quasarConfigFilename ]
      quasarConfigFunction = require(appPaths.quasarConfigFilename)
    }
    catch (e) {
      console.error(e)
      return { error: 'quasar.config.js has JS errors' }
    }

    let userCfg

    try {
      userCfg = await quasarConfigFunction(this.#ctx)
    }
    catch (e) {
      console.error(e)
      return { error: 'quasar.config.js has JS errors' }
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
        resolve: {},
        htmlMinifyOptions: {}
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
      rawQuasarConf.animations = require('./helpers/animations')
    }

    try {
      await extensionRunner.runHook('extendQuasarConf', async hook => {
        log(`Extension(${ hook.api.extId }): Extending quasar.config.js...`)
        await hook.fn(rawQuasarConf, hook.api)
      })
    }
    catch (e) {
      console.error(e)
      return { error: 'One of your installed App Extensions failed to run' }
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
        tip('You specified an explicit quasar.config.js > devServer > port. It is recommended to use a different devServer > port for each Quasar mode to avoid browser cache issues. Example: ctx.mode.ssr ? 9100 : ...')
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
        const to = this.#opts.verifyAddress === true
          ? await onAddress(addr, this.#ctx.modeName)
          : addr

        // if network error while running
        if (to === null) {
          return { error: 'Network error encountered while following the quasar.config.js host/port config' }
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
    const { config } = cfg.framework

    if (config.loading) {
      const { spinner } = config.loading
      if (quasarComponentRE.test(spinner)) {
        cfg.framework.components.push(spinner)
      }
    }

    if (config.notify) {
      const { spinner } = config.notify
      if (quasarComponentRE.test(spinner)) {
        cfg.framework.components.push(spinner)
      }
    }

    cfg.framework.components = getUniqueArray(cfg.framework.components)
    cfg.framework.directives = getUniqueArray(cfg.framework.directives)
    cfg.framework.plugins = getUniqueArray(cfg.framework.plugins)

    const { lang, iconSet } = cfg.framework

    if (lang !== void 0) {
      cfg.framework.lang = formatQuasarAssetPath(lang, 'lang')
    }

    if (iconSet !== void 0) {
      cfg.framework.iconSet = formatQuasarAssetPath(iconSet, 'icon-set')
    }

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

      htmlMinifyOptions: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        removeScriptTypeAttributes: true
        // more options:
        // https://github.com/terser/html-minifier-terser?tab=readme-ov-file#options-quick-reference
      },

      rawDefine: {
        // vue
        __VUE_OPTIONS_API__: cfg.build.vueOptionsAPI !== false,
        __VUE_PROD_DEVTOOLS__: cfg.metaConf.debugging,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: cfg.metaConf.debugging, // Vue 3.4+

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

    if (appFilesValidations(cfg) === false) {
      return { error: 'Files validation not passed successfully' }
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
        const { add } = require('../lib/modes/pwa/pwa-installation')
        await add(true)
      }

      this.#ctx.mode.pwa = cfg.ctx.mode.pwa = cfg.ssr.pwa === true
    }

    if (this.#ctx.dev) {
      if (this.#ctx.vueDevtools === true || cfg.build.vueDevtools === true) {
        if (this.#vueDevtools === void 0) {
          const host = localHostList.includes(cfg.devServer.host.toLowerCase())
            ? 'localhost'
            : cfg.devServer.host

          this.#vueDevtools = {
            host,
            port: await findClosestOpenPort(11111, '0.0.0.0')
          }
        }

        cfg.metaConf.vueDevtools = { ...this.#vueDevtools }
      }

      if (this.#ctx.mode.ssr && cfg.devServer.https === true) {
        // TODO SSR + HTTPS
        warn('SSR on HTTPS is not currently supported, so disabling it.')
        cfg.devServer.https = false
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
        return {
          error: `Workbox strategy "${ cfg.pwa.workboxMode }" is invalid. `
            + 'Valid quasar.config.js > pwa > workboxMode options are: generateSW or injectManifest\n'
        }
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

    if (this.#ctx.mode.electron && this.#ctx.prod) {
      const bundler = require('./modes/electron/bundler')

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
        const { ensureElectronArgv } = require('./helpers/ensure-argv')
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

module.exports = QuasarConfFile
