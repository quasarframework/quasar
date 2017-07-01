export default {
  name: 'q-card-title',
  functional: true,
  props: {
    color: String
  },
  render (h, ctx) {
    const
      data = ctx.data,
      classes = ctx.data.staticClass,
      prop = ctx.props,
      slots = ctx.slots()

    let cls = ['q-card-primary', 'q-card-container', 'row', 'no-wrap']
    if (prop.color) {
      cls.push(`bg-${prop.color} text-white q-card-dark`)
    }

    data.staticClass = `${cls.join(' ')}${classes ? ` ${classes}` : ''}`
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
