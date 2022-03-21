/**
 * Adds class 'doc-img' to images
 */

module.exports = function (md) {
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    token.attrSet('class', 'doc-img')
    return self.renderToken(tokens, idx, options)
  }
}
