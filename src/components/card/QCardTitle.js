export default {
  name: 'q-card-title',
  functional: true,
  render (h, ctx) {
    const
      cls = ctx.data.staticClass,
      slots = ctx.slots()

    return h(
      'div',
      { staticClass: `q-card-primary q-card-container row no-wrap${cls ? ` ${cls}` : ''}` },
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
