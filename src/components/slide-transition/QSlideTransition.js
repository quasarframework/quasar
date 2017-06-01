import slideAnimation from './slide-animation'

export default {
  name: 'q-slide-transition',
  functional: true,
  props: {
    appear: Boolean
  },
  render (h, ctx) {
    var data = {
      props: {
        mode: 'out-in',
        css: false,
        appear: ctx.props.appear
      },
      on: slideAnimation
    }
    return h('transition', data, ctx.children)
  }
}
