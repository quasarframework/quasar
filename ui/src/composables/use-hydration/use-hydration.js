import { ref, onMounted } from 'vue'

// using it to manage SSR rendering with best performance
import { isRuntimeSsrPreHydration } from '../../plugins/platform/Platform.js'

export default function () {
  const isHydrated = ref(!isRuntimeSsrPreHydration.value)

  if (isHydrated.value === false) {
    onMounted(() => {
      isHydrated.value = true
    })
  }

  return { isHydrated }
}
