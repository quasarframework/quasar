import { h, defineComponent, ref, onMounted, getCurrentInstance, nextTick, provide } from 'vue'

import { stopAndPrevent } from '../../utils/event.js'
import { addFocusFn } from '../../utils/private/focus-manager.js'
import { hSlot } from '../../utils/private/render.js'
import { formKey } from '../../utils/private/symbols.js'

export default defineComponent({
  name: 'QForm',

  props: {
    autofocus: Boolean,
    noErrorFocus: Boolean,
    noResetFocus: Boolean,
    greedy: Boolean,

    onSubmit: Function
  },

  emits: [ 'reset', 'validation-success', 'validation-error' ],

  setup (props, { slots, emit }) {
    const vm = getCurrentInstance()
    const rootRef = ref(null)

    let validateIndex = 0
    const registeredComponents = []

    function validate (shouldFocus) {
      const promises = []
      const focus = typeof shouldFocus === 'boolean'
        ? shouldFocus
        : props.noErrorFocus !== true

      validateIndex++

      const emitEvent = (res, ref) => {
        emit('validation-' + (res === true ? 'success' : 'error'), ref)
      }

      for (let i = 0; i < registeredComponents.length; i++) {
        const comp = registeredComponents[ i ]
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
          if (props.greedy === false) {
            emitEvent(false, comp)

            if (focus === true && typeof comp.focus === 'function') {
              comp.focus()
            }

            return Promise.resolve(false)
          }

          promises.push({ valid: false, comp })
        }
      }

      if (promises.length === 0) {
        emitEvent(true)
        return Promise.resolve(true)
      }

      const index = validateIndex

      return Promise.all(promises).then(
        res => {
          if (index === validateIndex) {
            const errors = res.filter(r => r.valid !== true)

            if (errors.length === 0) {
              emitEvent(true)
              return true
            }

            const { valid, comp } = errors[ 0 ]

            emitEvent(false, comp)

            if (
              focus === true
              && valid !== true
              && typeof comp.focus === 'function'
            ) {
              comp.focus()
            }

            return false
          }
        }
      )
    }

    function resetValidation () {
      validateIndex++

      registeredComponents.forEach(comp => {
        typeof comp.resetValidation === 'function' && comp.resetValidation()
      })
    }

    function submit (evt) {
      evt !== void 0 && stopAndPrevent(evt)

      validate().then(val => {
        if (val === true) {
          if (props.onSubmit !== void 0) {
            emit('submit', evt)
          }
          else if (evt !== void 0 && evt.target !== void 0 && typeof evt.target.submit === 'function') {
            evt.target.submit()
          }
        }
      })
    }

    function reset (evt) {
      evt !== void 0 && stopAndPrevent(evt)

      emit('reset')

      nextTick(() => { // allow userland to reset values before
        resetValidation()
        if (props.autofocus === true && props.noResetFocus !== true) {
          focus()
        }
      })
    }

    function focus () {
      addFocusFn(() => {
        if (rootRef.value === null) { return }

        const target = rootRef.value.querySelector('[autofocus], [data-autofocus]')
          || Array.prototype.find.call(rootRef.value.querySelectorAll('[tabindex]'), el => el.tabIndex > -1)

        target !== null && target !== void 0 && target.focus()
      })
    }

    provide(formKey, {
      bindComponent (vmProxy) {
        registeredComponents.push(vmProxy)
      },

      unbindComponent (vmProxy) {
        const index = registeredComponents.indexOf(vmProxy)
        if (index > -1) {
          registeredComponents.splice(index, 1)
        }
      }
    })

    onMounted(() => {
      props.autofocus === true && focus()
    })

    // expose public methods
    Object.assign(vm.proxy, {
      validate,
      resetValidation,
      submit,
      reset,
      focus,
      getValidationComponents: () => registeredComponents
    })

    return () => h('form', {
      class: 'q-form',
      ref: rootRef,
      onSubmit: submit,
      onReset: reset
    }, hSlot(slots.default))
  }
})
