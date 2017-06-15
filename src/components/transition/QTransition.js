/*
 * Also import the necessary CSS into the app.
 *
 * Example:
 * import 'quasar-extras/animate/bounceInLeft.css'
 */

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

    if (prop.name) {
      data.props = {
        name: prop.name
      }
    }
    else if (prop.enter && prop.leave) {
      data.props = {
        enterActiveClass: `animated ${prop.enter}`,
        leaveActiveClass: `animated ${prop.leave}`
      }
    }
    else {
      return ctx.children
    }

    return h(`transition${ctx.props.group ? '-group' : ''}`, data, ctx.children)
  }
}
