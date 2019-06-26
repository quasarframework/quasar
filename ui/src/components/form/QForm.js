import Vue from 'vue'

import { stopAndPrevent } from '../../utils/event.js'
import slot from '../../utils/slot.js'
import { getAllChildren } from '../../utils/vm.js'

export default Vue.extend({
  name: 'QForm',

  props: {
    autofocus: Boolean,
    noErrorFocus: Boolean,
    noResetFocus: Boolean
  },

  mounted () {
    this.validateIndex = 0
    this.autofocus === true && this.focus()
  },

  methods: {
    validate (shouldFocus) {
      const promises = []
      const focus = typeof shouldFocus === 'boolean'
        ? shouldFocus
        : this.noErrorFocus !== true

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
            promises.push(
              valid.then(
                v => ({ valid: v, comp }),
                error => ({ valid: false, comp, error })
              )
            )
          }
          else if (valid !== true) {
            emit(false)

            if (focus === true && typeof comp.focus === 'function') {
              comp.focus()
            }

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
            const { valid, comp } = res[0]

            emit(valid)

            if (
              focus === true &&
              valid !== true &&
              typeof comp.focus === 'function'
            ) {
              comp.focus()
            }

            return valid
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
        val === true && this.$emit('submit', evt)
      })
    },

    reset (evt) {
      evt !== void 0 && stopAndPrevent(evt)

      this.$emit('reset')

      this.$nextTick(() => { // allow userland to reset values before
        this.resetValidation()
        if (this.autofocus === true && this.noResetFocus !== true) {
          this.focus()
        }
      })
    },

    focus () {
      const target = this.$el.querySelector('[autofocus]') || this.$el.querySelector('[tabindex]')
      target !== null && target.focus()
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
