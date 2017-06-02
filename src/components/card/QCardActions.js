export default {
  name: 'q-card-actions',
  functional: true,
  props: {
    vertical: Boolean,
    align: {
      type: String,
      default: 'start',
      validator: v => ['start', 'center', 'end', 'around'].includes(v)
    }
  },
  render (h, ctx) {
    const
      cls = ctx.data.staticClass,
      prop = ctx.props

    return h(
      'div', {
        'class': [
          `q-card-actions-${prop.vertical ? 'vert column justify-start' : 'horiz row'}`,
          `${prop.vertical ? 'items' : 'justify'}-${prop.align}`
        ],
        staticClass: `q-card-actions${cls ? ` ${cls}` : ''}`
      },
      ctx.children
    )
  }
}
