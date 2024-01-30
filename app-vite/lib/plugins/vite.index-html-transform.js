import { transformHtml } from '../utils/html-template.js'

export function quasarViteIndexHtmlTransformPlugin (quasarConf) {
  return {
    name: 'quasar:index-html-transform',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler: html => transformHtml(html, quasarConf)
    }
  }
}
