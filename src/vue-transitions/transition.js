import slide from './transition-slide'

let transitions = {slide}

export default {
  functional: true,
  props: {
    name: {
      type: String,
      default: 'slide',
      validator (value) {
        if (!['slide'].includes(value)) {
          console.error('Quasar Transition unknown: ' + value)
          return false
        }
        return true
      }
    }
  },
  render (h, context) {
    var data = {
      props: {
        name: 'quasar-transition',
        mode: 'out-in'
      },
      on: transitions[context.props.name]
    }
    return h('transition', data, context.children)
  }
}
