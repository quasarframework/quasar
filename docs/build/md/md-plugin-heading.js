/**
 * Manages headings
 */

import { slugify } from '../utils.js'

const titleRE = /<\/?[^>]+(>|$)/g
const apiRE = /^<DocApi /
const apiNameRE = /file="([^"]+)"/
const docInstallRE = /^<DocInstall(?:\s+title="([^"]*)")?\s*/

function parseContent(str) {
  const title = String(str).replace(titleRE, '').trim()

  return {
    id: slugify(str),
    title
  }
}

function parseInline(token) {
  return parseContent(token.children.reduce((acc, t) => acc + t.content, ''))
}

function escapeAttr(str) {
  return str.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
}

export default function mdPluginHeading(md) {
  md.renderer.rules.heading_open = (tokens, idx, options, _env, self) => {
    const token = tokens[idx]

    const { id, title } = parseInline(tokens[idx + 1])

    token.attrSet('id', id)
    token.attrSet('class', `doc-heading doc-${token.tag}`)
    token.attrSet('@click', `copyHeading(\`${id}\`)`)

    // Where this heading was written, for whoever has to find it again: the
    // rendered HTML keeps the id but loses both the line and the words the
    // id was slugified from, and the token is the last place to hold them.
    // `map` counts from 0 and from the end of the front matter, which
    // mdParse measures into lineOffset.
    if (token.map !== null) {
      ;(md.$frontMatter.headingSources ??= []).push({
        id,
        text: title,
        line: token.map[0] + 1 + (md.$frontMatter.lineOffset ?? 0)
      })
    }

    if (token.tag === 'h2') {
      md.$frontMatter.toc.push({ id, title })
    } else if (token.tag === 'h3') {
      md.$frontMatter.toc.push({ id, title, sub: true })
    }

    return self.renderToken(tokens, idx, options)
  }

  // The heading stays clickable for the mouse, but a handler is not a keyboard
  // path: this trailing link is the one every other input can reach. It only
  // needs to carry the id, so it sits beside the heading content rather than
  // wrapping it - a heading may hold a QBadge, which does not belong in a link.
  // Its "#" is drawn by CSS so that it stays out of the heading's own name.
  md.renderer.rules.heading_close = (tokens, idx, options, _env, self) => {
    const { id, title } = parseInline(tokens[idx - 1])

    return (
      `<a class="doc-heading__anchor" href="#${id}"` +
      ` aria-label="Copy anchor to ${escapeAttr(title)}"` +
      ` @click.prevent.stop="copyHeading(\`${id}\`)"></a>` +
      self.renderToken(tokens, idx, options)
    )
  }

  md.renderer.rules.html_block = function html_block(
    tokens,
    idx /*, options, env */
  ) {
    const token = tokens[idx]

    if (apiRE.test(token.content)) {
      const match = apiNameRE.exec(token.content)
      if (match !== null) {
        const title = `${match[1]} API`
        md.$frontMatter.toc.push({ id: slugify(title), title, deep: true })
      }
    }

    const match = token.content.match(docInstallRE)
    if (match !== null) {
      const title = match[1] ?? 'Installation'
      md.$frontMatter.toc.push({ id: slugify(title), title, deep: true })
    }

    return tokens[idx].content
  }
}
