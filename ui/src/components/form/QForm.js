import Vue from 'vue'

import { stopAndPrevent } from '../../utils/event.js'
import { slot } from '../../utils/slot.js'
import { getAllChildren } from '../../utils/vm.js'

export default Vue.extend({
  name: 'QForm',

  props: {
    autofocus: Boolean,
    noErrorFocus: Boolean,
    noResetFocus: Boolean,
    greedy: Boolean
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
                valid => ({ valid, comp }),
                error => ({ valid: false, comp, error })
              )
            )
          }
          else if (valid !== true) {
            if (this.greedy === false) {
              emit(false)

              if (focus === true && typeof comp.focus === 'function') {
                comp.focus()
              }

              return Promise.resolve(false)
            }

            promises.push({ valid: false, comp })
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
            const errors = res.filter(r => r.valid !== true)

            if (errors.length === 0) {
              emit(true)
              return true
            }

            emit(false)
            const { valid, comp } = errors[0]

            if (
              focus === true &&
              valid !== true &&
              typeof comp.focus === 'function'
            ) {
              comp.focus()
            }

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
        if (val === true) {
          if (this.$listeners.submit !== void 0) {
            this.$emit('submit', evt)
          }
          else if (evt !== void 0 && evt.target !== void 0 && typeof evt.target.submit === 'function') {
            evt.target.submit()
          }
        }
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
      const target = this.$el.querySelector('[autofocus], [data-autofocus]') ||
        [].find.call(this.$el.querySelectorAll('[tabindex]'), el => el.tabIndex > -1)

      target !== null && target !== void 0 && target.focus()
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
