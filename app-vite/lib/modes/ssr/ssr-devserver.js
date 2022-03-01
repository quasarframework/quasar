const { createServer } = require('vite')
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
const { entryPointMarkup, getDevSsrTemplateFn } = require('../../helpers/html-template')

const { renderToString } = getPackage('vue/server-renderer')

const rootFolder = appPaths.appDir
const publicFolder = appPaths.resolve.app('public')
const templatePath = appPaths.resolve.app('index.html')
const serverFile = appPaths.resolve.app('.quasar/ssr/compiled-dev-webserver.js')
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
    warn(req.url, 'Render failed')
  })
}

async function warmupServer (viteClient, viteServer) {
  info('Warming up...', 'WAIT')
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

  success(`Warmed up • ${Date.now() - startTime}ms`, 'DONE')
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
  #closeWebserver
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

    const esbuildConfig = await config.webserver(quasarConf)
    await this.buildWithEsbuild('SSR Webserver', esbuildConfig, () => {
      if (this.#closeWebserver !== void 0) {
        queue(() => new Promise(async (resolve) => {
          await this.#closeWebserver()
          this.#bootWebserver(quasarConf).then(() => {
            resolve()
          })
        }))
      }
    }).then(result => {
      this.#webserverWatcher = result
    })
  }

  async #runVite (quasarConf, urlDiffers) {
    if (this.#closeWebserver !== void 0) {
      this.#htmlWatcher.close()
      this.#viteClient.close()
      this.#viteServer.close()
      await this.#closeWebserver()
    }

    this.#appOptions.port = quasarConf.devServer.port

    const publicPath = this.#appOptions.publicPath = quasarConf.build.publicPath
    this.#appOptions.resolveUrlPath = publicPath === '/'
      ? url => url || '/'
      : url => url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath

    const viteClient = this.#viteClient = await createServer(await config.viteClient(quasarConf))
    const viteServer = this.#viteServer = await createServer(await config.viteServer(quasarConf))

    let renderTemplate

    function updateTemplate () {
      renderTemplate = getDevSsrTemplateFn(
        readFileSync(templatePath, 'utf-8'),
        quasarConf
      )
    }

    updateTemplate()

    this.#htmlWatcher = chokidar.watch(templatePath).on('change', updateTemplate)

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
        const runtimePageContent = await renderToString(app, ssrContext)

        onRenderedList.forEach(fn => { fn() })

        // maintain compatibility with some well-known Vue plugins
        // like @vue/apollo-ssr:
        typeof ssrContext.rendered === 'function' && ssrContext.rendered()

        ssrContext._meta.headTags = renderVuexState(ssrContext) + ssrContext._meta.headTags

        let html = renderTemplate(ssrContext)
        html = await viteClient.transformIndexHtml(ssrContext.req.url, html, ssrContext.req.url)
        html = html.replace(
          entryPointMarkup,
          `<div id="q-app">${runtimePageContent}</div>`
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

    await this.#bootWebserver(quasarConf)

    if (urlDiffers === true && quasarConf.metaConf.openBrowser) {
      const { metaConf } = quasarConf
      openBrowser({
        url: metaConf.APP_URL,
        opts: metaConf.openBrowser !== true ? metaConf.openBrowser : false
      })
    }
  }

  async #bootWebserver (quasarConf) {
    info(`${ this.#closeWebserver !== void 0 ? 'Restarting' : 'Starting' } webserver...`, 'WAIT')

    delete require.cache[serverFile]
    const { create, listen, close, injectMiddlewares, serveStaticContent } = require(serverFile)

    const middlewareParams = {
      port: this.#appOptions.port,
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
        static: (path, opts = {}) => serveStaticContent(resolvePublicFolder(path), opts),
        error: renderError
      }
    }

    const app = middlewareParams.app = create(middlewareParams)

    // vite devmiddleware modifies req.url to account for publicPath
    // but we'll break usage in the webserver if we do so
    app.use((req, res, next) => {
      const { url } = req
      this.#viteClient.middlewares.handle(req, res, err => {
        req.url = url
        next(err)
      })
    })

    await injectMiddlewares(middlewareParams)

    const { publicPath } = this.#appOptions

    publicPath.length !== '/' && app.use((req, res, next) => {
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

    const listenResult = await listen({
      isReady: () => Promise.resolve(),
      ssrHandler: (req, res, next) => {
        return isReady().then(() => app(req, res, next))
      },
      ...middlewareParams
    })

    this.#closeWebserver = () => close({
      ...middlewareParams,
      listenResult
    })

    success('Webserver is ready', 'DONE')
    log()

    this.printBanner(quasarConf)
  }
}

module.exports = SsrDevServer
