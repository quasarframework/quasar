const scrollClasses = 'q-scroll-area relative-position overflow-hidden scroll'

export default {
  name: 'q-scroll-area',
  functional: true,
  props: {
    tag: {
      type: String,
      default: 'div'
    }
  },
  render (h, ctx) {
    const classes = ctx.data.staticClass
    ctx.data.staticClass = `${classes ? classes + ' ' : ''}${scrollClasses}`
    return h(ctx.props.tag, ctx.data, ctx.children)
  }
}
