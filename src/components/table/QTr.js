export default {
  name: 'q-tr',
  functional: true,
  props: {
    props: Object
  },
  render (h, ctx) {
    const
      data = ctx.data,
      cls = data.staticClass,
      prop = ctx.props.props

    if (!prop || prop.header) {
      return h('tr', ctx.data, ctx.children)
    }

    data.staticClass = `${prop.__trClass}${cls ? ` ${cls}` : ''}`

    return h('tr', data, ctx.children)
  }
}
