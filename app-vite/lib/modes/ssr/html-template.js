const compileTemplate = require('lodash.template')

/*
 * _meta is initialized from ssr-helpers/create-renderer
 * _meta.resource[X] is generated from ssr-helpers/create-renderer
 */

function injectSsrInterpolation (html) {
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
  .replace(
    '<!-- quasar:entry-point -->',
    '<div id="q-app">{{ _meta.resourceApp }}</div>{{ _meta.resourceScripts }}'
  )
}

module.exports.getIndexHtml = function (template, quasarConf) {
  const compiled = compileTemplate(template)
  let html = compiled(quasarConf.htmlVariables)

  html = injectSsrInterpolation(html)

  if (quasarConf.build.minify) {
    const { minify } = require('html-minifier')
    html = minify(html, {
      ...quasarConf.metaConf.html.minifyOptions,
      ignoreCustomFragments: [ /{{ [\s\S]*? }}/ ]
    })
  }

  return compileTemplate(html, { interpolate: /{{([\s\S]+?)}}/g })
}
