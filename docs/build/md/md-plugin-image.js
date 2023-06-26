/**
 * Adds class 'doc-img' to images
 */

export default function mdPluginImage (md) {
  md.renderer.rules.image = (tokens, idx, options, _env, self) => {
    const token = tokens[ idx ]

    token.attrSet('class', 'doc-img')
    return self.renderToken(tokens, idx, options)
  }
}
