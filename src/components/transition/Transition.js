export default {
  name: 'q-transition',
  functional: true,
  props: {
    name: String,
    enter: String,
    leave: String,
    group: Boolean
  },
  render (h, ctx) {
    const
      prop = ctx.props,
      data = ctx.data

    data.name = prop.name || 'q-transition'
    data.props = {
      enterActiveClass: `animated ${prop.enter}`,
      leaveActiveClass: `animated ${prop.leave}`
    }
    return h(`transition${ctx.props.group ? '-group' : ''}`, data, ctx.children)
  }
}
