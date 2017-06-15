export default {
  name: 'q-toolbar',
  functional: true,
  props: {
    color: String,
    inverted: Boolean,
    glossy: Boolean
  },
  render (h, ctx) {
    const
      cls = ctx.data.staticClass,
      prop = ctx.props

    let classes = `q-toolbar-${prop.inverted ? 'inverted' : 'normal'}`
    if (prop.color) {
      classes += ` ${prop.inverted ? 'text' : 'bg'}-${prop.color}`
    }
    if (prop.glossy) {
      classes += ` glossy`
    }

    ctx.data.staticClass = `q-toolbar row no-wrap items-center relative-position ${classes}${cls ? ` ${cls}` : ''}`

    return h(
      'div',
      ctx.data,
      ctx.children
    )
  }
}
