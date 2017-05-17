export default {
  name: 'q-label',
  functional: true,
  render (h, ctx) {
    const
      data = ctx.data,
      classes = data.staticClass

    data.staticClass = `${classes ? classes + ' ' : ''}q-label row inline items-center no-wrap`
    return h('label', data, ctx.children)
  }
}
