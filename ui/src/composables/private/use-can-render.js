import { ref, onMounted } from 'vue'

// using it to manage SSR rendering with best performance
import { isRuntimeSsrPreHydration } from '../../plugins/Platform.js'

export default function () {
  const canRender = ref(!isRuntimeSsrPreHydration.value)

  if (canRender.value === false) {
    onMounted(() => {
      canRender.value = true
    })
  }

  return canRender
}
