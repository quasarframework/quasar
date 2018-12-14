const
  compileTemplate = require('lodash.template'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  { fillHtmlTags } = require('../webpack/plugin.html-addons'),
  { fillPwaTags } = require('../webpack/pwa/plugin.html-pwa')

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

      return `${start} {{ Q_HTML_ATTRS }}${end}`
    }
  )
  .replace(
    /(<head[^>]*)(>)/i,
    (found, start, end) => `${start}${end}{{ Q_HEAD_TAGS }}`
  )
  .replace(
    /(<body[^>]*)(>)/i,
    (found, start, end) => {
      let classes = '{{ Q_BODY_CLASSES }}'

      const matches = found.match(/\sclass\s*=\s*['"]([^'"]*)['"]/i)

      if (matches) {
        if (matches[1].length > 0) {
          classes += ` ${matches[1]}`
        }
        start = start.replace(matches[0], '')
      }

      return `${start} class="${classes.trim()}" {{ Q_BODY_ATTRS }}${end}{{ Q_BODY_TAGS }}`
    }
  )
}

module.exports.getIndexHtml = function (template, cfg) {
  const compiled = compileTemplate(
    template.replace('<div id="q-app"></div>', '<!--vue-ssr-outlet-->')
  )
  let html = compiled({
    htmlWebpackPlugin: {
      options: cfg.__html.variables
    }
  })

  const data = { body: [], head: [] }

  fillHtmlTags(data, cfg)

  if (cfg.ctx.mode.pwa) {
    fillPwaTags(data, cfg)
  }

  html = HtmlWebpackPlugin.prototype.injectAssetsIntoHtml(html, {}, data)
  html = injectSsrInterpolation(html)

  if (cfg.build.minify) {
    const { minify } = require('html-minifier')
    html = minify(html, Object.assign({}, cfg.__html.minifyOptions, {
      ignoreCustomComments: [ /vue-ssr-outlet/ ],
      ignoreCustomFragments: [ /{{ [\s\S]*? }}/ ]
    }))
  }

  return html
}
