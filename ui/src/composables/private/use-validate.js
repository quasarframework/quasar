import { ref, computed, watch, onBeforeUnmount, getCurrentInstance } from 'vue'

import useFormChild from '../use-form-child.js'
import { testPattern } from '../../utils/patterns.js'
import debounce from '../../utils/debounce.js'
import { injectProp } from '../../utils/private/inject-obj-prop.js'

const lazyRulesValues = [ true, false, 'ondemand' ]

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
    type: [ Boolean, String ],
    validator: v => lazyRulesValues.includes(v)
  }
}

export default function (focused, innerLoading) {
  const { props, proxy } = getCurrentInstance()

  const innerError = ref(false)
  const innerErrorMessage = ref(null)
  const isDirtyModel = ref(null)

  useFormChild({ validate, resetValidation })

  let validateIndex = 0, unwatchRules

  const hasRules = computed(() =>
    props.rules !== void 0
    && props.rules !== null
    && props.rules.length !== 0
  )

  const hasActiveRules = computed(() =>
    props.disable !== true
    && hasRules.value === true
  )

  const hasError = computed(() =>
    props.error === true || innerError.value === true
  )

  const errorMessage = computed(() => (
    typeof props.errorMessage === 'string' && props.errorMessage.length !== 0
      ? props.errorMessage
      : innerErrorMessage.value
  ))

  watch(() => props.modelValue, () => {
    validateIfNeeded()
  })

  watch(() => props.reactiveRules, val => {
    if (val === true) {
      if (unwatchRules === void 0) {
        unwatchRules = watch(() => props.rules, () => {
          validateIfNeeded(true)
        })
      }
    }
    else if (unwatchRules !== void 0) {
      unwatchRules()
      unwatchRules = void 0
    }
  }, { immediate: true })

  watch(focused, val => {
    if (val === true) {
      if (isDirtyModel.value === null) {
        isDirtyModel.value = false
      }
    }
    else if (isDirtyModel.value === false) {
      isDirtyModel.value = true

      if (
        hasActiveRules.value === true
        && props.lazyRules !== 'ondemand'
        // Don't re-trigger if it's already in progress;
        // It might mean that focus switched to submit btn and
        // QForm's submit() has been called already (ENTER key)
        && innerLoading.value === false
      ) {
        debouncedValidate()
      }
    }
  })

  function resetValidation () {
    validateIndex++
    innerLoading.value = false
    isDirtyModel.value = null
    innerError.value = false
    innerErrorMessage.value = null
    debouncedValidate.cancel()
  }

  /*
   * Return value
   *   - true (validation succeeded)
   *   - false (validation failed)
   *   - Promise (pending async validation)
   */
  function validate (val = props.modelValue) {
    if (hasActiveRules.value !== true) {
      return true
    }

    const index = ++validateIndex

    const setDirty = innerLoading.value !== true
      ? () => { isDirtyModel.value = true }
      : () => {}

    const update = (err, msg) => {
      err === true && setDirty()

      innerError.value = err
      innerErrorMessage.value = msg || null
      innerLoading.value = false
    }

    const promises = []

    for (let i = 0; i < props.rules.length; i++) {
      const rule = props.rules[ i ]
      let res

      if (typeof rule === 'function') {
        res = rule(val, testPattern)
      }
      else if (typeof rule === 'string' && testPattern[ rule ] !== void 0) {
        res = testPattern[ rule ](val)
      }

      if (res === false || typeof res === 'string') {
        update(true, res)
        return false
      }
      else if (res !== true && res !== void 0) {
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
        if (res === void 0 || Array.isArray(res) === false || res.length === 0) {
          index === validateIndex && update(false)
          return true
        }

        const msg = res.find(r => r === false || typeof r === 'string')
        index === validateIndex && update(msg !== void 0, msg)
        return msg === void 0
      },
      e => {
        if (index === validateIndex) {
          console.error(e)
          update(true)
        }

        return false
      }
    )
  }

  function validateIfNeeded (changedRules) {
    if (
      hasActiveRules.value === true
      && props.lazyRules !== 'ondemand'
      && (isDirtyModel.value === true || (props.lazyRules !== true && changedRules !== true))
    ) {
      debouncedValidate()
    }
  }

  const debouncedValidate = debounce(validate, 0)

  onBeforeUnmount(() => {
    unwatchRules !== void 0 && unwatchRules()
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
