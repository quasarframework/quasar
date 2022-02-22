const { createServer } = require('vite')
const express = require('express')
const { join } = require('path')
const chokidar = require('chokidar')
const { readFileSync } = require('fs')
const Ouch = require('ouch')

const AppDevserver = require('../../app-devserver')
const appPaths = require('../../app-paths')
const getPackage = require('../../helpers/get-package')
const openBrowser = require('../../helpers/open-browser')
const config = require('./ssr-config')
const { log, warn, info, success } = require('../../helpers/logger')

const { renderToString } = getPackage('vue/server-renderer')

const rootFolder = appPaths.appDir
const publicFolder = appPaths.resolve.app('public')
const templatePath = appPaths.resolve.app('index.html')
const compiledMiddlewareFile = appPaths.resolve.app('.quasar/ssr/compiled-middlewares.js')
const serverEntryFile = appPaths.resolve.app('.quasar/server-entry.js')

function resolvePublicFolder () {
  return join(publicFolder, ...arguments)
}

function renderVuexState (ssrContext, nonce) {
  if (ssrContext.state !== void 0) {
    const state = serialize(ssrContext.state, { isJSON: true })
    return `<script${nonce}>window.__INITIAL_STATE__=${state};${autoRemove}</script>`
  }

  return ''
}

function logServerMessage (title, msg, additional) {
  log()
  info(`${msg}${additional !== void 0 ? ` • ${additional}` : ''}`, title)
}

ouchInstance = (new Ouch()).pushHandler(
  new Ouch.handlers.PrettyPageHandler('orange', null, 'sublime')
)

function renderError ({ err, req, res }) {
  ouchInstance.handleException(err, req, res, () => {
    log()
    warn(req.url, 'Render fail')
  })
}

class SsrDevServer extends AppDevserver {
  #app
  #viteClient
  #viteServer
  #htmlWatcher
  #webserverWatcher
  #appOptions = {}

  constructor (opts) {
    super(opts)

    this.registerDiff('webserver', quasarConf => [
      quasarConf.build.env,
      quasarConf.build.rawDefine,
      quasarConf.build.minify
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('webserver', quasarConf) === true) {
      return queue(() => this.#compileWebserver(quasarConf, queue))
    }

    if (diff('vite', quasarConf) === true) {
      return queue(() => this.#runVite(quasarConf, diff('viteUrl', quasarConf)))
    }
  }

  async #compileWebserver (quasarConf, queue) {
    if (this.#webserverWatcher) {
      await this.#webserverWatcher.close()
    }

    const esbuildConfig = config.webserver(quasarConf)
    await this.buildWithEsbuild('Webserver', esbuildConfig, () => {
      if (this.#app !== void 0) {
        queue(() => new Promise(resolve => {
          this.#app.close()
          this.#bootApp().then(() => {
            resolve()
          })
        }))
      }
    }).then(result => {
      this.#webserverWatcher = result
    })
  }

  async #bootApp () {
    info('Registering SSR middlewares...', 'WAIT')

    const app = express()

    app.use(this.#viteClient.middlewares)
    app.use(this.#viteServer.middlewares)

    delete require.cache[compiledMiddlewareFile]
    const injectMiddleware = require(compiledMiddlewareFile)

    await injectMiddleware.default({
      app,
      resolve: {
        urlPath: this.#appOptions.resolveUrlPath,
        root () { return join(rootFolder, ...arguments) },
        public: resolvePublicFolder
      },
      publicPath: this.#appOptions.publicPath,
      folders: {
        root: rootFolder,
        public: publicFolder
      },
      render: this.#appOptions.render,
      serve: {
        static: this.#appOptions.serveStatic,
        error: renderError
      }
    })

    this.#app = app.listen(this.#appOptions.port)
    await this.#app

    success('SSR middlewares were registered', 'DONE')
    log()
  }

  async #runVite (quasarConf, urlDiffers) {
    if (this.#app !== void 0) {
      this.#htmlWatcher.close()
      this.#viteClient.close()
      this.#viteServer.close()
      this.#app.close()
    }

    this.#appOptions.port = quasarConf.devServer.port

    const publicPath = this.#appOptions.publicPath = quasarConf.build.publicPath
    this.#appOptions.resolveUrlPath = publicPath === '/'
      ? url => url || '/'
      : url => url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath

    this.#viteClient = await createServer(config.viteClient(quasarConf))
    this.#viteServer = await createServer(config.viteServer(quasarConf))

    const viteServer = this.#viteServer

    let renderTemplate
    const { getIndexHtml } = require('./html-template')

    function updateTemplate () {
      renderTemplate = getIndexHtml(readFileSync(templatePath, 'utf-8'), quasarConf)
    }

    updateTemplate()

    this.#htmlWatcher = chokidar.watch(templatePath).on('change', () => {
      updateTemplate()
      logServerMessage('Change detected', 'index.html template updated')
    })

    this.#appOptions.serveStatic = (path, opts = {}) => {
      return express.static(resolvePublicFolder(path), {
        ...opts,
        maxAge: opts.maxAge === void 0
          ? quasarConf.ssr.maxAge // TODO diff with ssr.maxAge included
          : opts.maxAge
      })
    }

    this.#appOptions.render = async (ssrContext) => {
      const startTime = Date.now()
      const onRenderedList = []

      Object.assign(ssrContext, {
        _meta: {},
        onRendered: fn => { onRenderedList.push(fn) }
      })

      try {
        const renderApp = await viteServer.ssrLoadModule(serverEntryFile)

        const app = await renderApp.default(ssrContext)
        const resourceApp = await renderToString(app, ssrContext)

        onRenderedList.forEach(fn => { fn() })

        // maintain compatibility with some well-known Vue plugins
        // like @vue/apollo-ssr:
        typeof ssrContext.rendered === 'function' && ssrContext.rendered()

        const nonce = ssrContext.nonce !== void 0
          ? ` nonce="${ ssrContext.nonce }" `
          : ''

        Object.assign(ssrContext._meta, {
          resourceApp,
          resourceStyles: '',
          resourceScripts: renderVuexState(ssrContext, nonce)
            + '<script type="module" src="/.quasar/client-entry.js"></script>'
        })

        const html = await viteServer.transformIndexHtml(ssrContext.req.url, renderTemplate(ssrContext))

        logServerMessage('Rendered', ssrContext.req.url, `${Date.now() - startTime}ms`)

        return html
      }
      catch (err) {
        viteServer.ssrFixStacktrace(err)
        throw err
      }
    }

    await this.#bootApp()

    if (urlDiffers === true && quasarConf.metaConf.openBrowser) {
      const { metaConf } = quasarConf
      openBrowser({
        url: metaConf.APP_URL,
        opts: metaConf.openBrowser !== true ? metaConf.openBrowser : false
      })
    }
  }
}

module.exports = SsrDevServer
