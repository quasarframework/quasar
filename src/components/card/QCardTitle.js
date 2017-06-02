export default {
  name: 'q-card-title',
  functional: true,
  render (h, ctx) {
    const
      data = ctx.data,
      cls = ctx.data.staticClass,
      slots = ctx.slots()

    data.staticClass = `q-card-primary q-card-container row no-wrap${cls ? ` ${cls}` : ''}`
    return h(
      'div',
      data,
      [
        h('div', {staticClass: 'col column'}, [
          h('div', {staticClass: 'q-card-title'}, slots.default),
          h('div', {staticClass: 'q-card-subtitle'}, slots.subtitle)
        ]),
        h('div', {staticClass: 'col-auto self-center q-card-title-extra'}, slots.right)
      ]
    )
  }
}
