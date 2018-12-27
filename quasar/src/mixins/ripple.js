import Ripple from '../directives/ripple.js'

export default {
  directives: {
    Ripple
  },

  props: {
    ripple: {
      type: [Boolean, Object],
      default: true
    }
  }
}
