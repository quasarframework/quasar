import { computed, getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue'

import useFormChild from '../use-form/use-form-child.js'
import { testPattern } from '../../utils/patterns/patterns.js'
import debounce from '../../utils/debounce/debounce.js'
import { injectProp } from '../../utils/private.inject-obj-prop/inject-obj-prop.js'

const lazyRulesValues = [true, false, 'ondemand']

export const useValidateProps = {
  modelValue: {},

  error: {
    type: Boolean,
    default: null
  },
  errorMessage: String,
  noErrorIcon: Boolean,

  rules: Array,
  reactiveRules: Boolean,
  lazyRules: {
    type: [Boolean, String],
    default: false, // statement unneeded but avoids future vue implementation changes
    validator: v => lazyRulesValues.includes(v)
  }
}

export default function useValidate(focused, innerLoading) {
  const { props, proxy } = getCurrentInstance()

  const innerError = ref(false)
  const innerErrorMessage = ref(null)
  const isDirtyModel = ref(false)

  useFormChild({ validate, resetValidation })

  let validateIndex = 0,
    unwatchRules,
    unmounted = false,
    // a blur arrived while an async validation was in flight;
    // honor it when that validation settles
    pendingBlurValidation = false

  const hasRules = computed(
    () =>
      props.rules !== void 0 && props.rules !== null && props.rules.length !== 0
  )

  const canDebounceValidate = computed(
    () =>
      !props.disable &&
      hasRules.value &&
      // Should not have a validation in progress already;
      // It might mean that focus switched to submit btn and
      // QForm's submit() has been called already (ENTER key)
      !innerLoading.value
  )

  const hasError = computed(() => props.error === true || innerError.value)

  const errorMessage = computed(() =>
    typeof props.errorMessage === 'string' && props.errorMessage.length !== 0
      ? props.errorMessage
      : innerErrorMessage.value
  )

  watch(
    () => props.modelValue,
    () => {
      isDirtyModel.value = true

      if (
        canDebounceValidate.value &&
        // trigger validation if not using any kind of lazy-rules;
        // boolean lazy-rules still re-validates while an error is
        // displayed so the error clears as soon as the value is fixed
        (props.lazyRules === false ||
          (props.lazyRules === true && innerError.value))
      ) {
        debouncedValidate()
      }
    }
  )

  function onRulesChange() {
    if (
      props.lazyRules !== 'ondemand' &&
      canDebounceValidate.value &&
      isDirtyModel.value
    ) {
      debouncedValidate()
    }
  }

  watch(
    () => props.reactiveRules,
    val => {
      if (val) {
        if (unwatchRules === void 0) {
          unwatchRules = watch(() => props.rules, onRulesChange, {
            immediate: true,
            deep: true
          })
        }
      } else if (unwatchRules !== void 0) {
        unwatchRules()
        unwatchRules = void 0
      }
    },
    { immediate: true }
  )

  watch(() => props.lazyRules, onRulesChange)

  watch(focused, val => {
    if (val) {
      isDirtyModel.value = true
    } else if (props.lazyRules !== 'ondemand') {
      if (canDebounceValidate.value) {
        debouncedValidate()
      } else if (!props.disable && hasRules.value && innerLoading.value) {
        pendingBlurValidation = true
      }
    }
  })

  function resetValidation() {
    validateIndex++
    innerLoading.value = false
    isDirtyModel.value = false
    innerError.value = false
    innerErrorMessage.value = null
    pendingBlurValidation = false
    debouncedValidate.cancel()
  }

  /*
   * Return value
   *   - true (validation succeeded)
   *   - false (validation failed)
   *   - Promise (pending async validation)
   */
  function validate(val = props.modelValue) {
    if (props.disable || !hasRules.value) return true

    const index = ++validateIndex
    const startModel = props.modelValue
    pendingBlurValidation = false

    // an async validation freezes the watchers (see canDebounceValidate),
    // so a model change or blur arriving while it is in flight would
    // otherwise be lost and its verdict would go stale
    const revalidateIfStale = () => {
      const blurArrived = pendingBlurValidation
      pendingBlurValidation = false

      if (
        !unmounted &&
        props.modelValue !== startModel &&
        canDebounceValidate.value &&
        props.lazyRules !== 'ondemand' &&
        // same gates as the modelValue watcher, plus a deferred blur
        (props.lazyRules === false || innerError.value || blurArrived)
      ) {
        debouncedValidate()
      }
    }
    const setDirty = innerLoading.value
      ? () => {}
      : () => {
          isDirtyModel.value = true
        }

    const update = (hasErr, msg) => {
      if (hasErr) setDirty()

      innerError.value = hasErr
      innerErrorMessage.value = msg || null
      innerLoading.value = false
    }

    const promises = []

    for (let i = 0; i < props.rules.length; i++) {
      const rule = props.rules[i]
      let res

      if (typeof rule === 'function') {
        res = rule(val, testPattern)
      } else if (typeof rule === 'string') {
        if (testPattern[rule] === void 0) {
          // fail rather than silently accepting anything through a typo
          console.error(`Unknown validation pattern rule: "${rule}"`)
          res = false
        } else {
          res = testPattern[rule](val)
        }
      }

      if (res === false || typeof res === 'string') {
        update(true, res)
        return false
      } else if (res !== true && res !== void 0) {
        promises.push(res)
      }
    }

    if (promises.length === 0) {
      update(false)
      return true
    }

    innerLoading.value = true

    return Promise.all(promises).then(
      res => {
        if (res === void 0 || !Array.isArray(res) || res.length === 0) {
          if (index === validateIndex) {
            update(false)
            revalidateIfStale()
          }
          return true
        }

        const msg = res.find(r => r === false || typeof r === 'string')
        if (index === validateIndex) {
          update(msg !== void 0, msg)
          revalidateIfStale()
        }
        return msg === void 0
      },
      err => {
        if (index === validateIndex) {
          console.error(err)
          update(true)
          revalidateIfStale()
        }

        return false
      }
    )
  }

  const debouncedValidate = debounce(validate, 0)

  onBeforeUnmount(() => {
    unmounted = true
    unwatchRules?.()
    debouncedValidate.cancel()
  })

  // expose public methods & props
  Object.assign(proxy, { resetValidation, validate })
  injectProp(proxy, 'hasError', () => hasError.value)

  return {
    isDirtyModel,
    hasRules,
    hasError,
    errorMessage,

    validate,
    resetValidation
  }
}
