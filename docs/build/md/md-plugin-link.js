/**
 * Converts links to DocLink
 */

export default function mdPluginLink (md) {
  md.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
    const token = tokens[ idx ]

    const hrefIndex = token.attrIndex('href')

    if (hrefIndex >= 0) {
      const link = token.attrs[ hrefIndex ]

      link[ 0 ] = 'to'
      link[ 1 ] = decodeURI(link[ 1 ])

      token.tag = 'doc-link'
      md.$frontMatter.pageScripts.add('import DocLink from \'src/components/DocLink.vue\'')
    }

    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.link_close = (tokens, idx, options, _env, self) => {
    const token = tokens[ idx ]

    token.tag = 'doc-link'
    return self.renderToken(tokens, idx, options)
  }
}
