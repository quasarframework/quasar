export default {
  name: 'q-btn-group',
  functional: true,
  props: {
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    push: Boolean
  },
  render (h, ctx) {
    const
      data = ctx.data,
      prop = ctx.props,
      cls = data.staticClass,
      moreCls = ['outline', 'flat', 'rounded', 'push'].filter(t => prop[t]).map(t => `q-btn-group-${t}`).join(' ')

    data.staticClass = `q-btn-group row no-wrap inline${cls ? ` ${cls}` : ''}${moreCls ? ` ${moreCls}` : ''}`

    return h('div', data, ctx.children)
  }
}
