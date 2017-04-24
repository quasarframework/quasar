import slideAnimation from './slide-animation'

export default {
  name: 'q-slide-transition',
  functional: true,
  props: {
    appear: Boolean
  },
  render (h, context) {
    var data = {
      props: {
        mode: 'out-in',
        css: false,
        appear: context.props.appear
      },
      on: slideAnimation
    }
    return h('transition', data, context.children)
  }
}
