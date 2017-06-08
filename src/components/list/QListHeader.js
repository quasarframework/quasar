export default {
  name: 'q-list-header',
  functional: true,
  props: {
    inset: Boolean
  },
  render (h, ctx) {
    const
      data = ctx.data,
      cls = data.staticClass,
      prop = ctx.props

    data.staticClass = `q-list-header ${prop.inset ? ' q-list-header-inset' : ''}${cls ? ` ${cls}` : ''}`

    return h('div', data, ctx.children)
  }
}
