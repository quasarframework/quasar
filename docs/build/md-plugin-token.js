/**
 * Adds class 'doc-token' to inline code
 */

module.exports = function (md) {
  const defaultRender = md.renderer.rules.code_inline

  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    token.attrSet('class', 'doc-token')
    return defaultRender(tokens, idx, options, env, self)
  }
}
