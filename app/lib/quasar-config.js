const
  path = require('path'),
  fs = require('fs'),
  merge = require('webpack-merge'),
  chokidar = require('chokidar'),
  debounce = require('lodash.debounce')

const
  appPaths = require('./app-paths'),
  logger = require('./helpers/logger'),
  log = logger('app:quasar-conf'),
  warn = logger('app:quasar-conf', 'red'),
  legacyValidations = require('./legacy-validations'),
  extensionRunner = require('./app-extension/extensions-runner')

function encode (obj) {
  return JSON.stringify(obj, (key, value) => {
    return typeof value === 'function'
      ? `/fn(${value.toString()})`
      : value
  })
}

function formatPublicPath (path) {
  if (!path) {
    return path
  }
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  if (!path.endsWith('/')) {
    path = `${path}/`
  }
  return path
}

function parseBuildEnv (env) {
  const obj = {}
  Object.keys(env).forEach(key => {
    try {
      obj[key] = JSON.parse(env[key])
    }
    catch (e) {
      obj[key] = ''
    }
  })
  return obj
}

/*
 * this.buildConfig           - Compiled Object from quasar.conf.js
 * this.webpackConfig         - Webpack config object for main thread
 * this.electronWebpackConfig - Webpack config object for electron main thread
 */

class QuasarConfig {
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

        try {
          await this.prepare()
        }
        catch (e) {
          if (e.message !== 'NETWORK_ERROR') {
            console.log(e)
            warn(`quasar.conf.js has JS errors. Please fix them then save file again.`)
            warn()
          }

          return
        }

        this.compile()

