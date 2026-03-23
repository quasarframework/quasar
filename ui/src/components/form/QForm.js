import {
  h,
  ref,
  onActivated,
  onDeactivated,
  onMounted,
  getCurrentInstance,
  nextTick,
  provide
} from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import { addFocusFn } from '../../utils/private.focus/focus-manager.js'
import { hSlot } from '../../utils/private.render/render.js'
import { formKey } from '../../utils/private.symbols/symbols.js'
import { vmIsDestroyed } from '../../utils/private.vm/vm.js'

export default createComponent({
  name: 'QForm',

  props: {
    autofocus: Boolean,
    noErrorFocus: Boolean,
    noResetFocus: Boolean,
    greedy: Boolean,

    onSubmit: Function
  },

  emits: ['reset', 'validationSuccess', 'validationError'],

  setup(props, { slots, emit }) {
    const vm = getCurrentInstance()
    const rootRef = ref(null)

    let validateIndex = 0
    const registeredComponents = []

    function validate(shouldFocus) {
      const localFocus =
        typeof shouldFocus === 'boolean'
          ? shouldFocus
          : props.noErrorFocus !== true

      const index = ++validateIndex

      const emitEvent = (res, compRef) => {
        emit(`validation${res === true ? 'Success' : 'Error'}`, compRef)
      }

      const validateComponent = comp => {
        const valid = comp.validate()

        return typeof valid.then === 'function'
          ? valid.then(
              isValid => ({ valid: isValid, comp }),
              err => ({ valid: false, comp, err })
            )
          : Promise.resolve({ valid, comp })
      }

      const errorsPromise =
        props.greedy === true
          ? Promise.all(registeredComponents.map(validateComponent)).then(res =>
              res.filter(r => r.valid !== true)
            )
          : registeredComponents
              .reduce(
                (acc, comp) =>
                  acc.then(() =>
                    validateComponent(comp).then(r => {
                      if (r.valid === false) {
                        return Promise.reject(r)
                      }
                    })
                  ),
                Promise.resolve()
              )
              .catch(error => [error])

      return errorsPromise.then(errors => {
        if (errors === void 0 || errors.length === 0) {
          if (index === validateIndex) emitEvent(true)
          return true
        }

        // if not outdated already
        if (index === validateIndex) {
          const { comp, err } = errors[0]

          if (err !== void 0) console.error(err)
          emitEvent(false, comp)

          if (localFocus === true) {
            // Try to focus first mounted and active component
            const activeError = errors.find(
              ({ comp: compRef }) =>
                typeof compRef.focus === 'function' &&
                vmIsDestroyed(compRef.$) === false
            )

            if (activeError !== void 0) {
              activeError.comp.focus()
            }
          }
        }

        return false
      })
    }

    function resetValidation() {
      validateIndex++

      registeredComponents.forEach(comp => {
        if (typeof comp.resetValidation === 'function') {
          comp.resetValidation()
        }
      })
    }

    function submit(evt) {
      if (evt !== void 0) stopAndPrevent(evt)

      const index = validateIndex + 1

      validate().then(val => {
        // if not outdated && validation succeeded
        if (index === validateIndex && val === true) {
          if (props.onSubmit !== void 0) {
            emit('submit', evt)
          } else if (
            evt?.target !== void 0 &&
            typeof evt.target.submit === 'function'
          ) {
            evt.target.submit()
          }
        }
      })
    }

    function reset(evt) {
      if (evt !== void 0) stopAndPrevent(evt)

      emit('reset')

      nextTick(() => {
        // allow userland to reset values before
        resetValidation()
        if (props.autofocus === true && props.noResetFocus !== true) {
          focus()
        }
      })
    }

    function focus() {
      addFocusFn(() => {
        if (rootRef.value === null) return

        const target =
          rootRef.value.querySelector(
            '[autofocus][tabindex], [data-autofocus][tabindex]'
          ) ||
          rootRef.value.querySelector(
            '[autofocus] [tabindex], [data-autofocus] [tabindex]'
          ) ||
          rootRef.value.querySelector('[autofocus], [data-autofocus]') ||
          Array.prototype.find.call(
            rootRef.value.querySelectorAll('[tabindex]'),
            el => el.tabIndex !== -1
          )

        target?.focus({ preventScroll: true })
      })
    }

    provide(formKey, {
      bindComponent(vmProxy) {
        registeredComponents.push(vmProxy)
      },

      unbindComponent(vmProxy) {
        const index = registeredComponents.indexOf(vmProxy)
        if (index !== -1) {
          registeredComponents.splice(index, 1)
        }
      }
    })

    let shouldActivate = false

    onDeactivated(() => {
      shouldActivate = true
    })

    onActivated(() => {
      if (shouldActivate === true && props.autofocus === true) {
        focus()
      }
    })

    onMounted(() => {
      if (props.autofocus === true) focus()
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

    return () =>
      h(
        'form',
        {
          class: 'q-form',
          ref: rootRef,
          onSubmit: submit,
          onReset: reset
        },
        hSlot(slots.default)
      )
  }
})
