import { join } from 'node:path'
import serialize from 'serialize-javascript'
import { green } from 'kolorist'
import { normalizePath } from 'vite'

import { dot, info, log } from '../../utils/logger.js'

export { injectNonceAttr } from '../../../templates/entry/ssr-nonce.js'

export function renderStoreState(ssrContext) {
  // no isJSON flag so Map/Set/Date/RegExp survive into the client payload
  const state = serialize(ssrContext.state)
  return (
    `<script${ssrContext.__quasarNonceAttr}>` +
    `window.__INITIAL_STATE__=${state};` +
    'document.currentScript.remove()</script>'
  )
}

export function logServerMessage(title, msg, additional) {
  log()
  info(
    `${msg}${additional !== void 0 ? ` ${green(dot)} ${additional}` : ''}`,
    title
  )
}

const styleUrlRE = /\.(css|sass|scss|less|styl|stylus|pcss|postcss|sss)(\?.*)?$/
const inlineStyleRE = /[?&]inline\b/
const vueSfcUrlRE = /\.vue$/

function walkCriticalCssModules(moduleList, criticalCSS) {
  for (const { url, file, importedModules } of moduleList) {
    // Prevent infinite loops from circular dependencies
    if (criticalCSS.seenNodes.has(url)) continue
    criticalCSS.seenNodes.add(url)

    /**
     * The module graph accumulates modules across requests and HMR.
     * We skip SFCs that did not render in this request, otherwise
     * styles from previously visited routes would be injected anyway.
     * Note: this doesn't cover non-SFC imports, e.g. .js files, which
     * import CSS files directly themselves. But, it's rare and not
     * have an important effect, just a bit of extra CSS.
     */
    if (vueSfcUrlRE.test(url) && !criticalCSS.renderedSfcFiles.has(file)) {
      continue
    }

    if (
      !inlineStyleRE.test(url) &&
      (url.includes('vue&type=style') || styleUrlRE.test(url))
    ) {
      criticalCSS.meta.endingHeadTags +=
        `<link${criticalCSS.nonceAttr} rel="stylesheet"` +
        ` href="${url}" data-quasar-ssr-style>`
    }

    if (importedModules?.size) {
      walkCriticalCssModules(importedModules, criticalCSS)
    }
  }
}

export function injectCriticalCssPath({
  viteServer,
  serverEntryFile,
  rootFolder,
  ssrContext
}) {
  const entryModules = viteServer.moduleGraph.getModulesByFile(
    normalizePath(serverEntryFile)
  )

  if (entryModules) {
    /**
     * The SFCs rendered during the current request, as absolute file paths.
     * Populated by @vitejs/plugin-vue with paths relative to the Vite root.
     */
    const renderedSfcFiles = new Set()
    for (const filename of ssrContext.modules ?? []) {
      renderedSfcFiles.add(normalizePath(join(rootFolder, filename)))
    }

    walkCriticalCssModules(entryModules, {
      seenNodes: new Set(),
      renderedSfcFiles,
      nonceAttr: ssrContext.__quasarNonceAttr,
      meta: ssrContext._meta
    })
  }
}

const idQueryRE = /vue\?vue/
const idQueryReplaceRE = /vue\?vue.*$/
const jsFileRE = /\.[cm]?js$/
const cssFileRE = /\.css$/

/**
 * Strips the query part of the IDs introduced by @vitejs/plugin-vue,
 *   eg: `?vue&type=script&setup=true&lang.ts`
 *   eg: `?vue&type=style&index=0&lang.scss`
 *
 * Otherwise we will have multiple entries for the same file,
 * but NONE will match the actual production ID of the file.
 *
 * Example with the original Vite SSR manifest:
 *  "src/components/UsedOnTwoPlaces.vue?vue&type=script&setup=true&lang.ts": [
 *    "/assets/UsedOnTwoPlaces.vue_vue_type_style_index_0_lang-CCF7vrwS.js",
 *    "/assets/UsedOnTwoPlaces-CLKnUPw2.css"
 *  ],
 *  "src/components/UsedOnTwoPlaces.vue?vue&type=style&index=0&lang.scss": [
 *    "/assets/UsedOnTwoPlaces.vue_vue_type_style_index_0_lang-CCF7vrwS.js",
 *    "/assets/UsedOnTwoPlaces-CLKnUPw2.css"
 *  ],
 *
 * See https://github.com/quasarframework/quasar/issues/17864
 */
