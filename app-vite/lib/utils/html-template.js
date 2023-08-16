
import compileTemplate from 'lodash/template.js'
import { minify } from 'html-minifier'

const absoluteUrlRE = /^(https?:\/\/|\/)/i

export const entryPointMarkup = '<!-- quasar:entry-point -->'
export const attachMarkup = '<div id="q-app"></div>'

const minifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
  removeAttributeQuotes: true,
  collapseBooleanAttributes: true,
  removeScriptTypeAttributes: true
  // more options:
  // https://github.com/kangax/html-minifier#options-quick-reference
}

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
      /(<html[^>]*)(>)/i,
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
      /(<head[^>]*)(>)/i,
      (_, start, end) => `${ start }${ end }{{ ssrContext._meta.headTags }}`
    )
    .replace(
      /(<\/head>)/i,
      (_, tag) => `{{ ssrContext._meta.endingHeadTags || '' }}${ tag }`
    )
    .replace(
      /(<body[^>]*)(>)/i,
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
    + `<script src="http://${ host }:${ port }"></script>`
  )

  return html.replace(
    /(<\/head>)/i,
    (_, tag) => `${ scripts }${ tag }`
  )
}

export function transformHtml (template, quasarConf) {
  const { publicPath } = quasarConf.build
  const compiled = compileTemplate(template)

  let html = compiled(quasarConf.htmlVariables)

  // should be dev only
  if (quasarConf.metaConf.vueDevtools !== false) {
    html = injectVueDevtools(html, quasarConf.metaConf.vueDevtools)
  }

  html = html.replace(
    entryPointMarkup,
    (quasarConf.ctx.mode.ssr === true ? entryPointMarkup : attachMarkup)
      + quasarConf.metaConf.entryScript
  )

  // publicPath will be handled by Vite middleware
  // if src/href are not relative, which is what we need
  if (publicPath) {
    html = injectPublicPath(html, '/')
  }

  if (quasarConf.ctx.mode.ssr !== true && quasarConf.build.minify !== false) {
    html = minify(html, minifyOptions)
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
    html = minify(html, minifyOptions)
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
    `${ entryPointMarkup }${ quasarConf.metaConf.entryScript }`
  )

  return compileTemplate(html, { interpolate: /{{([\s\S]+?)}}/g, variable: 'ssrContext' })
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
      ...minifyOptions,
      ignoreCustomFragments: [ /{{([\s\S]+?)}}/ ]
    })
  }

  return compileTemplate(html, { interpolate: /{{([\s\S]+?)}}/g, variable: 'ssrContext' })
}
