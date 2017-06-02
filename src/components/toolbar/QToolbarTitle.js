export default {
  name: 'q-toolbar-title',
  functional: true,
  render (h, ctx) {
    const
      data = ctx.data,
      cls = data.staticClass

    data.staticClass = `q-toolbar-title${cls ? ` ${cls}` : ''}`
    return h(
      'div',
      ctx.data,
      ctx.children
    )
  }
}