function dedupeVueIds(viteSsrManifest) {
  const acc = {}

  for (let key in viteSsrManifest) {
    const value = viteSsrManifest[key]

    if (idQueryRE.test(key)) {
      key = key.replace(idQueryReplaceRE, 'vue')
      if (acc[key] !== void 0) continue
    }

    acc[key] = value
  }

  return acc
}

/**
 * The Vite client manifest is keyed by source file, while the SSR manifest
 * points to the emitted files. This maps an emitted file back to its key.
 */
function getChunkKeyByFileMap(viteClientManifest) {
  const acc = new Map()

  for (const key in viteClientManifest) {
    const { file } = viteClientManifest[key]
    if (file !== void 0) acc.set(file, key)
  }

  return acc
}

/**
 * The CSS of a chunk plus the CSS of everything it statically imports
 * (which the browser cannot avoid loading along with it), in the order
 * Vite's own preload helper loads them: a chunk's imports come first,
 * its own CSS last, so a dependency's stylesheet always precedes the
 * stylesheet of the chunk importing it. Ordering them any other way
 * would make a server-rendered page cascade differently than the same
 * page reached through client-side navigation.
 *
 * Dynamic imports are deliberately left out: they are loaded on demand,
 * so preloading their CSS would mean preloading the whole app.
 */
function collectChunkCssFiles(chunkKey, viteClientManifest, seenKeys, acc) {
  if (seenKeys.has(chunkKey)) return acc
  seenKeys.add(chunkKey)

  const chunk = viteClientManifest[chunkKey]
  if (chunk === void 0) return acc

  if (chunk.imports !== void 0) {
    for (const key of chunk.imports) {
      collectChunkCssFiles(key, viteClientManifest, seenKeys, acc)
    }
  }

  if (chunk.css !== void 0) {
    for (const file of chunk.css) {
      if (!acc.includes(file)) acc.push(file)
    }
  }

  return acc
}

function getChunkCssFiles(chunkKey, viteClientManifest) {
  return collectChunkCssFiles(chunkKey, viteClientManifest, new Set(), [])
}

export function createSsrManifest({
  viteSsrManifest,
  viteClientManifest,
  publicPath = '/'
}) {
  const ssrManifest = dedupeVueIds(viteSsrManifest)

  if (Object(viteClientManifest) !== viteClientManifest) {
    return ssrManifest
  }

  const chunkKeyByFile = getChunkKeyByFileMap(viteClientManifest)
  const cssFilesCache = new Map()

  // the entry chunks' CSS is already part of the HTML shell,
  // so re-emitting it at render time would only duplicate the tags
  const entryCssFiles = new Set()
  for (const key in viteClientManifest) {
    if (viteClientManifest[key].isEntry !== true) continue

    for (const file of getChunkCssFiles(key, viteClientManifest)) {
      entryCssFiles.add(file)
    }
  }

  const toChunkFile = file =>
    file.startsWith(publicPath)
      ? file.slice(publicPath.length)
      : file.startsWith('/')
        ? file.slice(1)
        : file

  for (const key in ssrManifest) {
    const files = ssrManifest[key]

    // the CSS is re-emitted as a whole, in the chunk graph's own order:
    // what the SSR manifest lists is only the chunk's own CSS, which
    // belongs after the CSS of everything that chunk imports
    const restFiles = []
    const cssFiles = []

    for (const file of files) {
      if (cssFileRE.test(file)) continue

      restFiles.push(file)

      if (!jsFileRE.test(file)) continue

      const chunkFile = toChunkFile(file)
      const chunkKey = chunkKeyByFile.get(chunkFile)
      if (chunkKey === void 0) continue

      let chunkCssFiles = cssFilesCache.get(chunkFile)
      if (chunkCssFiles === void 0) {
        chunkCssFiles = getChunkCssFiles(chunkKey, viteClientManifest)
          .filter(cssFile => !entryCssFiles.has(cssFile))
          .map(cssFile => publicPath + cssFile)

        cssFilesCache.set(chunkFile, chunkCssFiles)
      }

      for (const cssFile of chunkCssFiles) {
        if (!cssFiles.includes(cssFile)) cssFiles.push(cssFile)
      }
    }

    // CSS the SSR manifest listed that the chunk graph did not account for
    for (const file of files) {
      if (cssFileRE.test(file) && !cssFiles.includes(file)) cssFiles.push(file)
    }

    ssrManifest[key] = [...restFiles, ...cssFiles]
  }

  return ssrManifest
}
