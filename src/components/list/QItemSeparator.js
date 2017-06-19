export default {
  name: 'q-item-separator',
  functional: true,
  props: {
    inset: Boolean
  },
  render (h, ctx) {
    const
      data = ctx.data,
      cls = data.staticClass

    data.staticClass = `q-item-separator-component${ctx.props.inset ? ' q-item-separator-inset-component' : ''}${cls ? ` ${cls}` : ''}`

    return h('div', data, ctx.children)
  }
}
