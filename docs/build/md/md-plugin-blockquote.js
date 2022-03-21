/**
 * Adds class 'doc-note' to blockquotes
 */

module.exports = function (md) {
  md.renderer.rules.blockquote_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    token.attrSet('class', 'doc-note')
    return self.renderToken(tokens, idx, options)
  }
}
