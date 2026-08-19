/**
 * Adds class 'doc-img' to images
 */

export default function mdPluginImage(md) {
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    // renderToken emits the token's `alt` attr as-is, which is an empty
    // placeholder: the alt text lives in token.children, and only the
    // default rule's renderInlineAsText call folds it into the attr
    token.attrSet('alt', self.renderInlineAsText(token.children, options, env))
    token.attrSet('class', 'doc-img')
    return self.renderToken(tokens, idx, options)
  }
}
