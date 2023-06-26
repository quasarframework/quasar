/**
 * Converts table to QMarkupTable
 */

export default function mdPluginTable (md) {
  md.renderer.rules.table_open = (tokens, idx, options, _env, self) => {
    const token = tokens[ idx ]

    token.tag = 'q-markup-table'
    token.attrSet('class', 'doc-page-table')
    token.attrSet(':wrap-cells', 'true')
    token.attrSet(':flat', 'true')
    token.attrSet(':bordered', 'true')

    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.table_close = (tokens, idx, options, _env, self) => {
    const token = tokens[ idx ]

    token.tag = 'q-markup-table'

    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.th_open = (tokens, idx, options, _env, self) => {
    const token = tokens[ idx ]

    token.attrSet('class', 'text-left')
    return self.renderToken(tokens, idx, options)
  }
}
