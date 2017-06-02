export default {
  name: 'q-card-separator',
  functional: true,
  props: {
    inset: Boolean
  },
  render (h, ctx) {
    const cls = ctx.data.staticClass
    return h('div', {
      class: {inset: ctx.props.inset},
      staticClass: `q-card-separator${cls ? ` ${cls}` : ''}`
    })
  }
}
