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
      cls = ctx.data.staticClass,
      slots = ctx.slots()
    let child = [slots.default]

    if (slots.overlay) {
      child.push(h(
        'div',
        {
          'class': `absolute-${ctx.props.overlayPosition}`,
          staticClass: 'q-card-media-overlay'
        },
        slots.overlay
      ))
    }

    return h(
      'div',
      { staticClass: `q-card-media relative-position${cls ? ` ${cls}` : ''}` },
      child
    )
  }
}
