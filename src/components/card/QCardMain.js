export default {
  name: 'q-card-main',
  functional: true,
  render (h, ctx) {
    const
      data = ctx.data,
      cls = data.staticClass

    data.staticClass = `q-card-main q-card-container${cls ? ` ${cls}` : ''}`

    return h('div', data, ctx.children)
  }
}
