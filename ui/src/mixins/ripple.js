import Ripple from '../directives/Ripple.js'

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
