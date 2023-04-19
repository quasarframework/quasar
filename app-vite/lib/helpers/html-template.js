
const compileTemplate = require('lodash/template')
const { minify } = require('html-minifier')

const absoluteUrlRE = /^(https?:\/\/|\/)/i
const entryPointMarkup = '<!-- quasar:entry-point -->'
const entryScript = '<script type="module" src="/.quasar/client-entry.js"></script>'
const attachMarkup = '<div id="q-app"></div>'

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
    (_, att, pre, val, post) => absoluteUrlRE.test(val.trim()) === true
      ? `${att}=${pre}${val}${post}`
      : `${att}=${pre}${publicPath + val}${post}`
  )
}

function injectRuntimeInterpolation (html) {
  return html
  .replace(
    /(<html[^>]*)(>)/i,
    (found, start, end) => {
      let matches

      matches = found.match(/\sdir\s*=\s*['"]([^'"]*)['"]/i)
      if (matches) {
        start = start.replace(matches[0], '')
      }

      matches = found.match(/\slang\s*=\s*['"]([^'"]*)['"]/i)
      if (matches) {
        start = start.replace(matches[0], '')
      }

      return `${start} {{ _meta.htmlAttrs }}${end}`
    }
  )
  .replace(
    /(<head[^>]*)(>)/i,
    (_, start, end) => `${start}${end}{{ _meta.headTags }}`
  )
  .replace(
    /(<\/head>)/i,
    (_, tag) => `{{ _meta.endingHeadTags || '' }}${tag}`
  )
  .replace(
    /(<body[^>]*)(>)/i,
    (found, start, end) => {
      let classes = '{{ _meta.bodyClasses }}'

      const matches = found.match(/\sclass\s*=\s*['"]([^'"]*)['"]/i)

      if (matches) {
        if (matches[1].length > 0) {
          classes += ` ${matches[1]}`
        }
        start = start.replace(matches[0], '')
      }

      return `${start} class="${classes.trim()}" {{ _meta.bodyAttrs }}${end}{{ _meta.bodyTags }}`
    }
  )
}

module.exports.entryPointMarkup = entryPointMarkup
module.exports.attachMarkup = attachMarkup

module.exports.transformHtml = function (template, quasarConf) {
  const { publicPath } = quasarConf.build
  const compiled = compileTemplate(template)

  let html = compiled(quasarConf.htmlVariables)

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
    html = minify(html, minifyOptions)
  }

  return html
}

/**
 * Used by production SSR only.
 * Gets index.html generated content as param.
 */
module.exports.transformProdSsrPwaOfflineHtml = function (html, quasarConf) {
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
module.exports.getDevSsrTemplateFn = function (template, quasarConf) {
  const compiled = compileTemplate(template)

  let html = compiled(quasarConf.htmlVariables)

  // publicPath will be handled by Vite middleware
  // if src/href are not relative, which is what we need
  html = injectPublicPath(html, '/')
  html = injectRuntimeInterpolation(html)

  html = html.replace(
    entryPointMarkup,
    `${entryPointMarkup}${entryScript}`
  )

  return compileTemplate(html, { interpolate: /{{([\s\S]+?)}}/g })
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
module.exports.getProdSsrTemplateFn = function (viteHtmlContent, quasarConf) {
  let html = injectRuntimeInterpolation(viteHtmlContent)

  html = html.replace(
    entryPointMarkup,
    `<div id="q-app">{{ _meta.runtimePageContent }}</div>`
  )

  if (quasarConf.build.minify !== false) {
    html = minify(html, {
      ...minifyOptions,
      ignoreCustomFragments: [ /{{([\s\S]+?)}}/ ]
    })
  }

  return compileTemplate(html, { interpolate: /{{([\s\S]+?)}}/g })
}
