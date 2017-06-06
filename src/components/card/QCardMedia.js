export default {
  name: 'q-card-media',
  functional: true,
  props: {
    overlayPosition: {
      type: String,
      default: 'bottom',
      validator: v => ['top', 'bottom', 'full'].includes(v)
    }
  },
  render (h, ctx) {
    const
      data = ctx.data,
      cls = data.staticClass,
      slots = ctx.slots()
    let child = [slots.default]

    data.staticClass = `q-card-media relative-position${cls ? ` ${cls}` : ''}`

    if (slots.overlay) {
      child.push(h(
        'div',
        {
          staticClass: `q-card-media-overlay absolute-${ctx.props.overlayPosition}`
        },
        slots.overlay
      ))
    }

    return h('div', data, child)
  }
}