        if (this.webpackConfigChanged) {
          opts.onBuildChange()
        }
        else {
          opts.onAppChange()
        }
      }, 1000))

      if (this.ctx.mode.ssr) {
        this.ssrExtensionFile = appPaths.resolve.ssr('extension.js')

        chokidar
        .watch(this.ssrExtensionFile, { watchers: { chokidar: { ignoreInitial: true } } })
        .on('change', debounce(async () => {
          console.log()
          log(`src-ssr/extension.js changed`)

          try {
            this.readSSRextension()
          }
          catch (e) {
            if (e.message !== 'NETWORK_ERROR') {
              console.log(e)
              warn(`src-ssr/extension.js has JS errors. Please fix them then save file again.`)
              warn()
            }

            return
          }

          opts.onBuildChange()
        }, 1000))
      }
    }
  }

  // synchronous for build
  async prepare () {
    this.readConfig()

    if (this.watch && this.ctx.mode.ssr) {
      this.readSSRextension()
    }

    const cfg = merge({
      ctx: this.ctx,
      css: [],
      boot: [],
      animations: [],
      extras: []
    }, this.quasarConfigFunction(this.ctx))

    if (cfg.framework === void 0 || cfg.framework === 'all') {
      cfg.framework = {
        all: true
      }
    }
    cfg.framework.config = cfg.framework.config || {}

    if (this.ctx.dev) {
      cfg.devServer = cfg.devServer || {}

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

        cfg.devServer = merge(cfg.devServer, to)
        this.address = {
          from: addr,
          to: {
            host: cfg.devServer.host,
            port: cfg.devServer.port
          }
        }
      }
    }

    this.quasarConfig = cfg
  }

  getBuildConfig () {
    return this.buildConfig
  }

  getWebpackConfig () {
    return this.webpackConfig
  }

  readConfig () {
    log(`Reading quasar.conf.js`)

    if (fs.existsSync(this.filename)) {
      delete require.cache[this.filename]
      this.quasarConfigFunction = require(this.filename)
    }
    else {
      warn(`⚠️  [FAIL] Could not load quasar.conf.js config file`)
      process.exit(1)
    }
  }

  readSSRextension () {
    log(`Reading src-ssr/extension.js`)

    if (fs.existsSync(this.ssrExtensionFile)) {
      delete require.cache[this.ssrExtensionFile]
      this.ssrExtension = require(this.ssrExtensionFile)
    }
    else {
      warn(`⚠️  [FAIL] Could not load src-ssr/extension.js file`)
      process.exit(1)
    }
  }

  compile () {
    let cfg = this.quasarConfig

    await extensionRunner.runHook('extendQuasarConf', async hook => {
      log(`Extension(${hook.extId}): Extending quasar.conf...`)
      await hook.fn(cfg)
    })

    // if watching for changes,
    // then determine the type (webpack related or not)
    if (this.watch) {
      const newConfigSnapshot = [
        cfg.build ? encode(cfg.build) : '',
        cfg.ssr ? cfg.ssr.pwa : '',
        cfg.framework.all,
        cfg.devServer ? encode(cfg.devServer) : '',
        cfg.pwa ? encode(cfg.pwa) : '',
        cfg.electron ? encode(cfg.electron) : ''
      ].join('')

      if (this.oldConfigSnapshot) {
        this.webpackConfigChanged = newConfigSnapshot !== this.oldConfigSnapshot
      }

      this.oldConfigSnapshot = newConfigSnapshot
    }

    // make sure it exists
    cfg.supportIE = this.ctx.mode.electron
      ? false
      : (cfg.supportIE || false)

    cfg.vendor = merge({
      vendor: {
        add: false,
        remove: false
      }
    }, cfg.vendor || {})

    if (cfg.vendor.add) {
      cfg.vendor.add = cfg.vendor.add.filter(v => v).join('|')
      if (cfg.vendor.add) {
        cfg.vendor.add = new RegExp(cfg.vendor.add)
      }
    }
    if (cfg.vendor.remove) {
      cfg.vendor.remove = cfg.vendor.remove.filter(v => v).join('|')
      if (cfg.vendor.remove) {
        cfg.vendor.remove = new RegExp(cfg.vendor.remove)
      }
    }

    if (cfg.css.length > 0) {
      cfg.css = cfg.css.filter(_ => _).map(
        asset => typeof asset === 'string'
          ? { path: asset[0] === '~' ? asset.substring(1) : `src/css/${asset}` }
          : asset
      ).filter(asset => asset.path)
    }

    if (cfg.boot.length > 0) {
      cfg.boot = cfg.boot.filter(_ => _).map(asset => {
        return typeof asset === 'string'
          ? { path: asset }
          : asset
      }).filter(asset => asset.path)
    }

    cfg.build = merge({
      showProgress: true,
      scopeHoisting: true,
      productName: this.pkg.productName,
      productDescription: this.pkg.description,
      extractCSS: this.ctx.prod,
      sourceMap: this.ctx.dev,
      minify: this.ctx.prod,
      distDir: path.join('dist', this.ctx.modeName),
      htmlFilename: 'index.html',
      webpackManifest: this.ctx.prod,
      vueRouterMode: 'hash',
      preloadChunks: true,
      transpileDependencies: [],
      devtool: this.ctx.dev
        ? '#cheap-module-eval-source-map'
        : '#source-map',
      env: {
        NODE_ENV: `"${this.ctx.prod ? 'production' : 'development'}"`,
        CLIENT: true,
        SERVER: false,
        DEV: this.ctx.dev,
        PROD: this.ctx.prod,
        MODE: `"${this.ctx.modeName}"`
      },
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
    }, cfg.build || {})

    cfg.__loadingBar = cfg.framework.all || (cfg.framework.plugins && cfg.framework.plugins.includes('LoadingBar'))
    cfg.__meta = cfg.framework.all || (cfg.framework.plugins && cfg.framework.plugins.includes('Meta'))

    if (this.ctx.dev || this.ctx.debug) {
      Object.assign(cfg.build, {
        minify: false,
        gzip: false
      })
    }
    if (this.ctx.dev) {
      cfg.build.extractCSS = false
    }
    if (this.ctx.debug) {
      cfg.build.sourceMap = true
    }

    if (this.ctx.mode.ssr) {
      Object.assign(cfg.build, {
        extractCSS: false,
        vueRouterMode: 'history',
        publicPath: '/',
        gzip: false
      })
    }
    else if (this.ctx.mode.cordova || this.ctx.mode.electron) {
      Object.assign(cfg.build, {
        extractCSS: false,
        htmlFilename: 'index.html',
        vueRouterMode: 'hash',
        gzip: false,
        webpackManifest: false
      })
    }

    if (this.ctx.mode.cordova) {
      cfg.build.distDir = appPaths.resolve.app(path.join('src-cordova', 'www'))
    }
    else if (!path.isAbsolute(cfg.build.distDir)) {
      cfg.build.distDir = appPaths.resolve.app(cfg.build.distDir)
    }

    if (this.ctx.mode.electron) {
      cfg.build.packagedElectronDist = cfg.build.distDir
      cfg.build.distDir = path.join(cfg.build.distDir, 'UnPackaged')
    }

    cfg.build.publicPath =
      this.ctx.prod && cfg.build.publicPath && ['spa', 'pwa'].includes(this.ctx.modeName)
        ? formatPublicPath(cfg.build.publicPath)
        : (cfg.build.vueRouterMode !== 'hash' ? '/' : '')
    cfg.build.appBase = cfg.build.vueRouterMode === 'history'
      ? cfg.build.publicPath
      : ''

    cfg.sourceFiles = merge({
      rootComponent: 'src/App.vue',
      router: 'src/router/index.js',
      store: 'src/store/index.js',
      indexHtmlTemplate: 'src/index.template.html',
      registerServiceWorker: 'src-pwa/register-service-worker.js',
      serviceWorker: 'src-pwa/custom-service-worker.js',
      electronMainDev: 'src-electron/main-process/electron-main.dev.js',
      electronMainProd: 'src-electron/main-process/electron-main.js',
      ssrServerIndex: 'src-ssr/index.js'
    }, cfg.sourceFiles || {})

    // do we got vuex?
    cfg.store = fs.existsSync(appPaths.resolve.app(cfg.sourceFiles.store))

    //make sure we have preFetch in config
    cfg.preFetch = cfg.preFetch || false

    if (cfg.animations === 'all') {
      cfg.animations = require('./helpers/animations')
    }

    if (this.ctx.mode.ssr) {
      cfg.ssr = merge({
        pwa: false,
        componentCache: {
          max: 1000,
          maxAge: 1000 * 60 * 15
        }
      }, cfg.ssr || {})

      cfg.ssr.debug = this.ctx.debug

      cfg.ssr.__templateOpts = JSON.stringify(cfg.ssr, null, 2)
      cfg.ssr.__templateFlags = {
        meta: cfg.__meta
      }

      const file = appPaths.resolve.app(cfg.sourceFiles.ssrServerIndex)
      cfg.ssr.__dir = path.dirname(file)
      cfg.ssr.__index = path.basename(file)

      if (cfg.ssr.pwa) {
        require('./mode/install-missing')('pwa')
      }
      this.ctx.mode.pwa = cfg.ctx.mode.pwa = cfg.ssr.pwa !== false

      this.watch && (cfg.__ssrExtension = this.ssrExtension)
    }

    if (this.ctx.dev) {
      cfg.devServer = merge({
        publicPath: cfg.build.publicPath,
        hot: true,
        inline: true,
        overlay: true,
        quiet: true,
        historyApiFallback: !this.ctx.mode.ssr,
        noInfo: true,
        disableHostCheck: true,
        compress: true,
        open: true
      }, cfg.devServer || {}, {
        contentBase: [ appPaths.srcDir ]
      })

      if (this.ctx.mode.ssr) {
        cfg.devServer.contentBase = false
      }
      else if (this.ctx.mode.cordova || this.ctx.mode.electron) {
        cfg.devServer.open = false

        if (this.ctx.mode.electron) {
          cfg.devServer.https = false
        }
      }

      if (this.ctx.mode.cordova) {
        cfg.devServer.contentBase.push(
          appPaths.resolve.cordova(`platforms/${this.ctx.targetName}/platform_www`)
        )
      }

      if (cfg.devServer.open) {
        const isMinimalTerminal = require('./helpers/is-minimal-terminal')
        if (isMinimalTerminal) {
          cfg.devServer.open = false
        }
      }

      if (cfg.devServer.open && cfg.devServer.open !== true) {
        cfg.__opnOptions = cfg.devServer.open
        cfg.devServer.open = true
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
      cfg.build.webpackManifest = false

      cfg.pwa = merge({
        workboxPluginMode: 'GenerateSW',
        workboxOptions: {},
        manifest: {
          name: this.pkg.productName || this.pkg.name || 'Quasar App',
          short_name: this.pkg.name || 'quasar-pwa',
          description: this.pkg.description,
          display: 'standalone',
          start_url: '.'
        }
      }, cfg.pwa || {})

      if (!['GenerateSW', 'InjectManifest'].includes(cfg.pwa.workboxPluginMode)) {
        console.log()
        console.log(`⚠️  Workbox webpack plugin mode "${cfg.pwa.workboxPluginMode}" is invalid.`)
        console.log(`   Valid Workbox modes are: GenerateSW, InjectManifest`)
        console.log()
        process.exit(1)
      }
      if (cfg.pwa.cacheExt) {
        console.log()
        console.log(`⚠️  Quasar CLI now uses Workbox, so quasar.conf.js > pwa > cacheExt is no longer relevant.`)
        console.log(`   Please remove this property and try again.`)
        console.log()
        process.exit(1)
      }
      if (
        fs.existsSync(appPaths.resolve.pwa('service-worker-dev.js')) ||
        fs.existsSync(appPaths.resolve.pwa('service-worker-prod.js'))
      ) {
        console.log()
        console.log(`⚠️  Quasar CLI now uses Workbox, so src-pwa/service-worker-dev.js and src-pwa/service-worker-prod.js are obsolete.`)
        console.log(`   Please remove and add PWA mode again:`)
        console.log(`    $ quasar mode -r pwa # Warning: this will delete /src-pwa !`)
        console.log(`    $ quasar mode -a pwa`)
        console.log()
        process.exit(1)
      }

      cfg.pwa.manifest.icons = cfg.pwa.manifest.icons.map(icon => {
        icon.src = `${cfg.build.publicPath}${icon.src}`
        return icon
      })
    }

    if (this.ctx.dev) {
      const host = cfg.devServer.host === '0.0.0.0'
        ? 'localhost'
        : cfg.devServer.host
      const urlPath = `${cfg.build.vueRouterMode === 'hash' ? (cfg.build.htmlFilename !== 'index.html' ? cfg.build.htmlFilename : '') : ''}`
      cfg.build.APP_URL = `http${cfg.devServer.https ? 's' : ''}://${host}:${cfg.devServer.port}/${urlPath}`
    }
    else if (this.ctx.mode.cordova) {
      cfg.build.APP_URL = 'index.html'
    }
    else if (this.ctx.mode.electron) {
      cfg.build.APP_URL = `file://" + __dirname + "/index.html`
    }

    cfg.build.env = merge(cfg.build.env || {}, {
      VUE_ROUTER_MODE: `"${cfg.build.vueRouterMode}"`,
      VUE_ROUTER_BASE: `"${cfg.build.publicPath}"`,
      APP_URL: `"${cfg.build.APP_URL}"`
    })

    if (this.ctx.mode.pwa) {
      cfg.build.env.SERVICE_WORKER_FILE = `"${cfg.build.publicPath}service-worker.js"`
    }

    cfg.build.env = {
      'process.env': cfg.build.env
    }

    if (this.ctx.mode.electron) {
      if (this.ctx.dev) {
        cfg.build.env.__statics = `"${appPaths.resolve.src('statics').replace(/\\/g, '\\\\')}"`
      }
    }
    else {
      cfg.build.env.__statics = `"${this.ctx.dev ? '/' : cfg.build.publicPath || '/'}statics"`
    }

    legacyValidations(cfg)

    if (this.ctx.mode.cordova && !cfg.cordova) {
      cfg.cordova = {}
    }

    if (this.ctx.mode.electron) {
      if (this.ctx.prod) {
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
        }, cfg.electron || {}, {
          packager: {
            dir: cfg.build.distDir,
            out: cfg.build.packagedElectronDist
          },
          builder: {
            directories: {
              app: cfg.build.distDir,
              output: path.join(cfg.build.packagedElectronDist, 'Packaged')
            }
          }
        })

        if (cfg.ctx.bundlerName) {
          cfg.electron.bundler = cfg.ctx.bundlerName
        }
        else if (!cfg.electron.bundler) {
          cfg.electron.bundler = bundler.getDefaultName()
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
            platform: cfg.ctx.targetName,
            arch: cfg.ctx.archName,
            config: cfg.electron.builder
          }

          bundler.ensureBuilderCompatibility()
        }

        bundler.ensureInstall(cfg.electron.bundler)
      }
    }

    cfg.__html = {
      variables: Object.assign({
        ctx: cfg.ctx,
        process: {
          env: parseBuildEnv(cfg.build.env['process.env'])
        },
        productName: cfg.build.productName,
        productDescription: cfg.build.productDescription
      }, cfg.htmlVariables || {}),
      minifyOptions: cfg.build.minify
        ? {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        }
        : undefined
    }

    this.webpackConfig = require('./webpack')(cfg)
    this.buildConfig = cfg
  }
}

module.exports = QuasarConfig
