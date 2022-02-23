
const getHtmlTemplate = require('../helpers/get-html-template')

module.exports = quasarConf => {
  return {
    name: 'quasar:index-html-transform',
    enforce: 'pre',
    transformIndexHtml: {
      enforce: 'pre',
      transform: html => getHtmlTemplate(html, quasarConf)
    }
  }
}
