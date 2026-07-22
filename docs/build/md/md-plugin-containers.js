/**
 * Custom markdown containers (parsing + HTML render).
 *
 * Two exports:
 *   - registerContainers(md): parsing-only registration (no HTML render hooks).
 *     Used by the AI-docs extractor, which provides its own emitters.
 *   - default export: original HTML-emitting plugin used by the live docs site.
 *
 * Container syntax:
 *
 *   ::: tip
 *   My tip...
 *   :::
 *
 *   ::: warning WATCH OUT
 *   Custom title
 *   :::
 *
 *   ::: danger / ::: details (same shape)
 */

import container from 'markdown-it-container'

const TYPES = ['tip', 'warning', 'danger', 'details']
const DEFAULT_TITLES = {
  tip: 'TIP',
  warning: 'WARNING',
  danger: 'WARNING',
  details: 'Details'
}

/**
 * Register the parsing rules for all four custom containers WITHOUT installing
 * HTML render hooks. Consumed by the AI-docs extractor, which produces its own
 * markdown for these blocks via the token walker.
 *
 * @param {import('markdown-it')} md
 */
export function registerContainers(md) {
  for (const type of TYPES) {
    md.use(container, type, {})
  }
}

function htmlRenderFor(type) {
  const typeLength = type.length
  return (tokens, idx) => {
    const token = tokens[idx]
    const title =
      token.info.trim().slice(typeLength).trim() || DEFAULT_TITLES[type]
    if (type === 'details') {
      return token.nesting === 1
        ? `<details class="doc-note doc-note--${type}"><summary class="doc-note__title">${title}</summary>\n`
        : '</details>\n'
    }

    return token.nesting === 1
      ? `<div class="doc-note doc-note--${type}"><p class="doc-note__title">${title}</p>\n`
      : '</div>\n'
  }
}

export default function mdPluginContainers(md) {
  registerContainers(md)
  for (const type of TYPES) {
    const render = htmlRenderFor(type)
    md.renderer.rules[`container_${type}_open`] = render
    md.renderer.rules[`container_${type}_close`] = render
  }
}
