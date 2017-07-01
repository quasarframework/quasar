export default {
  name: 'q-card-main',
  functional: true,
  props: {
    color: String
  },
  render (h, ctx) {
    const
      data = ctx.data,
      classes = data.staticClass,
      prop = ctx.props

    let cls = ['q-card-main', 'q-card-container']
    if (prop.color) {
      cls.push(`bg-${prop.color} text-white q-card-dark`)
    }

    data.staticClass = `${cls.join(' ')}${classes ? ` ${classes}` : ''}`

    return h('div', data, ctx.children)
  }
}
