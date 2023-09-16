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
 * ::: details
 * These are some details that need to be expanded to be seen.
 * :::
 *
 * Custom title:
 *
 * ::: warning WATCH OUT
 * My description
 * :::
 */

import container from 'markdown-it-container'

function createContainer (className, defaultTitle) {
  return [
    container,
    className,
    {
      render (tokens, idx) {
        const token = tokens[ idx ]
        const info = token.info.trim().slice(className.length).trim()

        if (className === 'details') {
          return token.nesting === 1
            ? `<details class="doc-note doc-note--${className}"><summary class="doc-note__title">${info || defaultTitle}</summary>\n`
            : '</details>\n'
        }

        return token.nesting === 1
          ? `<div class="doc-note doc-note--${className}"><p class="doc-note__title">${info || defaultTitle}</p>\n`
          : '</div>\n'
      }
    }
  ]
}

export default function mdPluginContainers (md) {
  md
    .use(...createContainer('tip', 'TIP'))
    .use(...createContainer('warning', 'WARNING'))
    .use(...createContainer('danger', 'WARNING'))
    .use(...createContainer('details', 'Details'))

    // explicitly escape Vue syntax
    .use(container, 'v-pre', {
      render: (tokens, idx) => tokens[ idx ].nesting === 1
        ? '<div v-pre>\n'
        : '</div>\n'
    })
}
