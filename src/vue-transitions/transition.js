import slide from './transition-slide'

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
    if (!transitions[context.props.name]) {
      throw new Error(`Quasar Transition ${context.props.name} is unnowkn.`)
    }
    var data = {
      props: {
        name: 'quasar-transition',
        mode: 'out-in',
        appear: context.props.appear
      },
      on: transitions[context.props.name]
    }
    return h('transition', data, context.children)
  }
}
