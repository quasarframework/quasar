import slide from './slide-toggle'

let transitions = {slide}

export default {
  functional: true,
  props: {
    name: {
      type: String,
      default: 'slide',
      validator (value) {
        if (!transitions[value]) {
          console.error('Quasar Transition unknown: ' + value)
          return false
        }
        return true
      }
    },
    appear: Boolean
  },
  render (h, context) {
    const config = transitions[context.props.name]
    if (!config) {
      throw new Error(`Quasar Transition ${context.props.name} is unknown.`)
    }
    var data = {
      props: {
        name: 'q-transition',
        mode: 'out-in',
        css: false,
        appear: context.props.appear
      },
      on: config
    }
    return h('transition', data, context.children)
  }
}
