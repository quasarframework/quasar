import Vue from 'vue'
import slot from '../../utils/slot.js'
import { stopAndPrevent } from '../../utils/event.js'

export default Vue.extend({
  name: 'QForm',

  methods: {
    validate () {
      const len = this.$children.length
      for (let i = 0; i < len; ++i) {
        const validate = this.$children[i].validate
        if (typeof validate === 'function' && validate() !== true) {
          return false
        }
      }
      return true
    },

    resetValidation () {
      const len = this.$children.length
      for (let i = 0; i < len; ++i) {
        const resetValidation = this.$children[i].resetValidation
        if (typeof resetValidation === 'function') {
          resetValidation()
        }
      }
    },

    __onSubmit (event) {
      // Abort if the element emitting the event is not the element the event is bound to
      if (event === void 0 || event.target !== event.currentTarget) return

      stopAndPrevent(event)

      this.$emit(this.validate() === true ? 'submit' : 'error')
    },

    __onReset (event) {
      // Abort if the element emitting the event is not the element the event is bound to
      if (event === void 0 || event.target !== event.currentTarget) return

      stopAndPrevent(event)

      this.resetValidation()

      this.$emit('reset')
    }
  },

  render (h) {
    return h('form', {
      staticClass: 'q-form',
      on: {
        submit: this.__onSubmit,
        reset: this.__onReset
      }
    }, slot(this, 'default'))
  }
})
