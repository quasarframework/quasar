export default {
  name: 'q-toolbar-title',
  functional: true,
  render (h, ctx) {
    const
      data = ctx.data,
      cls = data.staticClass,
      slots = ctx.slots(),
      children = [slots.default]

    if (slots.subtitle) {
      children.push(h('div', { staticClass: 'q-toolbar-subtitle' }, slots.subtitle))
    }
    data.staticClass = `q-toolbar-title${cls ? ` ${cls}` : ''}`

    return h('div', data, children)
  }
}
