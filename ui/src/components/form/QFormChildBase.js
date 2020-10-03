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
    this.__qForm !== void 0 && this.__qForm.bindComponent(this)
  },

  beforeUnmount () {
    this.__qForm !== void 0 && this.__qForm.unbindComponent(this)
  }
}
