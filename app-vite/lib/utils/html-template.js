import compileTemplate from 'lodash/template.js'
import { minify } from 'html-minifier'

const absoluteUrlRE = /^(https?:\/\/|\/)/i
const ssrInterpolationsRE = /{{([\s\S]+?)}}/g

const htmlStartTagRE = /(<html[^>]*)(>)/i
const headStartTagRE = /(<head[^>]*)(>)/i
const headEndRE = /(<\/head>)/i
const bodyStartTagRE = /(<body[^>]*)(>)/i

export const entryPointMarkup = '<!-- quasar:entry-point -->'
export const attachMarkup = '<div id="q-app"></div>'

function injectPublicPath (html, publicPath) {
  return html.replace(
    /(href|src)\s*=\s*(['"])(.+)(['"])/ig,
    (_, att, pre, val, post) => (absoluteUrlRE.test(val.trim()) === true
      ? `${ att }=${ pre }${ val }${ post }`
      : `${ att }=${ pre }${ publicPath + val }${ post }`)
  )
}

function injectSsrRuntimeInterpolation (html) {
  return html
    .replace(
      htmlStartTagRE,
      (found, start, end) => {
        let matches

        matches = found.match(/\sdir\s*=\s*['"]([^'"]*)['"]/i)
        if (matches) {
          start = start.replace(matches[ 0 ], '')
        }

        matches = found.match(/\slang\s*=\s*['"]([^'"]*)['"]/i)
        if (matches) {
          start = start.replace(matches[ 0 ], '')
        }

        return `${ start } {{ ssrContext._meta.htmlAttrs }}${ end }`
      }
    )
    .replace(
      headStartTagRE,
      (_, start, end) => `${ start }${ end }{{ ssrContext._meta.headTags }}`
    )
    .replace(
      headEndRE,
      (_, tag) => `{{ ssrContext._meta.endingHeadTags || '' }}${ tag }`
    )
    .replace(
      bodyStartTagRE,
      (found, start, end) => {
        let classes = '{{ ssrContext._meta.bodyClasses }}'

        const matches = found.match(/\sclass\s*=\s*['"]([^'"]*)['"]/i)

        if (matches) {
          if (matches[ 1 ].length > 0) {
            classes += ` ${ matches[ 1 ] }`
          }
          start = start.replace(matches[ 0 ], '')
        }

        return `${ start } class="${ classes.trim() }" {{ ssrContext._meta.bodyAttrs }}${ end }{{ ssrContext._meta.bodyTags }}`
      }
    )
}

function injectVueDevtools (html, { host, port }, nonce = '') {
  const scripts = (
    `<script${ nonce }>window.__VUE_DEVTOOLS_HOST__='${ host }';window.__VUE_DEVTOOLS_PORT__='${ port }';</script>`
    + `\n<script src="http://${ host }:${ port }"></script>`
  )

  return html.replace(
    headEndRE,
    (_, tag) => `${ scripts }${ tag }`
  )
}

export function transformHtml (template, quasarConf) {
  const compiled = compileTemplate(template)

  let html = compiled(quasarConf.htmlVariables)

  // should be dev only
  if (quasarConf.metaConf.vueDevtools !== false) {
    html = injectVueDevtools(html, quasarConf.metaConf.vueDevtools)
  }

  html = html.replace(
    entryPointMarkup,
    (quasarConf.ctx.mode.ssr === true ? entryPointMarkup : attachMarkup)
      + quasarConf.metaConf.entryScriptTag
  )

  // publicPath will be handled by Vite middleware
  // if src/href are not relative, which is what we need
  if (quasarConf.build.publicPath) {
    html = injectPublicPath(html, '/')
  }

  if (quasarConf.ctx.mode.ssr !== true && quasarConf.build.minify !== false) {
    html = minify(html, quasarConf.build.htmlMinifyOptions)
  }

  return html
}

/**
 * Used by production SSR only.
 * Gets index.html generated content as param.
 */
export function transformProdSsrPwaOfflineHtml (html, quasarConf) {
  html = html.replace(
    entryPointMarkup,
    attachMarkup
  )

  if (quasarConf.build.minify !== false) {
    html = minify(html, quasarConf.build.htmlMinifyOptions)
  }

  return html
}

/**
 * Used by dev SSR only
 *
 * const fn = getDevSsrTemplateFn(indexHtmlFileContent, quasarConf)
 *
 * // ...at runtime:
 * let html = fn(ssrContext)
 * html = await vite.transformIndexHtml(html)
 * html = html.replace('<!-- quasar:entry-point -->', '<div id="q-app">...</div>')
 */
export function getDevSsrTemplateFn (template, quasarConf) {
  const compiled = compileTemplate(template)

  let html = compiled(quasarConf.htmlVariables)

  // publicPath will be handled by Vite middleware
  // if src/href are not relative, which is what we need
  html = injectPublicPath(html, '/')
  html = injectSsrRuntimeInterpolation(html)

  if (quasarConf.metaConf.vueDevtools !== false) {
    html = injectVueDevtools(html, quasarConf.metaConf.vueDevtools, '{{ ssrContext.nonce ? \' nonce="\' + ssrContext.nonce + \'"\' : \'\' }}')
  }

  html = html.replace(
    entryPointMarkup,
    `${ entryPointMarkup }${ quasarConf.metaConf.entryScriptTag }`
  )

  return compileTemplate(html, { interpolate: ssrInterpolationsRE, variable: 'ssrContext' })
}

/**
 * Used by production SSR only
 *
 * const viteHtmlContent = // ...vite client generated index.html
 *                         // which went through transformHtml() already
 *
 * const fn = getProdSsrTemplateFn(viteHtmlContent, quasarConf)
 *
 * // ... at runtime:
 * const html = fn(ssrContext)
 */
export function getProdSsrTemplateFn (viteHtmlContent, quasarConf) {
  let html = injectSsrRuntimeInterpolation(viteHtmlContent)

  html = html.replace(
    entryPointMarkup,
    '<div id="q-app">{{ ssrContext._meta.runtimePageContent }}</div>'
  )

  if (quasarConf.build.minify !== false) {
    html = minify(html, {
      ...quasarConf.build.htmlMinifyOptions,
      ignoreCustomFragments: [ ssrInterpolationsRE ]
    })
  }

  return compileTemplate(html, { interpolate: ssrInterpolationsRE, variable: 'ssrContext' })
}
