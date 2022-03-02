const path = require('path')
const fs = require('fs')
const { merge } = require('webpack-merge')
const chokidar = require('chokidar')
const debounce = require('lodash.debounce')
const { transformAssetUrls } = require('@quasar/vite-plugin')

const appPaths = require('./app-paths')
const { log, warn } = require('./helpers/logger')
const extensionRunner = require('./app-extension/extensions-runner')
const appFilesValidations = require('./helpers/app-files-validations')
const cssVariables = require('./helpers/css-variables')
const getPackageMajorVersion = require('./helpers/get-package-major-version')

const urlRegex = /^http(s)?:\/\//i
const { findClosestOpenPort } = require('../lib/helpers/net')
const isMinimalTerminal = require('./helpers/is-minimal-terminal')

const quasarConfFilename = appPaths.resolve.app('quasar.config.js')
const appPkg = require(appPaths.resolve.app('package.json'))

const confErrors = {
  CANNOT_READ: { error: 'Could not load quasar.config.js config file' },
  HAS_JS_ERRORS: { error: 'quasar.config.js has JS errors' },
  EXTENSIONS_FAILED: { error: 'One of your installed App Extensions failed to run' },
  NETWORK_ERROR: { error: 'Network error encountered while following the quasar.conf host/port config' },
  FILES_VALIDATION_ERROR: { error: 'Files validation not passed successfully' }
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
    path = `${path}/`
  }

  if (urlRegex.test(path) === true) {
    return path
  }

  if (!path.startsWith('/')) {
    path = `/${path}`
  }

  return path
}

function formatRouterBase (publicPath) {
  if (!publicPath || !publicPath.startsWith('http')) {
    return publicPath
  }

  const match = publicPath.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/)
  return formatPublicPath(match[5] || '')
}

