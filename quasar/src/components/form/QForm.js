import Vue from 'vue'
import slot from 'quasar/src/utils/slot.js'

export default Vue.extend({
  name: 'QForm',

  methods: {
    validate () {
      let value = true
      for (let i = 0; i < this.$children.length; ++i) {
        const component = this.$children[i]
        if ('validate' in component && typeof component.validate === 'function') {
          if (!component.validate()) {
            value = false
          }
        }
      }
      return value
    },
    resetValidation () {
      for (let i = 0; i < this.$children.length; ++i) {
        const component = this.$children[i]
        if ('resetValidation' in component && typeof component.resetValidation === 'function') {
          component.resetValidation()
        }
      }
    },
    __onSubmit (event) {
      // Abort if the element emitting the event is not
      // the element the event is bound to
      if (event.target !== event.currentTarget) return
      // Stop event propagation
      event.stopPropagation()
      // Prevent the default handler for this element
      event.preventDefault()
      if (this.validate()) {
        this.$emit('submit')
      } else {
        this.$emit('error')
      }
    },
    __onReset (event) {
      // Abort if the element emitting the event is not
      // the element the event is bound to
      if (event.target !== event.currentTarget) return
      // Stop event propagation
      event.stopPropagation()
      // Prevent the default handler for this element
      event.preventDefault()
      if (this.resetValidation()) {
        this.$emit('reset')
      }
    }
  },

  render (h) {
    return h('form', {
      staticClass: 'q-form',
      on: {
        submit: this.__onSubmit,
        reset: this.__onReset
      }
    }, slot(this, "default"))
  }
})

