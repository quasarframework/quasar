import { noop } from '../../utils/event.js'

export default {
  inject: {
    __qForm: {
      default: noop
    }
  },

  methods: {
    validate () {}
  },

  created () {
    this.__qForm !== void 0 && this.__qForm.__bindComponent(this)
  },

  beforeUnmount () {
    this.__qForm !== void 0 && this.__qForm.__unbindComponent(this)
  }
}
