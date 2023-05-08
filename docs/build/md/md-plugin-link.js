/**
 * Converts links to DocLink
 */

module.exports = function (md) {
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[ idx ]

    const hrefIndex = token.attrIndex('href')

    if (hrefIndex >= 0) {
      const link = token.attrs[ hrefIndex ]

      link[ 0 ] = 'to'
      link[ 1 ] = decodeURI(link[ 1 ])

      token.tag = 'doc-link'
      md.$data.components.add('src/components/DocLink')
    }

    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.link_close = (tokens, idx, options, env, self) => {
    const token = tokens[ idx ]

    token.tag = 'doc-link'
    return self.renderToken(tokens, idx, options)
  }
}
