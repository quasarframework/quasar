/**
 * Adds class 'doc-note' to blockquotes
 */

export default function mdPluginBlockquote (md) {
  md.renderer.rules.blockquote_open = (tokens, idx, options, _env, self) => {
    const token = tokens[ idx ]

    token.attrSet('class', 'doc-note')
    return self.renderToken(tokens, idx, options)
  }
}