function parseAssetProperty (prefix) {
  return asset => {
    if (typeof asset === 'string') {
      return {
        path: asset[0] === '~' ? asset.substring(1) : prefix + `/${asset}`
      }
    }

    return {
      ...asset,
      path: typeof asset.path === 'string'
        ? (asset.path[0] === '~' ? asset.path.substring(1) : prefix + `/${asset.path}`)
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
    ['cordova', 'capacitor'].includes(mode) &&
    (!host || ['0.0.0.0', 'localhost', '127.0.0.1', '::1'].includes(host.toLowerCase()))
  ) {
    const getExternalIP = require('../lib/helpers/get-external-ip')
    host = await getExternalIP()
    this.chosenHost = host
  }

  try {
    const openPort = await findClosestOpenPort(port, host)
    if (port !== openPort) {
      warn()
      warn(`️️Setting port to closest one available: ${openPort}`)
      warn()

      port = openPort
    }
  }
  catch (e) {
    warn()

    if (e.message === 'ERROR_NETWORK_PORT_NOT_AVAIL') {
      warn(`Could not find an open port. Please configure a lower one to start searching with.`)
    }
    else if (e.message === 'ERROR_NETWORK_ADDRESS_NOT_AVAIL') {
      warn(`Invalid host specified. No network address matches. Please specify another one.`)
    }
    else {
      warn(`Unknown network error occurred`)
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
  constructor ({ ctx, host, port }) {
    this.ctx = ctx
    this.opts = { host, port }

    if (this.ctx.mode.capacitor) {
      const { capVersion } = require('./modes/capacitor/cap-cli')
      const getCapPluginVersion = capVersion <= 2
        ? () => true
        : name => {
          const version = getPackageMajorVersion(name, appPaths.capacitorDir)
          return version === void 0
            ? false
            : version || true
        }

      this.initialVersions = {
        capacitor: capVersion,
        capacitorPluginApp: getCapPluginVersion('@capacitor/app'),
        capacitorPluginSplashscreen: getCapPluginVersion('@capacitor/splash-screen')
      }
    }
  }

  watch (onChange) {
    // Watch for quasar.config.js changes
    chokidar
    .watch(quasarConfFilename, { watchers: { chokidar: { ignoreInitial: true } } })
    .on('change', debounce(async () => {
      console.log()
      log(`Reading quasar.config.js as it changed`)

      const result = await this.read()

      if (result.error !== void 0) {
        warn(result.error)
      }
      else {
        log(`Queuing quasar.config.js changes`)
        log()

        onChange(result)
      }
    }, 550))
  }

  async read () {
    let quasarConfigFunction

    if (fs.existsSync(quasarConfFilename)) {
      try {
        delete require.cache[quasarConfFilename]
        quasarConfigFunction = require(quasarConfFilename)
      }
      catch (e) {
        console.error(e)
        return confErrors.HAS_JS_ERRORS
      }
    }
    else {
      return confErrors.CANNOT_READ
    }

    let userCfg

    try {
      userCfg = await quasarConfigFunction(this.ctx)
    }
    catch (e) {
      console.error(e)
      return confErrors.HAS_JS_ERRORS
    }

    const rawQuasarConf = merge({
      ctx: this.ctx,
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

      linter: {},

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
        css: {},
        json: {},
        esbuild: {},
        rollupOptions: {},
        commonjsOptions: {},
        dynamicImportVarsOptions: {},
        optimizeDeps: {},
        worker: {}
      },

      ssr: {
        middlewares: []
      },
      pwa: {
        workboxOptions: {},
        manifest: {
          icons: []
        },
        metaVariables: {}
      },
      electron: {
        unPackagedInstallParams: [],
        packager: {},
        builder: {}
      },
      cordova: {
      },
      capacitor: {
        capacitorCliPreparationParams: []
      },
      bex: {
        builder: {
          directories: {}
        }
      }
    }, userCfg)

    const metaConf = {
      debugging: this.ctx.dev === true || this.ctx.debug === true,
      needsAppMountHook: false,
      vueDevtools: false,
      versions: { ...this.initialVersions }, // used by .quasar entry templates
      css: { ...cssVariables }
    }

    if (rawQuasarConf.animations === 'all') {
      rawQuasarConf.animations = require('./helpers/animations')
    }

    try {
      await extensionRunner.runHook('extendQuasarConf', async hook => {
        log(`Extension(${hook.api.extId}): Extending quasar.conf...`)
        await hook.fn(rawQuasarConf, hook.api)
      })
    }
    catch (e) {
      console.error(e)
      return confErrors.EXTENSIONS_FAILED
    }

    const cfg = {
      ...rawQuasarConf,
      metaConf
    }

    if (this.ctx.dev) {
      if (this.opts.host) {
        cfg.devServer.host = this.opts.host
      }
      else if (!cfg.devServer.host) {
        cfg.devServer.host = '0.0.0.0'
      }

      if (this.opts.port) {
        cfg.devServer.port = this.opts.port
      }
      else if (!cfg.devServer.port) {
        cfg.devServer.port = 8080
      }

      if (
        this.address &&
        this.address.from.host === cfg.devServer.host &&
        this.address.from.port === cfg.devServer.port
      ) {
        cfg.devServer.host = this.address.to.host
        cfg.devServer.port = this.address.to.port
      }
      else {
        const addr = {
          host: cfg.devServer.host,
          port: cfg.devServer.port
        }
        const to = this.ctx.dev === true
          ? await onAddress(addr, this.ctx.modeName)
          : addr

        // if network error while running
        if (to === null) {
          return confErrors.NETWORK_ERROR
        }

        cfg.devServer = merge({ open: true }, cfg.devServer, to)
        this.address = {
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

    if (!['kebab', 'pascal', 'combined'].includes(cfg.framework.autoImportComponentCase)) {
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
      hasMetaPlugin: cfg.framework.plugins.includes('Meta')
    })

    cfg.linter = merge({
      warnings: true,
      errors: true
    }, cfg.linter)

    cfg.build = merge({
      viteVuePluginOptions: {
        isProduction: this.ctx.prod === true,
        template: {
          isProd: this.ctx.prod === true,
          transformAssetUrls
        }
      },

      vueOptionsAPI: true,
      polyfillModulePreload: false,
      distDir: path.join('dist', this.ctx.modeName),

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

      resolve: {
        alias: {
          src: appPaths.srcDir,
          app: appPaths.appDir,
          components: appPaths.resolve.src(`components`),
          layouts: appPaths.resolve.src(`layouts`),
          pages: appPaths.resolve.src(`pages`),
          assets: appPaths.resolve.src(`assets`),
          boot: appPaths.resolve.src(`boot`)
        }
      },

      productName: appPkg.productName,
      productDescription: appPkg.description,
      ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
                                          // will mess up SSR
      vueRouterMode: 'hash',
      minify: !cfg.metaConf.debugging && this.ctx.mode.bex !== true,
      sourcemap: cfg.metaConf.debugging === true
    }, cfg.build)

    if (!cfg.build.target.browser) {
      cfg.build.target.browser = [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1' ]
    }

    if (!cfg.build.target.node) {
      cfg.build.target.node = 'node16'
    }

    if (this.ctx.mode.ssr) {
      cfg.build.vueRouterMode = 'history'
    }
    else if (this.ctx.mode.cordova || this.ctx.mode.capacitor || this.ctx.mode.electron || this.ctx.mode.bex) {
      Object.assign(cfg.build, {
        vueRouterMode: 'hash'
      })
    }

    if (!path.isAbsolute(cfg.build.distDir)) {
      cfg.build.distDir = appPaths.resolve.app(cfg.build.distDir)
    }

    if (this.ctx.mode.cordova || this.ctx.mode.capacitor) {
      cfg.metaConf.packagedDistDir = path.join(cfg.build.distDir, this.ctx.targetName)
    }

    if (this.ctx.mode.cordova || this.ctx.mode.capacitor) {
      cfg.build.distDir = appPaths.resolve[this.ctx.modeName]('www')
    }
    else if (this.ctx.mode.electron || this.ctx.mode.bex) {
      cfg.metaConf.packagedDistDir = cfg.build.distDir
      cfg.build.distDir = path.join(cfg.build.distDir, 'UnPackaged')
    }

    cfg.build.publicPath =
      cfg.build.publicPath && ['spa', 'pwa', 'ssr'].includes(this.ctx.modeName)
        ? formatPublicPath(cfg.build.publicPath)
        : (['capacitor', 'cordova', 'electron'].includes(this.ctx.modeName) ? '' : '/')

    /* careful if you configure the following; make sure that you really know what you are doing */
    cfg.build.vueRouterBase = cfg.build.vueRouterBase !== void 0
      ? cfg.build.vueRouterBase
      : formatRouterBase(cfg.build.publicPath)

    cfg.sourceFiles = merge({
      rootComponent: 'src/App.vue',
      router: 'src/router/index',
      store: 'src/store/index',
      registerServiceWorker: 'src-pwa/register-service-worker',
      serviceWorker: 'src-pwa/custom-service-worker',
      electronMain: 'src-electron/electron-main',
      electronPreload: 'src-electron/electron-preload'
    }, cfg.sourceFiles)

    if (appFilesValidations(cfg) === false) {
      return confErrors.FILES_VALIDATION_ERROR
    }

    // do we got vuex?
    const storePath = appPaths.resolve.app(cfg.sourceFiles.store)
    cfg.store = (
      fs.existsSync(storePath) ||
      fs.existsSync(storePath + '.js') ||
      fs.existsSync(storePath + '.ts')
    )

    // make sure we have preFetch in config
    cfg.preFetch = cfg.preFetch || false

    if (this.ctx.mode.capacitor & cfg.capacitor.capacitorCliPreparationParams.length === 0) {
      cfg.capacitor.capacitorCliPreparationParams = [ 'sync', this.ctx.targetName ]
    }

    if (this.ctx.mode.ssr) {
      cfg.ssr = merge({
        pwa: false,
        manualStoreHydration: false,
        manualPostHydrationTrigger: false,
        prodPort: 3000 // gets superseeded in production by an eventual process.env.PORT
      }, cfg.ssr)

      if (cfg.ssr.manualPostHydrationTrigger !== true) {
        cfg.metaConf.needsAppMountHook = true
      }

      if (cfg.ssr.middlewares.length > 0) {
        cfg.ssr.middlewares = cfg.ssr.middlewares.filter(_ => _)
          .map(parseAssetProperty('src-ssr/middlewares'))
          .filter(asset => asset.path)
          .filter(uniquePathFilter)
      }

      if (cfg.ssr.pwa) {
        // install pwa mode if it's missing
        const { add } = require(`../lib/modes/pwa/pwa-installation`)
        await add()

        cfg.build.rawDefine.__QUASAR_SSR_PWA__ = true
      }

      cfg.metaConf.ssrServerScript = appPaths.resolve.ssr('server.js')
      this.ctx.mode.pwa = cfg.ctx.mode.pwa = !!cfg.ssr.pwa
    }

    if (this.ctx.dev) {
      if (this.ctx.vueDevtools === true || cfg.build.vueDevtools === true) {
        cfg.metaConf.needsAppMountHook = true
        cfg.metaConf.vueDevtools = {
          host: cfg.devServer.host === '0.0.0.0' ? 'localhost' : cfg.devServer.host,
          port: 8098
        }
      }

      if (this.ctx.mode.cordova || this.ctx.mode.capacitor || this.ctx.mode.electron) {
        if (this.ctx.mode.electron) {
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

    if (this.ctx.mode.pwa) {
      cfg.pwa = merge({
        workboxPluginMode: 'GenerateSW',
        workboxOptions: {},
        useCredentials: false,
        manifest: {
          name: appPkg.productName || appPkg.name || 'Quasar App',
          short_name: appPkg.name || 'quasar-pwa',
          description: appPkg.description,
          display: 'standalone',
          start_url: '.'
        },
        metaVariables: {
          appleMobileWebAppCapable: 'yes',
          appleMobileWebAppStatusBarStyle: 'default',
          appleTouchIcon120: 'icons/apple-icon-120x120.png',
          appleTouchIcon152: 'icons/apple-icon-152x152.png',
          appleTouchIcon167: 'icons/apple-icon-167x167.png',
          appleTouchIcon180: 'icons/apple-icon-180x180.png',
          appleSafariPinnedTab: 'icons/safari-pinned-tab.svg',
          msapplicationTileImage: 'icons/ms-icon-144x144.png',
          msapplicationTileColor: '#000000'
        }
      }, cfg.pwa)

      if (cfg.pwa.manifest.icons.length === 0) {
        warn()
        warn(`PWA manifest in quasar.config.js > pwa > manifest is missing "icons" prop.\n`)
        process.exit(1)
      }

      if (!['GenerateSW', 'InjectManifest'].includes(cfg.pwa.workboxPluginMode)) {
        warn()
        warn(`Workbox webpack plugin mode "${cfg.pwa.workboxPluginMode}" is invalid.`)
        warn(`Valid Workbox modes are: GenerateSW, InjectManifest\n`)
        process.exit(1)
      }

      cfg.pwa.manifest.icons = cfg.pwa.manifest.icons.map(icon => {
        if (urlRegex.test(icon.src) === false) {
          icon.src = `${cfg.build.publicPath}${icon.src}`
        }
        return icon
      })
    }

    if (this.ctx.dev) {
      const getUrl = hostname => `http${cfg.devServer.https ? 's' : ''}://${hostname}:${cfg.devServer.port}${cfg.build.publicPath}`
      const hostname = cfg.devServer.host === '0.0.0.0'
        ? 'localhost'
        : cfg.devServer.host

      cfg.metaConf.APP_URL = getUrl(hostname)
      cfg.metaConf.getUrl = getUrl
    }
    else if (this.ctx.mode.cordova || this.ctx.mode.capacitor || this.ctx.mode.bex) {
      cfg.metaConf.APP_URL = 'index.html'
    }

    Object.assign(cfg.build.env, {
      NODE_ENV: this.ctx.prod ? 'production' : 'development',
      CLIENT: true,
      SERVER: false,
      DEV: this.ctx.dev === true,
      PROD: this.ctx.prod === true,
      DEBUGGING: cfg.metaConf.debugging === true,
      MODE: this.ctx.modeName,
      VUE_ROUTER_MODE: cfg.build.vueRouterMode,
      VUE_ROUTER_BASE: cfg.build.vueRouterBase,
    })

    if (cfg.metaConf.APP_URL) {
      cfg.build.env.APP_URL = cfg.metaConf.APP_URL
    }

    if (this.ctx.mode.pwa) {
      cfg.build.env.SERVICE_WORKER_FILE = `${cfg.build.publicPath}service-worker.js`
    }
    else if (this.ctx.mode.bex) {
      cfg.bex = merge({}, cfg.bex, {
        builder: {
          directories: {
            input: cfg.build.distDir,
            output: path.join(cfg.metaConf.packagedDistDir, 'Packaged')
          }
        }
      })
    }
    else if (this.ctx.mode.electron && this.ctx.prod) {
      const bundler = require('./modes/electron/bundler')

      const icon = appPaths.resolve.electron('icons/icon.png')
      const builderIcon = process.platform === 'linux'
        // backward compatible (linux-512x512.png)
        ? (fs.existsSync(icon) === true ? icon : appPaths.resolve.electron('icons/linux-512x512.png'))
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
          dir: cfg.build.distDir,
          out: cfg.metaConf.packagedDistDir
        },
        builder: {
          directories: {
            app: cfg.build.distDir,
            output: path.join(cfg.metaConf.packagedDistDir, 'Packaged')
          }
        }
      })

      if (cfg.ctx.bundlerName) {
        cfg.electron.bundler = cfg.ctx.bundlerName
      }
      else if (!cfg.electron.bundler) {
        cfg.electron.bundler = bundler.getDefaultName()
      }

      if (this.opts.argv !== void 0) {
        const { ensureElectronArgv } = require('./helpers/ensure-argv')
        ensureElectronArgv(cfg.electron.bundler, this.opts.argv)
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
          cfg.electron.builder[cfg.ctx.archName] = true
        }

        if (cfg.ctx.publish) {
          cfg.electron.builder.publish = cfg.ctx.publish
        }
      }

      bundler.ensureInstall(cfg.electron.bundler)
    }

    cfg.htmlVariables = merge({
      ctx: cfg.ctx,
      process: {
        env: cfg.build.env
      },
      productName: escapeHTMLTagContent(cfg.build.productName),
      productDescription: escapeHTMLAttribute(cfg.build.productDescription)
    }, cfg.htmlVariables)

    if (this.ctx.mode.capacitor && cfg.metaConf.versions.capacitorPluginSplashscreen && cfg.capacitor.hideSplashscreen !== false) {
      cfg.metaConf.needsAppMountHook = true
    }

    return cfg
  }
}

module.exports = QuasarConfFile
