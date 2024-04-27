const compileTemplate = require('lodash/template')
const { minify } = require('html-minifier-terser')

const absoluteUrlRE = /^(https?:\/\/|\/|data:)/i
const entryPointMarkup = '<!-- quasar:entry-point -->'
const entryScript = '<script type="module" src="/.quasar/client-entry.js"></script>'
const attachMarkup = '<div id="q-app"></div>'

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

        return `${ start } {{ _meta.htmlAttrs }}${ end }`
      }
    )
    .replace(
      /(<head[^>]*)(>)/i,
      (_, start, end) => `${ start }${ end }{{ _meta.headTags }}`
    )
    .replace(
      /(<\/head>)/i,
      (_, tag) => `{{ _meta.endingHeadTags || '' }}${ tag }`
    )
    .replace(
      /(<body[^>]*)(>)/i,
      (found, start, end) => {
        let classes = '{{ _meta.bodyClasses }}'

        const matches = found.match(/\sclass\s*=\s*['"]([^'"]*)['"]/i)

        if (matches) {
          if (matches[ 1 ].length > 0) {
            classes += ` ${ matches[ 1 ] }`
          }
          start = start.replace(matches[ 0 ], '')
        }

        return `${ start } class="${ classes.trim() }" {{ _meta.bodyAttrs }}${ end }{{ _meta.bodyTags }}`
      }
    )
}

module.exports.entryPointMarkup = entryPointMarkup
module.exports.attachMarkup = attachMarkup

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

module.exports.transformHtml = async function (template, quasarConf) {
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
      + entryScript
  )

  // publicPath will be handled by Vite middleware
  // if src/href are not relative, which is what we need
  if (publicPath) {
    html = injectPublicPath(html, '/')
  }

  if (quasarConf.ctx.mode.ssr !== true && quasarConf.build.minify !== false) {
    html = await minify(html, quasarConf.build.htmlMinifyOptions)
  }

  return html
}

/**
 * Used by production SSR only.
 * Gets index.html generated content as param.
 */
module.exports.transformProdSsrPwaOfflineHtml = async function (html, quasarConf) {
  html = html.replace(
    entryPointMarkup,
    attachMarkup
  )

  if (quasarConf.build.minify !== false) {
    html = await minify(html, quasarConf.build.htmlMinifyOptions)
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
module.exports.getDevSsrTemplateFn = function (template, quasarConf) {
  const compiled = compileTemplate(template)

  let html = compiled(quasarConf.htmlVariables)

  // publicPath will be handled by Vite middleware
  // if src/href are not relative, which is what we need
  html = injectPublicPath(html, '/')
  html = injectSsrRuntimeInterpolation(html)

  if (quasarConf.metaConf.vueDevtools !== false) {
    html = injectVueDevtools(html, quasarConf.metaConf.vueDevtools, '{{ typeof nonce !== \'undefined\' ? \' nonce="\' + nonce + \'"\' : \'\' }}')
  }

  html = html.replace(
    entryPointMarkup,
    `${ entryPointMarkup }${ entryScript }`
  )

  return compileTemplate(html, { interpolate: /{{([\s\S]+?)}}/g })
}

/**
 * Used by production SSR only
 *
 * const viteHtmlContent = // ...vite client generated index.html
 *                         // which went through transformHtml() already
 *
 * const fn = await getProdSsrTemplateFn(viteHtmlContent, quasarConf)
 *
 * // ... at runtime:
 * const html = fn(ssrContext)
 */
module.exports.getProdSsrTemplateFn = async function (viteHtmlContent, quasarConf) {
  let html = injectSsrRuntimeInterpolation(viteHtmlContent)

  html = html.replace(
    entryPointMarkup,
    '<div id="q-app">{{ _meta.runtimePageContent }}</div>'
  )

  if (quasarConf.build.minify !== false) {
    html = await minify(html, {
      ...quasarConf.build.htmlMinifyOptions,
      ignoreCustomFragments: [ /{{([\s\S]+?)}}/ ]
    })
  }

  return compileTemplate(html, { interpolate: /{{([\s\S]+?)}}/g })
}
