import { minify } from 'html-minifier-terser'

import { fatal, warn } from '../utils/logger.js'
import {
  compileTemplateToFile,
  compileTemplateToFn,
  renderTemplate,
  templateRenderError
} from '../utils/template.js'

let htmlStore = null

const importMetaEnv = new Proxy(
  {},
  {
    get(target, propName, receiver) {
      if (typeof propName !== 'string' || Object.hasOwn(target, propName)) {
        return Reflect.get(target, propName, receiver)
      }

      const key = `import.meta.env.${propName}`
      const { define, clientEnvDefineList, backendEnvDefineList } = htmlStore

      if (Object.hasOwn(define, key)) {
        const val = define[key]
        return val.charAt(0) === '"' ? val.slice(1, -1) : val
      }

      if (Object.hasOwn(clientEnvDefineList, key)) {
        const val = clientEnvDefineList[key]
        return val.charAt(0) === '"' ? val.slice(1, -1) : val
      }

      if (Object.hasOwn(backendEnvDefineList, key)) {
        const val = backendEnvDefineList[key]
        return val.charAt(0) === '"' ? val.slice(1, -1) : val
      }
    }
  }
)

export function updateHtmlVariables({
  htmlVariables,
  build: { define },
  metaConf: { clientEnvDefineList, backendEnvDefineList }
}) {
  return (htmlStore = {
    define,
    clientEnvDefineList,
    backendEnvDefineList,
    htmlVariables: {
      ...htmlVariables,
      importMetaEnv
    }
  })
}

export function quasarViteIndexHtmlTransformPlugin(quasarConf) {
  /**
   * The following is mainly for production so we don't have
   * to worry about calling updateHtmlVariables():
   */
  if (htmlStore === null) updateHtmlVariables(quasarConf)

  return {
    name: 'quasar:html',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler: html => transformHtml(html, htmlStore.htmlVariables, quasarConf)
    }
  }
}

const absoluteUrlRE = /^(https?:\/\/|\/|data:)/i
const ssrInterpolations = [/{{([\s\S]+?)}}/g]

const templateCompileOpts = { varName: false }
const ssrTemplateCompileOpts = {
  varName: 'ssrContext',
  tagStart: '{{',
  tagEnd: '}}',
  exec: false,
  interpolate: ''
}

const htmlStartTagRE = /(<html[^>]*)(>)/i
const headStartTagRE = /(<head[^>]*)(>)/i
const headEndRE = /(<\/head>)/i
const bodyStartTagRE = /(<body[^>]*)(>)/i

