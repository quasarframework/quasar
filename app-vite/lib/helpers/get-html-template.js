
const compileTemplate = require('lodash.template')

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
    (_, tag) => `{{ _meta.resourceStyles }}{{ _meta.endingHeadTags || '' }}${tag}`
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
  .replace(
    '<!-- quasar:entry-point -->',
    '<div id="q-app">{{ _meta.resourceApp }}</div>{{ _meta.resourceScripts }}'
  )
}

function injectEntryPoints (html, clientManifest, publicPath) {
  const js = []
  const css = []

  const inject = target => {
    if (target.css !== void 0) {
      target.css.forEach(file => {
        css.push(publicPath + file)
      })
    }

    if (target.imports !== void 0) {
      target.imports.forEach(entry => {
        const def = clientManifest[entry]
        inject(def)
      })
    }

    js.push(publicPath + target.file)
  }

  inject(clientManifest['.quasar/client-entry.js'])

  const jsPreloadTags = js
    .map(file => `<link rel="modulepreload" crossorigin href="${file}">`)
    .join('')

  const jsTag = `<script type="module" crossorigin src="${js[js.length - 1]}"></script>`

  const cssTags = css
    .map(file => `<link rel="stylesheet" href="${file}">`)
    .join('')

  return html
  .replace(
    /(<\/head>)/i,
    (_, tag) => `${cssTags}${jsPreloadTags}${tag}`
  )
  .replace(
    '<!-- quasar:entry-point -->',
    `<!-- quasar:entry-point -->${jsTag}`
  )
}

const absoluteUrlRE = /^(https?:\/\/|\/)/i

function injectPublicPath (html, publicPath) {
  return html.replace(
    /(href|src)\s*=\s*['"](.+)['"]/ig,
    (_, att, val) => absoluteUrlRE.test(val.trim()) === true
      ? `${att}=${val}`
      : `${att}=${publicPath + val}`
  )
}

module.exports = function (template, quasarConf, clientManifest) {
  const { publicPath = '' } = quasarConf.build
  const compiled = compileTemplate(template)

  let html = compiled(quasarConf.htmlVariables)

  if (quasarConf.ctx.mode.ssr === true) {
    html = injectPublicPath(html, publicPath)

    if (clientManifest !== void 0) {
      html = injectEntryPoints(html, clientManifest, publicPath)
    }

    html = injectRuntimeInterpolation(html)
  }
  else {
    // publicPath tampered by vite, so we just need a forward slash

    if (publicPath) {
      html = injectPublicPath(html, '/')
    }

    const file = (publicPath ? '/' : '') + '.quasar/client-entry.js'
    html = html.replace(
      '<!-- quasar:entry-point -->',
      `<div id="q-app"></div><script type="module" src="${file}"></script>`
    )
  }

  if (quasarConf.build.minify) {
    const { minify } = require('html-minifier')
    html = minify(html, {
      ...quasarConf.metaConf.html.minifyOptions,
      ignoreCustomFragments: [ /{{ [\s\S]*? }}/ ]
    })
  }

  return quasarConf.ctx.mode.ssr === true
    ? compileTemplate(html, { interpolate: /{{([\s\S]+?)}}/g })
    : html
}
