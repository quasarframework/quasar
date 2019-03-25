import Vue from 'vue'

import { stopAndPrevent } from '../../utils/event.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QForm',

  mounted () {
    this.validateIndex = 0
  },

  methods: {
    validate () {
      const promises = []

      this.validateIndex++

      for (let i = 0; i < this.$children.length; ++i) {
        const comp = this.$children[i]

        if (typeof comp.validate === 'function') {
          const valid = comp.validate()

          if (typeof valid.then === 'function') {
            promises.push(valid)
          }
          else if (valid !== true) {
            return false
          }
        }
      }

      if (promises.length === 0) {
        return true
      }

      const index = this.validateIndex

      return Promise.all(promises).then(
        res => {
          if (index === this.validateIndex) {
            return res
          }
        },
        () => {
          if (index === this.validateIndex) {
            return false
          }
        }
      )
    },

    resetValidation () {
      this.validateIndex++

      for (let i = 0; i < this.$children.length; ++i) {
        const comp = this.$children[i]
        if (typeof comp.resetValidation === 'function') {
          comp.$emit('input', null)
          this.$nextTick(() => {
            comp.resetValidation()
          })
        }
      }
    },

    submit (evt) {
      evt !== void 0 && stopAndPrevent(evt)

      const validate = this.validate()

      const update = val => {
        if (val === true) {
          this.$emit('submit')
        }
        else if (val === false) {
          this.$emit('validation-error')
        }
      }

      if (typeof validate.then !== 'function') {
        update(validate)
      }
      else {
        validate.then(val => {
          update(val[0])
        })
      }
    },

    reset () {
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
