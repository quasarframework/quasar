import Vue from 'vue'

import { stopAndPrevent } from '../../utils/event.js'
import slot from '../../utils/slot.js'
import { getAllChildren } from '../../utils/vm.js'

export default Vue.extend({
  name: 'QForm',

  mounted () {
    this.validateIndex = 0
  },

  methods: {
    validate () {
      const promises = []

      this.validateIndex++

      const components = getAllChildren(this)
      const emit = res => {
        this.$emit('validation-' + (res === true ? 'success' : 'error'))
      }

      for (let i = 0; i < components.length; i++) {
        const comp = components[i]

        if (typeof comp.validate === 'function') {
          const valid = comp.validate()

          if (typeof valid.then === 'function') {
            promises.push(valid)
          }
          else if (valid !== true) {
            emit(false)
            return Promise.resolve(false)
          }
        }
      }

      if (promises.length === 0) {
        emit(true)
        return Promise.resolve(true)
      }

      const index = this.validateIndex

      return Promise.all(promises).then(
        res => {
          if (index === this.validateIndex) {
            emit(res[0])
            return res[0]
          }
        },
        () => {
          if (index === this.validateIndex) {
            emit(false)
            return false
          }
        }
      )
    },

    resetValidation () {
      this.validateIndex++

      getAllChildren(this).forEach(comp => {
        if (typeof comp.resetValidation === 'function') {
          comp.resetValidation()
        }
      })
    },

    submit (evt) {
      evt !== void 0 && stopAndPrevent(evt)

      this.validate().then(val => {
        val === true && this.$emit('submit')
      })
    },

    reset (evt) {
      evt !== void 0 && stopAndPrevent(evt)

      this.resetValidation()
      this.$emit('reset')
    }
  },

  render (h) {
    return h('form', {
      staticClass: 'q-form',
      on: {
        ...this.$listeners,
        submit: this.submit,
        reset: this.reset
      }
    }, slot(this, 'default'))
  }
})
