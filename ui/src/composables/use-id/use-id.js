import { ref, computed, watch, onMounted } from 'vue'

import uid from '../../utils/uid/uid.js'

import { isRuntimeSsrPreHydration } from '../../plugins/platform/Platform.js'

function parseValue (val) {
  return val === void 0 || val === null
    ? null
    : val
}

function getId (val, required) {
  return val === void 0 || val === null
    ? (required === true ? `f_${ uid() }` : null)
    : val
}

/**
 * Returns an "id" which is a ref() that can be used as
 * a unique identifier to apply to a DOM node attribute.
 *
 * On SSR, it takes care of generating the id on the client side (only) to
 * avoid hydration errors.
 */
export default function ({ getValue, required = true } = {}) {
  if (isRuntimeSsrPreHydration.value === true) {
    const id = getValue !== void 0
      ? ref(parseValue(getValue()))
      : ref(null)

    if (required === true && id.value === null) {
      onMounted(() => {
        id.value = `f_${ uid() }` // getId(null, true)
      })
    }

    if (getValue !== void 0) {
      watch(getValue, newId => {
        id.value = getId(newId, required)
      })
    }

    return id
  }

  return getValue !== void 0
    ? computed(() => getId(getValue(), required))
    : ref(`f_${ uid() }`) // getId(null, true)
}
