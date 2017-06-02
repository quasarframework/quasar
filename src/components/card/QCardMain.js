export default {
  name: 'q-card-main',
  functional: true,
  render (h, ctx) {
    const cls = ctx.data.staticClass
    return h(
      'div', {
        staticClass: `q-card-main q-card-container${cls ? ` ${cls}` : ''}`
      },
      ctx.children
    )
  }
}
