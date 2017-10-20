export default {
  name: 'q-td',
  functional: true,
  props: {
    props: Object,
    autoWidth: Boolean
  },
  render (h, ctx) {
    const
      data = ctx.data,
      prop = ctx.props.props,
      name = ctx.data.key,
      autoWidth = ctx.props.autoWidth

    let
      col,
      cls = data.staticClass

    if (autoWidth) {
      cls = `q-table-col-auto-width${cls ? ` ${cls}` : ''}`
    }

    if (!prop) {
      data.staticClass = cls
      return h('td', data, ctx.children)
    }

    if (name) {
      col = prop.colsMap[name]
      if (!col) { return }
    }
    else {
      col = prop.col
    }

    data.staticClass = `${col.__tdClass}${cls ? ` ${cls}` : ''}`

    return h('td', data, ctx.children)
  }
}
