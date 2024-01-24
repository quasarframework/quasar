import { ref, onMounted } from 'vue'

import uid from '../../utils/uid.js'

import { isRuntimeSsrPreHydration } from '../../plugins/Platform.js'

export function getId (val, requiredId) {
  return val === void 0
    ? (requiredId === true ? `f_${ uid() }` : void 0)
    : val
}

/**
 * Returns an "id" which is a ref() that can be used as a unique identifier.
 * On SSR, it takes care of generating the id on the client side (only) to
 * avoid hydration errors.
 */
export default function (initialId, requiredId = true) {
  if (isRuntimeSsrPreHydration.value === true) {
    const id = ref(initialId)

    if (requiredId === true && initialId === void 0) {
      onMounted(() => {
        id.value = `f_${ uid() }` // getId(void 0, true)
      })
    }

    return id
  }

  return ref(
    getId(initialId, requiredId)
  )
}
