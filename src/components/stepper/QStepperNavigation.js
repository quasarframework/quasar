export default {
  name: 'q-stepper-navigation',
  functional: true,
  render (h, ctx) {
    const
      data = ctx.data,
      cls = data.staticClass,
      slots = ctx.slots()
    let child = [h('div', {staticClass: 'col'}), slots.default]

    data.staticClass = `q-stepper-nav row no-wrap items-center${cls ? ` ${cls}` : ''}`

    if (slots.left) {
      child.unshift(slots.left)
    }

    return h('div', data, child)
  }
}
