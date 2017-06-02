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
      data = ctx.data,
      classes = data.staticClass,
      prop = ctx.props

    data.staticClass = `q-card-actions ` +
      `q-card-actions-${prop.vertical ? 'vert column justify-start' : 'horiz row'} ` +
      `${prop.vertical ? 'items' : 'justify'}-${prop.align}` +
      `${classes ? ` ${classes}` : ''}`

    return h('div', data, ctx.children)
  }
}
