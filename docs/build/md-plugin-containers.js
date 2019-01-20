/**
 * Adds custom markdown containers
 *
 * ::: tip
 * My tip...
 * :::
 *
 * ::: warning
 * My warning
 * :::
 *
 * ::: danger
 * My dangerous message
 * :::
 *
 * Custom title:
 *
 * ::: warning WATCH OUT
 * My description
 * :::
 */

const container = require('markdown-it-container')

function createContainer (className, defaultTitle) {
  return [
    container,
    className,
    {
      render (tokens, idx) {
        const token = tokens[idx]
        const info = token.info.trim().slice(className.length).trim()
        if (token.nesting === 1) {
          return `<div class="doc-note doc-note--${className}"><p class="doc-note__title">${info || defaultTitle}</p>\n`
        }
        else {
          return `</div>\n`
        }
      }
    }
  ]
}

module.exports = function (md) {
  md
    .use(...createContainer('tip', 'TIP'))
    .use(...createContainer('warning', 'WARNING'))
    .use(...createContainer('danger', 'WARNING'))

    // explicitly escape Vue syntax
    .use(container, 'v-pre', {
      render: (tokens, idx) => tokens[idx].nesting === 1
        ? `<div v-pre>\n`
        : `</div>\n`
    })
}
