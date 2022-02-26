const { createServer } = require('vite')
const express = require('express')
const { join } = require('path')
const chokidar = require('chokidar')
const { readFileSync } = require('fs')
const Ouch = require('ouch')
const { parse: parseUrl } = require('url')
const serialize = require('serialize-javascript')

const AppDevserver = require('../../app-devserver')
const appPaths = require('../../app-paths')
const getPackage = require('../../helpers/get-package')
const openBrowser = require('../../helpers/open-browser')
const config = require('./ssr-config')
const { log, warn, info, success } = require('../../helpers/logger')
const { getDevSsrTemplateFn } = require('../../helpers/html-template')

const { renderToString } = getPackage('vue/server-renderer')

const rootFolder = appPaths.appDir
const publicFolder = appPaths.resolve.app('public')
const templatePath = appPaths.resolve.app('index.html')
const compiledMiddlewareFile = appPaths.resolve.app('.quasar/ssr/compiled-middlewares.js')

const serverEntryFile = appPaths.resolve.app('.quasar/server-entry.js')

function resolvePublicFolder () {
  return join(publicFolder, ...arguments)
}

const doubleSlashRE = /\/\//g
const autoRemove = 'var currentScript=document.currentScript;currentScript.parentNode.removeChild(currentScript)'

const ouchInstance = (new Ouch()).pushHandler(
  new Ouch.handlers.PrettyPageHandler('orange', null, 'sublime')
)

function logServerMessage (title, msg, additional) {
  log()
  info(`${msg}${additional !== void 0 ? ` • ${additional}` : ''}`, title)
}

function renderError ({ err, req, res }) {
  ouchInstance.handleException(err, req, res, () => {
    log()
    warn(req.url, 'Render fail')
  })
}

async function warmupServer (viteClient, viteServer) {
  info('Warming up the server...', 'WAIT')
  const startTime = Date.now()

  try {
    await viteServer.ssrLoadModule(serverEntryFile)
    await viteClient.transformRequest('.quasar/client-entry.js')
  }
  catch (err) {
    warn('Warmup failed!', 'FAIL')
    console.error(err)
    return
  }

  success(`Warmed up the server • ${Date.now() - startTime}ms`, 'DONE')
  log()
}

function renderVuexState (ssrContext) {
  if (ssrContext.state === void 0) {
    return ''
  }

  const nonce = ssrContext.nonce !== void 0
    ? ` nonce="${ ssrContext.nonce }" `
    : ''

  const state = serialize(ssrContext.state, { isJSON: true })
  return `<script${nonce}>window.__INITIAL_STATE__=${state};${autoRemove}</script>`
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

    const viteClient = this.#viteClient = await createServer(config.viteClient(quasarConf))
    const viteServer = this.#viteServer = await createServer(config.viteServer(quasarConf))

    let renderTemplate

    function updateTemplate () {
      renderTemplate = getDevSsrTemplateFn(
        readFileSync(templatePath, 'utf-8'),
        quasarConf
      )
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
        const runtimeApp = await renderToString(app, ssrContext)

        onRenderedList.forEach(fn => { fn() })

        // maintain compatibility with some well-known Vue plugins
        // like @vue/apollo-ssr:
        typeof ssrContext.rendered === 'function' && ssrContext.rendered()

        ssrContext._meta.runtimeScripts = renderVuexState(ssrContext)

        let html = renderTemplate(ssrContext)
        html = await viteClient.transformIndexHtml(ssrContext.req.url, html, ssrContext.req.url)
        html = html.replace(
          '<!-- quasar:entry-point -->',
          `<div id="q-app">${runtimeApp}</div>`
        )

        logServerMessage('Rendered', ssrContext.req.url, `${Date.now() - startTime}ms`)

        return html
      }
      catch (err) {
        viteServer.ssrFixStacktrace(err)
        throw err
      }
    }

    await warmupServer(viteClient, viteServer)

    await this.#bootApp()

    if (urlDiffers === true && quasarConf.metaConf.openBrowser) {
      const { metaConf } = quasarConf
      openBrowser({
        url: metaConf.APP_URL,
        opts: metaConf.openBrowser !== true ? metaConf.openBrowser : false
      })
    }
  }

  async #bootApp () {
    info('Registering SSR middlewares...', 'WAIT')

    const app = express()

    // vite devmiddleware modifies req.url to account for publicPath
    // but we'll break usage in the webserver if we do so
    app.use((req, res, next) => {
      const { url } = req
      this.#viteClient.middlewares.handle(req, res, err => {
        req.url = url
        next(err)
      })
    })

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

    const { publicPath } = this.#appOptions

    if (publicPath.length !== '/') {
      app.use((req, res, next) => {
        const pathname = parseUrl(req.url).pathname || '/'

        if (pathname.startsWith(publicPath) === true) {
          next()
          return
        }

        if (req.url === '/' || req.url === '/index.html') {
          res.writeHead(302, { Location: publicPath })
          res.end()
          return
        }
        else if (req.headers.accept && req.headers.accept.includes('text/html')) {
          const parsedPath = pathname.slice(1)
          const redirectPaths = [ publicPath + parsedPath ]
          const splitted = parsedPath.split('/')

          if (splitted.length > 1) {
            redirectPaths.push(publicPath + splitted.slice(1).join('/'))
          }

          if (redirectPaths[ redirectPaths.length - 1 ] !== publicPath) {
            redirectPaths.push(publicPath)
          }

          const linkList = redirectPaths
            .map(link => `<a href="${link}">${link}</a>`)
            .join(' or ')

          res.writeHead(404, { 'Content-Type': 'text/html' })
          res.end(
            `<div>The Quasar CLI devserver is configured with a publicPath of "${publicPath}"</div>`
            + `<div> - Did you mean to visit ${linkList} instead?</div>`
          )
          return
        }

        next()
      })
    }

    this.#app = app.listen(this.#appOptions.port)
    await this.#app

    success('SSR middlewares were registered', 'DONE')
    log()
  }
}

module.exports = SsrDevServer
