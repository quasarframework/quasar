
export default {
  name: 'q-app',
  functional: true,
  render (h, ctx) {
    const
      data = ctx.data,
      classes = data.staticClass

    data.staticClass = `q-app${classes ? ` ${classes}` : ''}`
    return h('div', data, ctx.children)
  }
}
