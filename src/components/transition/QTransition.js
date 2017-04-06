/*
 * Also import the necessary CSS into the app.
 *
 * Example:
 * import 'animate.css/source/_base.css'
 * import 'animate.css/source/bouncing_entrances/bounceInLeft.css'
 * import 'animate.css/source/bouncing_exits/bounceOutRight.css'
 */

export default {
  name: 'q-transition',
  functional: true,
  props: {
    enter: String,
    leave: String,
    group: Boolean
  },
  render (h, ctx) {
    const
      prop = ctx.props,
      data = ctx.data

    data.props = {
      enterActiveClass: `animated ${prop.enter}`,
      leaveActiveClass: `animated ${prop.leave}`
    }
    return h(`transition${ctx.props.group ? '-group' : ''}`, data, ctx.children)
  }
}