const hrefSrcRE = /(href|src)\s*=\s*(['"])(.+)(['"])/gi

export const entryPointMarkup = '<!-- quasar:entry-point -->'
export const attachMarkup = '<div id="q-app"></div>'

function injectPublicPath(html, publicPath) {
  return html.replaceAll(hrefSrcRE, (_, att, pre, val, post) =>
    absoluteUrlRE.test(val.trim())
      ? `${att}=${pre}${val}${post}`
      : `${att}=${pre}${publicPath + val}${post}`
  )
}

function injectSsrRuntimeInterpolation(html) {
  return html
    .replace(htmlStartTagRE, (found, start, end) => {
      let matches

      matches = found.match(/\sdir\s*=\s*['"]([^'"]*)['"]/i)
      if (matches) {
        start = start.replace(matches[0], '')
      }

      matches = found.match(/\slang\s*=\s*['"]([^'"]*)['"]/i)
      if (matches) {
        start = start.replace(matches[0], '')
      }

      return `${start} {{ ssrContext._meta.htmlAttrs }}${end}`
    })
    .replace(
      headStartTagRE,
      (_, start, end) => `${start}${end}{{ ssrContext._meta.headTags }}`
    )
    .replace(
      headEndRE,
      (_, tag) => `{{ ssrContext._meta.endingHeadTags || '' }}${tag}`
    )
    .replace(bodyStartTagRE, (found, start, end) => {
      let classes = '{{ ssrContext._meta.bodyClasses }}'

      const matches = found.match(/\sclass\s*=\s*['"]([^'"]*)['"]/i)

      if (matches) {
        if (matches[1].length !== 0) {
          classes += ` ${matches[1]}`
        }
        start = start.replace(matches[0], '')
      }

      return `${start} class="${classes.trim()}" {{ ssrContext._meta.bodyAttrs }}${end}{{ ssrContext._meta.bodyTags }}`
    })
}

function injectVueDevtools(html, { host, port }, nonce = '') {
  const scripts =
    `<script${nonce}>window.__VUE_DEVTOOLS_HOST__='${host}';window.__VUE_DEVTOOLS_PORT__='${port}';</script>` +
    `\n<script src="http://${host}:${port}"></script>`

  return html.replace(headEndRE, (_, tag) => `${scripts}${tag}`)
}

const templareErrorHtmlPage = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>HTML template compilation error</title>
    </head>
    <body>
      <div style="display:flex;flex-direction:row;align-items:center;justify-content:center;height: 100vh;">
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid #000;padding:20px;border-radius:4px;">
          <h1>HTML template compilation error</h1>
          <p>
            Please check the source around "&lt;%" and "%&gt;" for invalid usage.
          </p>
        </div>
    </body>
  </html>
`

function handleTemplateError(isProd) {
  if (isProd) {
    fatal(
      `HTML template compilation failed. Please check the source around "<%" and "%>" for invalid usage.`
    )
  }

  warn()
  warn(
    `Please check the source around "<%" and "%>" for invalid usage.`,
    'HTML template compilation failed'
  )
  warn()

  return templareErrorHtmlPage
}

async function transformHtml(template, htmlVariables, quasarConf) {
  let html = renderTemplate(template, htmlVariables, templateCompileOpts)
  if (html === templateRenderError) {
    return handleTemplateError(quasarConf.ctx.prod)
  }

  // should be dev only
  if (quasarConf.metaConf.vueDevtools) {
    html = injectVueDevtools(html, quasarConf.metaConf.vueDevtools)
  }

  html = html.replace(
    entryPointMarkup,
    (quasarConf.ctx.mode.ssr || quasarConf.ctx.mode.ssg
      ? entryPointMarkup
      : attachMarkup) + quasarConf.metaConf.entryScript.tag
  )

  // publicPath will be handled by Vite middleware
  // if src/href are not relative, which is what we need
  if (quasarConf.build.publicPath) {
    html = injectPublicPath(html, '/')
  }

  if (
    !quasarConf.ctx.mode.ssr &&
    !quasarConf.ctx.mode.ssg &&
    quasarConf.build.minify
  ) {
    html = await minify(html, quasarConf.build.htmlMinifyOptions)
  }

  return html
}

/**
 * Used by production SSR+PWA and Hybrid SSG+CSR only.
 * Gets index.html generated content as param.
 */
export async function transformProdHtmlShell(html, quasarConf) {
  html = html.replace(entryPointMarkup, attachMarkup)

  if (quasarConf.build.minify !== false) {
    html = await minify(html, quasarConf.build.htmlMinifyOptions)
  }

  return html
}

/**
 * Used by dev SSR only
 *
 * // ...at runtime:
 * let html = fn(ssrContext)
 * html = await vite.transformIndexHtml(html)
 * html = html.replace('<!-- quasar:entry-point -->', '<div id="q-app">...</div>')
 */
export function getDevSsrTemplateFn(template, htmlVariables, quasarConf) {
  let html = renderTemplate(template, htmlVariables, templateCompileOpts)
  if (html === templateRenderError) {
    return () => handleTemplateError(false)
  }

  // publicPath will be handled by Vite middleware
  // if src/href are not relative, which is what we need
  html = injectPublicPath(html, '/')
  html = injectSsrRuntimeInterpolation(html)

  if (quasarConf.metaConf.vueDevtools) {
    html = injectVueDevtools(
      html,
      quasarConf.metaConf.vueDevtools,
      "{{ ssrContext.nonce ? ' nonce=\"' + ssrContext.nonce + '\"' : '' }}"
    )
  }

  return compileTemplateToFn(html, ssrTemplateCompileOpts)
}

/**
 * Used by production SSR only
 *
 * const viteHtmlContent = // ...vite client generated index.html
 *                         // which went through transformHtml() already
 *
 * const fn = await getProdSsrRenderTemplateFileContent(viteHtmlContent, quasarConf)
 *
 * // ... at runtime:
 * const html = fn(ssrContext)
 */
export async function getProdSsrRenderTemplateFileContent(
  viteHtmlContent,
  quasarConf
) {
  let html = injectSsrRuntimeInterpolation(viteHtmlContent)

  html = html.replace(
    entryPointMarkup,
    '<div id="q-app">{{ ssrContext._meta.runtimePageContent }}</div>'
  )

  if (quasarConf.build.minify !== false) {
    html = await minify(html, {
      ...quasarConf.build.htmlMinifyOptions,
      ignoreCustomFragments: ssrInterpolations
    })
  }

  return compileTemplateToFile(html, ssrTemplateCompileOpts)
}

export function fastExtractPath(url) {
  let endIdx = url.length

  const hashIdx = url.indexOf('#')
  const queryIdx = url.indexOf('?')
  if (hashIdx !== -1) endIdx = hashIdx
  if (queryIdx !== -1 && queryIdx < endIdx) endIdx = queryIdx

  const cleanInput = url.slice(0, endIdx)

  if (cleanInput.startsWith('http://') || cleanInput.startsWith('https://')) {
    const protocolEnd = cleanInput.indexOf('://') + 3
    const pathStart = cleanInput.indexOf('/', protocolEnd)
    return pathStart === -1 ? '/' : cleanInput.slice(pathStart)
  }

  if (cleanInput.startsWith('//')) {
    const pathStart = cleanInput.indexOf('/', 2)
    return pathStart === -1 ? '/' : cleanInput.slice(pathStart)
  }

  return cleanInput.startsWith('/') ? cleanInput : '/' + cleanInput
}
