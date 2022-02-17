const compileTemplate = require('lodash.template')

const entryFile = '.quasar/client-entry.js'
const entryScript = `<div id="q-app"></div><script type="module" src="${entryFile}"></script>`

module.exports = quasarConf => {
  return {
    name: 'quasar:index-html-transform',
    enforce: 'pre',
    transformIndexHtml: {
      enforce: 'pre',
      transform: html => {
        const compiled = compileTemplate(html)
        return compiled(quasarConf.htmlVariables).replace(
          '<!-- quasar:entry-point -->',
          entryScript
        )
      }
    }
  }
}
