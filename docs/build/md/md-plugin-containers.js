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

function createContainer (containerType, defaultTitle) {
  const containerTypeLen = containerType.length

  return [
    container,
    containerType,
    {
      render (tokens, idx) {
        const token = tokens[ idx ]
        const title = token.info.trim().slice(containerTypeLen).trim() || defaultTitle

        if (containerType === 'details') {
          return token.nesting === 1
            ? `<details class="doc-note doc-note--${ containerType }"><summary class="doc-note__title">${ title }</summary>\n`
            : '</details>\n'
        }

        return token.nesting === 1
          ? `<div class="doc-note doc-note--${ containerType }"><p class="doc-note__title">${ title }</p>\n`
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
}
