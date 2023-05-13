
const { transformHtml } = require('../utils/html-template.js')

module.exports.quasarViteIndexHtmlTransformPlugin = function quasarViteIndexHtmlTransformPlugin (quasarConf) {
  return {
    name: 'quasar:index-html-transform',
    enforce: 'pre',
    transformIndexHtml: {
      enforce: 'pre',
      transform: html => transformHtml(html, quasarConf)
    }
  }
}
