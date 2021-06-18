const path = require('path')
const fs = require('fs')
const { merge } = require('webpack-merge')
const chokidar = require('chokidar')
const debounce = require('lodash.debounce')
const { green } = require('chalk')

const appPaths = require('./app-paths')
const { log, warn, fatal, error } = require('./helpers/logger')
const extensionRunner = require('./app-extension/extensions-runner')
const appFilesValidations = require('./helpers/app-files-validations')
const cssVariables = require('./helpers/css-variables')
const getDevlandFile = require('./helpers/get-devland-file')
const getPackageMajorVersion = require('./helpers/get-package-major-version')
const { quasarVersion } = require('./helpers/banner')

const transformAssetUrls = getDevlandFile('quasar/dist/transforms/loader-asset-urls.json')
const urlRegex = /^http(s)?:\/\//
const ssrDirectivesFile = appPaths.resolve.app('.quasar/ssr/compiled-directives.js')

function encode (obj) {
  return JSON.stringify(obj, (_, value) => {
    return typeof value === 'function'
      ? `/fn(${value.toString()})`
      : value
  })
}

function formatPublicPath (path) {
  if (!path) {
    return ''
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

function uniqueRegexFilter (value, index, self) {
  return self.map(regex => regex.toString()).indexOf(value.toString()) === index
}

/*
 * this.quasarConf          - Compiled Object from quasar.conf.js
 * this.webpackConf         - Webpack config(s)
 */

class QuasarConfFile {
  constructor (ctx, opts = {}) {
    this.ctx = ctx
    this.opts = opts
    this.filename = appPaths.resolve.app('quasar.conf.js')
    this.pkg = require(appPaths.resolve.app('package.json'))
    this.watch = opts.onBuildChange || opts.onAppChange

    if (this.watch) {
      // Start watching for quasar.config.js changes
      chokidar
      .watch(this.filename, { watchers: { chokidar: { ignoreInitial: true } } })
      .on('change', debounce(async () => {
        console.log()
        log(`quasar.conf.js changed`)

        const result = await this.reboot()

        if (result !== false) {
          if (this.webpackConfChanged === true) {
            opts.onBuildChange()
          }
          else {
            opts.onAppChange()
          }
        }
      }, 1000))
    }
  }

  async reboot () {
    try {
      await this.prepare()
    }
    catch (e) {
      if (e.message !== 'NETWORK_ERROR') {
        console.error(e)
        warn(`quasar.conf.js has JS errors. Please fix them then save file again.\n`)
      }

      return false
    }

    await this.compile()
  }

  async prepare () {
    let quasarConfigFunction

    if (fs.existsSync(this.filename)) {
      delete require.cache[this.filename]
      quasarConfigFunction = require(this.filename)
    }
    else {
      fatal('Could not load quasar.conf.js config file', 'FAIL')
    }

    if (this.ctx.mode.ssr) {
      try {
        delete require.cache[ssrDirectivesFile]
        this.devlandSsrDirectives = require(ssrDirectivesFile).default
      }
      catch (err) {
        error('Could not load the compiled file of devland SSR directives:\n', 'FAIL')
        console.log(err)
        console.log()
        process.exit(1)
      }
    }

    const initialConf = await quasarConfigFunction(this.ctx)

    const cfg = merge({
      ctx: this.ctx,
      css: [],
      boot: [],
      vendor: {
        add: [],
        remove: []
      },
      build: {
        transpileDependencies: [],
        vueLoaderOptions: {
          compilerOptions: {},
          transformAssetUrls: {}
        },
        sassLoaderOptions: {},
        scssLoaderOptions: {},
        stylusLoaderOptions: {},
        lessLoaderOptions: {},
        env: {},
        uglifyOptions: {
          compress: {},
          mangle: {}
        }
      },
      devServer: {},
      framework: {
        components: [],
        directives: [],
        plugins: []
      },
      animations: [],
      extras: [],
      sourceFiles: {},
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
      cordova: {},
      capacitor: {
        capacitorCliPreparationParams: []
      },
      bin: {},
      bex: {
        builder: {
          directories: {}
        }
      },
      htmlVariables: {}
    }, initialConf)

    if (cfg.animations === 'all') {
      cfg.animations = require('./helpers/animations')
    }

    if (!cfg.framework.plugins) {
      cfg.framework.plugins = []
    }
    if (!cfg.framework.config) {
      cfg.framework.config = {}
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
        const to = this.opts.onAddress !== void 0
          ? await this.opts.onAddress(addr)
          : addr

        // if network error while running
        if (to === null) {
          throw new Error('NETWORK_ERROR')
        }

        cfg.devServer = merge({}, cfg.devServer, to)
        this.address = {
          from: addr,
          to: {
            host: cfg.devServer.host,
            port: cfg.devServer.port
          }
        }
      }
    }

    this.sourceCfg = cfg
  }

  async compile () {
    let cfg = this.sourceCfg

    await extensionRunner.runHook('extendQuasarConf', async hook => {
      log(`Extension(${hook.api.extId}): Extending quasar.conf...`)
      await hook.fn(cfg, hook.api)
    })

    // If watching for changes then determine the type of them (webpack or not).
    // The snapshot below should only contain webpack config:
    if (this.watch) {
      const newConfigSnapshot = [
        cfg.build ? encode(cfg.build) : '',
        cfg.ssr && cfg.ssr.pwa ? encode(cfg.ssr.pwa) : '',
        cfg.framework ? cfg.framework.autoImportComponentCase : '',
        cfg.devServer ? encode(cfg.devServer) : '',
        cfg.pwa ? encode(cfg.pwa) : '',
        cfg.electron ? encode(cfg.electron) : '',
        cfg.bex ? encode(cfg.bex) : '',
        cfg.htmlVariables ? encode(cfg.htmlVariables) : ''
      ].join('')

      if (this.oldConfigSnapshot) {
        this.webpackConfChanged = newConfigSnapshot !== this.oldConfigSnapshot
      }

      this.oldConfigSnapshot = newConfigSnapshot
    }

    // make sure these exist
    cfg.__rootDefines = {
      // vue
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: this.ctx.dev === true || this.ctx.debug === true,

      // quasar
      __QUASAR_VERSION__: JSON.stringify(quasarVersion),
      __QUASAR_SSR__: this.ctx.mode.ssr === true,
      __QUASAR_SSR_SERVER__: false,
      __QUASAR_SSR_CLIENT__: false,
      __QUASAR_SSR_PWA__: false,

      // vue-i18n
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: true,
      __VUE_I18N_PROD_DEVTOOLS__: this.ctx.dev === true || this.ctx.debug === true,
      __INTLIFY_PROD_DEVTOOLS__: this.ctx.dev === true || this.ctx.debug === true
    }

    cfg.__needsAppMountHook = false
    cfg.__vueDevtools = false
    cfg.supportTS = cfg.supportTS || false

    if (cfg.vendor.disable !== true) {
      cfg.vendor.add = cfg.vendor.add.length > 0
        ? new RegExp(cfg.vendor.add.filter(v => v).join('|'))
        : void 0

      cfg.vendor.remove = cfg.vendor.remove.length > 0
        ? new RegExp(cfg.vendor.remove.filter(v => v).join('|'))
        : void 0
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

    cfg.build = merge({
      vueLoaderOptions: {
        compilerOptions: {},
        transformAssetUrls: merge({
          base: null,
          includeAbsolute: false,
          tags: {
            video: ['src', 'poster'],
            source: ['src'],
            img: ['src'],
            image: ['xlink:href', 'href'],
            use: ['xlink:href', 'href']
          }
        }, transformAssetUrls)
      },

      showProgress: true,
      productName: this.pkg.productName,
      productDescription: this.pkg.description,
      // need to force extraction for SSR due to
      // missing functionality in vue-loader
      extractCSS: this.ctx.prod || this.ctx.mode.ssr,
      sourceMap: this.ctx.dev,
      minify: this.ctx.prod && this.ctx.mode.bex !== true,
      distDir: path.join('dist', this.ctx.modeName),
      htmlFilename: 'index.html',
      ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
                                          // will mess up SSR
      vueRouterMode: 'hash',
      transpile: true,
      // transpileDependencies: [], // leaving here for completeness
      devtool: this.ctx.dev
        ? 'eval-cheap-module-source-map'
        : 'source-map',
      // env: {}, // leaving here for completeness
      uglifyOptions: {
        compress: {
          // turn off flags with small gains to speed up minification
          arrows: false,
          collapse_vars: false, // 0.3kb
          comparisons: false,
          computed_props: false,
          hoist_funs: false,
          hoist_props: false,
          hoist_vars: false,
          inline: false,
          loops: false,
          negate_iife: false,
          properties: false,
          reduce_funcs: false,
          reduce_vars: false,
          switches: false,
          toplevel: false,
          typeofs: false,

          // a few flags with noticable gains/speed ratio
          // numbers based on out of the box vendor bundle
          booleans: true, // 0.7kb
          if_return: true, // 0.4kb
          sequences: true, // 0.7kb
          unused: true, // 2.3kb

          // required features to drop conditional branches
          conditionals: true,
          dead_code: true,
          evaluate: true
        },
        mangle: {
          safari10: true
        }
      }
    }, cfg.build)

    if (cfg.build.transpile === true) {
      cfg.build.transpileDependencies = cfg.build.transpileDependencies.filter(uniqueRegexFilter)
      cfg.__transpileBanner = green(`yes (Babel)`)
    }
    else {
      cfg.__transpileBanner = 'no'
    }

    cfg.__loadingBar = cfg.framework.plugins.includes('LoadingBar')
    cfg.__meta = cfg.framework.plugins.includes('Meta')

    if (this.ctx.dev || this.ctx.debug) {
      Object.assign(cfg.build, {
        minify: false,
        gzip: false
      })
    }
    // need to force extraction for SSR due to
    // missing functionality in vue-loader
    if (this.ctx.dev && !this.ctx.mode.ssr) {
      cfg.build.extractCSS = false
    }
    if (this.ctx.debug) {
      cfg.build.sourceMap = true
    }

    if (this.ctx.mode.ssr) {
      Object.assign(cfg.build, {
        vueRouterMode: 'history',
        gzip: false
      })
    }
    else if (this.ctx.mode.cordova || this.ctx.mode.capacitor || this.ctx.mode.electron || this.ctx.mode.bex) {
      Object.assign(cfg.build, {
        htmlFilename: 'index.html',
        vueRouterMode: 'hash',
        gzip: false
      })
    }

    if (!path.isAbsolute(cfg.build.distDir)) {
      cfg.build.distDir = appPaths.resolve.app(cfg.build.distDir)
    }

    if (this.ctx.mode.cordova || this.ctx.mode.capacitor) {
      cfg.build.packagedDistDir = path.join(cfg.build.distDir, this.ctx.targetName)
    }

    if (this.ctx.mode.cordova || this.ctx.mode.capacitor) {
      cfg.build.distDir = appPaths.resolve[this.ctx.modeName]('www')
    }
    else if (this.ctx.mode.electron || this.ctx.mode.bex) {
      cfg.build.packagedDistDir = cfg.build.distDir
      cfg.build.distDir = path.join(cfg.build.distDir, 'UnPackaged')
    }

    cfg.build.publicPath =
      cfg.build.publicPath && ['spa', 'pwa', 'ssr'].includes(this.ctx.modeName)
        ? formatPublicPath(cfg.build.publicPath)
        : (cfg.build.vueRouterMode === 'hash' ? '' : '/')

    /* careful if you configure the following; make sure that you really know what you are doing */
    cfg.build.vueRouterBase = cfg.build.vueRouterBase !== void 0
      ? cfg.build.vueRouterBase
      : formatRouterBase(cfg.build.publicPath)

    /* careful if you configure the following; make sure that you really know what you are doing */
    cfg.build.appBase = cfg.build.appBase !== void 0
      ? cfg.build.appBase
      : cfg.build.publicPath

    cfg.sourceFiles = merge({
      rootComponent: 'src/App.vue',
      router: 'src/router/index',
      store: 'src/store/index',
      indexHtmlTemplate: 'src/index.template.html',
      registerServiceWorker: 'src-pwa/register-service-worker',
      serviceWorker: 'src-pwa/custom-service-worker',
      electronMain: 'src-electron/electron-main',
      electronPreload: 'src-electron/electron-preload'
    }, cfg.sourceFiles)

    appFilesValidations(cfg)

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
        prodPort: 3000, // gets superseeded in production by an eventual process.env.PORT
        maxAge: 1000 * 60 * 60 * 24 * 30
      }, cfg.ssr, {
        // not meant to be configurable directly by the user,
        // which is why we're overriding it here
        directiveTransforms: {
          ...require('quasar/dist/ssr-directives/index.js'),
          ...this.devlandSsrDirectives
        }
      })

      if (cfg.ssr.manualPostHydrationTrigger !== true) {
        cfg.__needsAppMountHook = true
      }

      if (cfg.ssr.middlewares.length > 0) {
        cfg.ssr.middlewares = cfg.ssr.middlewares.filter(_ => _)
          .map(parseAssetProperty('src-ssr/middlewares'))
          .filter(asset => asset.path)
          .filter(uniquePathFilter)
      }

      if (cfg.ssr.pwa) {
        await require('./mode/install-missing')('pwa')
        cfg.__rootDefines.__QUASAR_SSR_PWA__ = true
      }

      this.ctx.mode.pwa = cfg.ctx.mode.pwa = !!cfg.ssr.pwa
    }

    if (this.ctx.dev) {
      const originalBefore = cfg.devServer.onBeforeSetupMiddleware
      const openInEditor = require('launch-editor-middleware')

      delete cfg.devServer.onBeforeSetupMiddleware

      if (this.ctx.mode.bex === true) {
        cfg.devServer.devMiddleware = cfg.devServer.devMiddleware || {}
        cfg.devServer.devMiddleware.writeToDisk = true
      }

      cfg.devServer = merge({
        hot: true,
        firewall: false,
        compress: true,
        open: true,
        client: {
          overlay: {
            warnings: false
          }
        },
        devMiddleware: {
          publicPath: cfg.build.publicPath,
          stats: false
        }
      },
      this.ctx.mode.ssr === true
        ? {
            devMiddleware: { index: false },
            static: {
              serveIndex: false
            }
          }
        : {
            historyApiFallback: cfg.build.vueRouterMode === 'history'
              ? { index: `${cfg.build.publicPath || '/'}${cfg.build.htmlFilename}` }
              : false,
            devMiddleware: {
              index: cfg.build.htmlFilename
            }
          },
      cfg.devServer,
      {
        onBeforeSetupMiddleware: opts => {
          const { app } = opts

          if (!this.ctx.mode.ssr) {
            const express = require('express')

            if (cfg.build.ignorePublicFolder !== true) {
              app.use((cfg.build.publicPath || '/'), express.static(appPaths.resolve.app('public'), {
                maxAge: 0
              }))
            }

            if (this.ctx.mode.cordova) {
              const folder = appPaths.resolve.cordova(`platforms/${this.ctx.targetName}/platform_www`)
              app.use('/', express.static(folder, { maxAge: 0 }))
            }
          }

          app.use('/__open-in-editor', openInEditor(void 0, appPaths.appDir))

          originalBefore && originalBefore(opts)
        }
      })

      if (this.ctx.vueDevtools === true || cfg.devServer.vueDevtools === true) {
        cfg.__needsAppMountHook = true
        cfg.__vueDevtools = {
          host: cfg.devServer.host === '0.0.0.0' ? 'localhost' : cfg.devServer.host,
          port: 8098
        }
      }

      // make sure the prop is not supplied to webpack dev server
      if (cfg.devServer.hasOwnProperty('vueDevtools')) {
        delete cfg.devServer.vueDevtools
      }

      if (this.ctx.mode.cordova || this.ctx.mode.capacitor || this.ctx.mode.electron) {
        cfg.devServer.open = false

        if (this.ctx.mode.electron) {
          cfg.devServer.https = false
        }
      }

      if (cfg.devServer.open) {
        const isMinimalTerminal = require('./helpers/is-minimal-terminal')
        if (isMinimalTerminal) {
          cfg.devServer.open = false
        }
      }

      if (cfg.devServer.open) {
        cfg.__devServer = {
          open: !!cfg.devServer.open,
          openOptions: cfg.devServer.open !== true
            ? cfg.devServer.open
            : false
        }
        cfg.devServer.open = false
      }
      else {
        cfg.__devServer = {}
      }
    }

    if (cfg.build.gzip) {
      let gzip = cfg.build.gzip === true
        ? {}
        : cfg.build.gzip
      let ext = ['js', 'css']

      if (gzip.extensions) {
        ext = gzip.extensions
        delete gzip.extensions
      }

      cfg.build.gzip = merge({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + ext.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }, gzip)
    }

    if (this.ctx.mode.pwa) {
      cfg.pwa = merge({
        workboxPluginMode: 'GenerateSW',
        workboxOptions: {},
        useCredentials: false,
        manifest: {
          name: this.pkg.productName || this.pkg.name || 'Quasar App',
          short_name: this.pkg.name || 'quasar-pwa',
          description: this.pkg.description,
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
        warn(`PWA manifest in quasar.conf.js > pwa > manifest is missing "icons" prop.\n`)
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
      const urlPath = cfg.build.vueRouterMode === 'hash'
        ? (cfg.build.htmlFilename !== 'index.html' ? (cfg.build.publicPath ? '' : '/') + cfg.build.htmlFilename : '')
        : ''

      cfg.__getUrl = hostname => `http${cfg.devServer.https ? 's' : ''}://${hostname}:${cfg.devServer.port}${cfg.build.publicPath}${urlPath}`
      cfg.build.APP_URL = cfg.__getUrl(
        cfg.devServer.host === '0.0.0.0'
          ? 'localhost'
          : cfg.devServer.host
      )
    }
    else if (this.ctx.mode.cordova || this.ctx.mode.capacitor || this.ctx.mode.bex) {
      cfg.build.APP_URL = 'index.html'
    }
    else if (this.ctx.mode.electron) {
      cfg.__rootDefines[`process.env.APP_URL`] = `"file://" + __dirname + "/index.html"`
    }

    Object.assign(cfg.build.env, {
      NODE_ENV: this.ctx.prod ? 'production' : 'development',
      CLIENT: true,
      SERVER: false,
      DEV: this.ctx.dev,
      PROD: this.ctx.prod,
      DEBUGGING: this.ctx.debug || this.ctx.dev,
      MODE: this.ctx.modeName,
      VUE_ROUTER_MODE: cfg.build.vueRouterMode,
      VUE_ROUTER_BASE: cfg.build.vueRouterBase,
      APP_URL: cfg.build.APP_URL
    })

    if (this.ctx.mode.pwa) {
      cfg.build.env.SERVICE_WORKER_FILE = `${cfg.build.publicPath}service-worker.js`
    }
    else if (this.ctx.mode.bex) {
      cfg.bex = merge({}, cfg.bex, {
        builder: {
          directories: {
            input: cfg.build.distDir,
            output: path.join(cfg.build.packagedDistDir, 'Packaged')
          }
        }
      })
    }
    else if (this.ctx.mode.electron && this.ctx.prod) {
      const bundler = require('./electron/bundler')

      cfg.electron = merge({
        packager: {
          asar: true,
          icon: appPaths.resolve.electron('icons/icon'),
          overwrite: true
        },
        builder: {
          appId: 'quasar-app',
          productName: this.pkg.productName || this.pkg.name || 'Quasar App',
          directories: {
            buildResources: appPaths.resolve.electron('')
          }
        }
      }, cfg.electron, {
        packager: {
          dir: cfg.build.distDir,
          out: cfg.build.packagedDistDir
        },
        builder: {
          directories: {
            app: cfg.build.distDir,
            output: path.join(cfg.build.packagedDistDir, 'Packaged')
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
      productName: cfg.build.productName,
      productDescription: cfg.build.productDescription
    }, cfg.htmlVariables)

    cfg.__html = {
      minifyOptions: cfg.build.minify
        ? {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          collapseBooleanAttributes: true,
          removeScriptTypeAttributes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        }
        : false
    }

    // used by .quasar entry templates
    cfg.__versions = {}
    cfg.__css = {
      quasarSrcExt: cssVariables.quasarSrcExt
    }

    if (this.ctx.mode.capacitor) {
      const { capVersion } = require('./capacitor/cap-cli')
      cfg.__versions.capacitor = capVersion

      const getCapPluginVersion = capVersion <= 2
        ? () => true
        : name => {
          const version = getPackageMajorVersion(name, appPaths.capacitorDir)
          return version === void 0
            ? false
            : version || true
        }

      Object.assign(cfg.__versions, {
        capacitor: capVersion,
        capacitorPluginApp: getCapPluginVersion('@capacitor/app'),
        capacitorPluginSplashscreen: getCapPluginVersion('@capacitor/splash-screen')
      })
    }
    else if (this.ctx.mode.pwa) {
      cfg.__versions.workboxWebpackPlugin = getPackageMajorVersion('workbox-webpack-plugin')
    }

    if (this.ctx.mode.capacitor && cfg.__versions.capacitorPluginSplashscreen && cfg.capacitor.hideSplashscreen !== false) {
      cfg.__needsAppMountHook = true
    }

    this.quasarConf = cfg

    if (this.webpackConfChanged !== false) {
      this.webpackConf = await require('./webpack')(cfg)
    }
  }
}

module.exports = QuasarConfFile
