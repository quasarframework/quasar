export default {
  name: 'q-card',
  functional: true,
  props: {
    square: Boolean,
    flat: Boolean,
    inline: Boolean,
    color: String
  },
  render (h, ctx) {
    const
      cls = ctx.data.staticClass,
      prop = ctx.props

    const classes = [{
      'no-border-radius': prop.square,
      'no-shadow': prop.flat,
      inline: prop.inline
    }]
    if (prop.color) {
      classes.push(`bg-${prop.color} text-white q-card-dark`)
    }

    return h(
      'div',
      {
        'class': classes,
        staticClass: `q-card column${cls ? ` ${cls}` : ''}`
      },
      ctx.children
    )
  }
}
