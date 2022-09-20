import { h, ref, onActivated, onDeactivated, onMounted, getCurrentInstance, nextTick, provide } from 'vue'

import { createComponent } from '../../utils/private/create.js'
import { stopAndPrevent } from '../../utils/event.js'
import { addFocusFn } from '../../utils/private/focus-manager.js'
import { hSlot } from '../../utils/private/render.js'
import { formKey } from '../../utils/private/symbols.js'
import { vmIsDestroyed } from '../../utils/private/vm.js'

export default createComponent({
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
      const focus = typeof shouldFocus === 'boolean'
        ? shouldFocus
        : props.noErrorFocus !== true

      const index = ++validateIndex

      const emitEvent = (res, ref) => {
        emit('validation-' + (res === true ? 'success' : 'error'), ref)
      }

      const validateComponent = comp => {
        if (
          // is it still registered?
          registeredComponents.includes(comp) === false
          // is it still mounted and active?
          || vmIsDestroyed(comp.$) === true
        ) {
          return Promise.resolve({ valid: true })
        }

        const valid = comp.validate()

        return typeof valid.then === 'function'
          ? valid.then(
            valid => ({ valid, comp }),
            err => ({ valid: false, comp, err })
          )
          : Promise.resolve({ valid, comp })
      }

      const errorsPromise = props.greedy === true
        ? Promise
          .all(registeredComponents.map(validateComponent))
          .then(res => res.filter(r => r.valid !== true))
        : registeredComponents
          .reduce(
            (acc, comp) => acc.then(() => {
              return validateComponent(comp).then(r => {
                if (r.valid === false) { return Promise.reject(r) }
              })
            }),
            Promise.resolve()
          )
          .catch(error => [ error ])

      return errorsPromise.then(errors => {
        if (errors === void 0 || errors.length === 0) {
          index === validateIndex && emitEvent(true)
          return true
        }

        // if not outdated already
        if (index === validateIndex) {
          // do we still have errors with active components?
          // they might have been destroyed while we validated
          const activeErrors = errors.find(
            entry => vmIsDestroyed(entry.comp.$) === false
            && registeredComponents.includes(entry.comp) === true
          )

          if (activeErrors !== void 0) {
            const { comp, err } = activeErrors

            err !== void 0 && console.error(err)
            emitEvent(false, comp)

            if (focus === true && typeof comp.focus === 'function') {
              comp.focus()
            }
          }
          else {
            emitEvent(true)
            return true
          }
        }

        return false
      })
    }

    function resetValidation () {
      validateIndex++

      registeredComponents.forEach(comp => {
        typeof comp.resetValidation === 'function' && comp.resetValidation()
      })
    }

    function submit (evt) {
      evt !== void 0 && stopAndPrevent(evt)

      const index = validateIndex + 1

      validate().then(val => {
        // if not outdated && validation succeeded
        if (index === validateIndex && val === true) {
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

        target !== null && target !== void 0 && target.focus({ preventScroll: true })
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

    let shouldActivate = false

    onDeactivated(() => {
      shouldActivate = true
    })

    onActivated(() => {
      shouldActivate === true && props.autofocus === true && focus()
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
