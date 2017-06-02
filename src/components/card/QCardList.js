export default {
  name: 'q-card-list',
  functional: true,
  render (h, ctx) {
    const
      data = ctx.data,
      cls = data.staticClass

    data.staticClass = `q-card-list list no-border${cls ? ` ${cls}` : ''}`

    return h('div', data, ctx.children)
  }
}
