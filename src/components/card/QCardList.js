export default {
  name: 'q-card-list',
  functional: true,
  render (h, ctx) {
    const cls = ctx.data.staticClass
    return h(
      'div', {
        staticClass: `q-card-list list no-border${cls ? ` ${cls}` : ''}`
      },
      ctx.children
    )
  }
}
