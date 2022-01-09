import { ref, computed, watch, onBeforeUnmount, getCurrentInstance } from 'vue'

import useFormChild from '../use-form-child.js'
import { testPattern } from '../../utils/patterns.js'
import { debounce } from '../../utils.js'
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
    props.disable !== true
    && props.rules !== void 0
    && props.rules !== null
    && props.rules.length > 0
  )

  const hasError = computed(() =>
    props.error === true || innerError.value === true
  )

  const errorMessage = computed(() => (
    typeof props.errorMessage === 'string' && props.errorMessage.length > 0
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

      if (hasRules.value === true && props.lazyRules !== 'ondemand') {
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
    if (hasRules.value !== true) {
      return true
    }

    validateIndex++

    if (innerLoading.value !== true && props.lazyRules !== true) {
      isDirtyModel.value = true
    }

    const update = (err, msg) => {
      if (innerError.value !== err) {
        innerError.value = err
      }

      const m = msg || void 0

      if (innerErrorMessage.value !== m) {
        innerErrorMessage.value = m
      }

      if (innerLoading.value !== false) {
        innerLoading.value = false
      }
    }

    const promises = []

    for (let i = 0; i < props.rules.length; i++) {
      const rule = props.rules[ i ]
      let res

      if (typeof rule === 'function') {
        res = rule(val)
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

    if (innerLoading.value !== true) {
      innerLoading.value = true
    }

    const index = validateIndex

    return Promise.all(promises).then(
      res => {
        if (index !== validateIndex) {
          return true
        }

        if (res === void 0 || Array.isArray(res) === false || res.length === 0) {
          update(false)
          return true
        }

        const msg = res.find(r => r === false || typeof r === 'string')
        update(msg !== void 0, msg)
        return msg === void 0
      },
      e => {
        if (index === validateIndex) {
          console.error(e)
          update(true)
          return false
        }

        return true
      }
    )
  }

  function validateIfNeeded (changedRules) {
    if (
      hasRules.value === true
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
