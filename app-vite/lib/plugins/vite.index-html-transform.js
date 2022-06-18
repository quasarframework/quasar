
const { transformHtml } = require('../helpers/html-template')

module.exports = quasarConf => {
  return {
    name: 'quasar:index-html-transform',
    enforce: 'pre',
    transformIndexHtml: {
      enforce: 'pre',
      transform: html => transformHtml(html, quasarConf)
    }
  }
}
