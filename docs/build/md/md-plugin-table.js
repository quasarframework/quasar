/**
 * Converts table to QMarkupTable
 */

module.exports = function (md) {
  md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    token.tag = 'q-markup-table'
    token.attrSet(':wrap-cells', 'true')
    token.attrSet(':flat', 'true')
    token.attrSet(':bordered', 'true')
    token.attrSet('style', 'width: fit-content; max-width: 100%;')

    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.table_close = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    token.tag = 'q-markup-table'

    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.th_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    token.attrSet('class', 'text-left')
    return self.renderToken(tokens, idx, options)
  }
}
