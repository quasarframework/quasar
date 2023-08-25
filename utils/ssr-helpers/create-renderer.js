/*
 * Inspired from vue-bundle-runner v0.0.3 NPM package
 */

const serialize = require('serialize-javascript')
const createBundle = require('./lib/create-bundle')

function createRenderContext (clientManifest) {
  const { publicPath, initial, modules } = clientManifest
  const addPublicPath = file => publicPath + file
  const [ firstBodyFile, ...otherBodyFiles ] = initial.b.map(addPublicPath)

  return {
    initialHeadFiles: initial.h.map(addPublicPath),

    getBodyFiles: firstBodyFile
      ? asyncFiles => ([ firstBodyFile, ...asyncFiles, ...otherBodyFiles ])
      : asyncFiles => asyncFiles,

    getAsyncFiles: moduleIds => {
      const head = new Set()
      const body = new Set()

      for (let i = 0; i < moduleIds.length; i++) {
        const list = modules[ moduleIds[ i ] ]

        // if it has no mapping...
        if (list === void 0) continue

        if (list.h !== void 0) list.h.forEach(file => head.add(file))
        if (list.b !== void 0) list.b.forEach(file => body.add(file))
      }

      return {
        head: Array.from(head).map(addPublicPath),
        body: Array.from(body).map(addPublicPath)
      }
    }
  }
}

const autoRemove = 'document.currentScript.remove()'

function renderStoreState (ssrContext) {
  const nonceAttr = ssrContext.nonce !== void 0
    ? ` nonce="${ ssrContext.nonce }"`
    : ''
  const state = serialize(ssrContext.state, { isJSON: true })
  return `<script${nonceAttr}>window.__INITIAL_STATE__=${state};${autoRemove}</script>`
}

function renderHeadTags ({ renderContext, asyncFiles, renderPreloadTagMap, ssrContext }) {
  return (
    // render head assets
    [ ...renderContext.initialHeadFiles, ...asyncFiles.head ]
      .map(renderPreloadTagMap)
      .join('')

    // ssrContext.styles is a getter exposed by vue-style-loader which contains
    // the inline component styles collected during SSR
    + (ssrContext.styles || '')
  )
}

function renderBodyTags ({ renderContext, asyncFiles, renderPreloadTagMap }) {
  return renderContext.getBodyFiles(asyncFiles.body)
    .filter(entry => entry !== void 0)
    .map(renderPreloadTagMap)
    .join('')
}

function createRenderToStringFn (data) {
  return async function renderToString (ssrContext) {
    try {
      const onRenderedList = []

      Object.assign(ssrContext, {
        _modules: new Set(),
        _meta: {},
        onRendered: fn => { onRenderedList.push(fn) }
      })

      const runtimePageContent = await data.getRuntimePageContent(ssrContext)


      onRenderedList.forEach(fn => { fn() })

      // maintain compatibility with some well-known Vue plugins
      // like @vue/apollo-ssr:
      typeof ssrContext.rendered === 'function' && ssrContext.rendered()

      const renderTagOptions = {
        renderContext: data.renderContext,
        asyncFiles: data.renderContext.getAsyncFiles(Array.from(ssrContext._modules)),
        renderPreloadTagMap: file => data.renderPreloadTag(file, ssrContext),
        ssrContext
      }

      Object.assign(ssrContext._meta, {
        endingHeadTags: renderHeadTags(renderTagOptions) + ssrContext._meta.endingHeadTags,
        runtimePageContent,
        afterRuntimePageContent: (
          (data.manualStoreSerialization !== true && ssrContext.state !== void 0 ? renderStoreState(ssrContext) : '')
          + renderBodyTags(renderTagOptions)
        )
      })

      return data.renderTemplate(ssrContext)
    }
    catch (err) {
      if (data.rewriteErrorTrace) {
        await data.rewriteErrorTrace(err)
      }

      throw err
    }
  }
}

module.exports.getProdRenderFunction = function getProdRenderFunction (opts) {
  return createRenderToStringFn({
    renderContext: createRenderContext(opts.clientManifest),
    renderTemplate: opts.renderTemplate,
    renderPreloadTag: opts.renderPreloadTag,
    manualStoreSerialization: opts.manualStoreSerialization,
    getRuntimePageContent: async ssrContext => {
      const app = await opts.serverEntry(ssrContext)
      return await opts.vueRenderToString(app, ssrContext)
    }
  })
}

module.exports.createDevRenderer = function createDevRenderer (opts) {
  const data = {
    renderContext: null,
    evaluateEntry: null,
    rewriteErrorTrace: null,
    renderTemplate: void 0, // "void 0" not a mistake (we check everything else then call onReadyForTemplate()
    renderPreloadTag: null,
    manualStoreSerialization: opts.manualStoreSerialization,
    getRuntimePageContent: async ssrContext => {
      const entry = await data.evaluateEntry()
      const app = await entry(ssrContext)
      return await opts.vueRenderToString(app, ssrContext)
    }
  }

  const dataKeys = Object.keys(data)

  let checkIfReadyForTemplate = () => {
    if (dataKeys.every(key => data[ key ] !== null)) {
      checkIfReadyForTemplate = () => {}
      opts.onReadyForTemplate()
    }
  }

  const updateClientManifest = clientManifest => {
    data.renderContext = createRenderContext(clientManifest)
    checkIfReadyForTemplate()
  }

  const updateServerManifest = serverManifest => {
    const { evaluateEntry, rewriteErrorTrace } = createBundle(serverManifest, opts.basedir)
    data.evaluateEntry = evaluateEntry
    data.rewriteErrorTrace = rewriteErrorTrace
    checkIfReadyForTemplate()
  }

  const updateRenderTemplate = renderTemplate => {
    data.renderTemplate = renderTemplate
  }

  const updateRenderPreloadTag = renderPreloadTag => {
    data.renderPreloadTag = renderPreloadTag
    checkIfReadyForTemplate()
  }

  return {
    renderToString: createRenderToStringFn(data),
    updateClientManifest,
    updateServerManifest,
    updateRenderTemplate,
    updateRenderPreloadTag
  }
}
