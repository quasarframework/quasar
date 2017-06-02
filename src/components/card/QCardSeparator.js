export default {
  name: 'q-card-separator',
  functional: true,
  props: {
    inset: Boolean
  },
  render (h, ctx) {
    const
      data = ctx.data,
      cls = data.staticClass

    data.staticClass = `q-card-separator${ctx.props.inset ? ' inset' : ''}${cls ? ` ${cls}` : ''}`

    return h('div', data, ctx.children)
  }
}
