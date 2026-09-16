/**
 * Blockquotes and the notes written as GitHub alerts:
 *
 *   > [!TIP]
 *   > **Optional title**
 *   >
 *   > Body...
 *
 * An alert renders as a doc note, a leading bold-only paragraph is its
 * title, any other blockquote keeps the plain doc-note look. Raw
 * <details>/<summary> blocks get the doc-note classes on the way out.
 */

const ALERTS = {
  NOTE: { type: 'note', title: 'NOTE' },
  TIP: { type: 'tip', title: 'TIP' },
  IMPORTANT: { type: 'important', title: 'IMPORTANT' },
  WARNING: { type: 'warning', title: 'WARNING' },
  CAUTION: { type: 'danger', title: 'WARNING' }
}

const markerRE = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\n|$)/
const titleRE = /^\*\*([^\n]+)\*\*$/

/**
 * Marks every alert blockquote before the inline pass: the marker line goes,
 * a bold-only first paragraph becomes the title, and both blockquote tokens
 * carry the alert in their meta.
 *
 * @param {import('markdown-it').StateCore} state
 */
function markAlerts(state) {
  const { tokens } = state

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== 'blockquote_open') {
      continue
    }

    const inline = tokens[i + 2]
    if (tokens[i + 1].type !== 'paragraph_open' || inline.type !== 'inline') {
      continue
    }

    const match = markerRE.exec(inline.content)
    if (match === null) {
      continue
    }

    const alert = ALERTS[match[1]]
    inline.content = inline.content.slice(match[0].length)

    // the marker paragraph is empty once the marker is gone
    if (inline.content === '') {
      tokens.splice(i + 1, 3)
    }

    let title = alert.title
    let ownTitle = false
    const first = tokens[i + 2]
    if (tokens[i + 1].type === 'paragraph_open' && first.type === 'inline') {
      const titleMatch = titleRE.exec(first.content)
      if (titleMatch !== null) {
        title = titleMatch[1]
        ownTitle = true
        tokens.splice(i + 1, 3)
      }
    }

    // ownTitle tells the page's words from the alert's default label, for
    // whoever indexes the prose rather than rendering it
    tokens[i].meta = { alert: alert.type, title, ownTitle }

    // the matching close token, at the same nesting level
    for (let j = i + 1, depth = 1; j < tokens.length; j++) {
      if (tokens[j].type === 'blockquote_open') {
        depth++
      } else if (tokens[j].type === 'blockquote_close' && --depth === 0) {
        tokens[j].meta = tokens[i].meta
        break
      }
    }
  }
}

export default function mdPluginBlockquote(md) {
  md.core.ruler.after('block', 'alerts', markAlerts)

  md.renderer.rules.blockquote_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    if (token.meta === null) {
      token.attrSet('class', 'doc-note')
      return self.renderToken(tokens, idx, options)
    }

    const { alert, title } = token.meta
    return (
      `<div class="doc-note doc-note--${alert}">` +
      `<div class="doc-note__title">${md.renderInline(title, env)}</div>\n`
    )
  }

  md.renderer.rules.blockquote_close = (tokens, idx, options, _env, self) =>
    tokens[idx].meta === null
      ? self.renderToken(tokens, idx, options)
      : '</div>\n'

  const renderHtmlBlock = md.renderer.rules.html_block
  md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
    const html =
      renderHtmlBlock !== void 0
        ? renderHtmlBlock(tokens, idx, options, env, self)
        : tokens[idx].content

    return html.startsWith('<details>')
      ? html
          .replace('<details>', '<details class="doc-note doc-note--details">')
          .replace('<summary>', '<summary class="doc-note__title">')
      : html
  }
}
