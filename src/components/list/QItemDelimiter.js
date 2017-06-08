export default {
  name: 'q-item-delimiter',
  functional: true,
  props: {
    inset: Boolean
  },
  render (h, ctx) {
    const
      data = ctx.data,
      cls = data.staticClass

    data.staticClass = `q-item-delimiter-component${ctx.props.inset ? ' q-item-delimiter-inset-component' : ''}${cls ? ` ${cls}` : ''}`

    return h('div', data, ctx.children)
  }
}
