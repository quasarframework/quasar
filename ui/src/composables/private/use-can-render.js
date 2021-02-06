import { ref, onMounted } from 'vue'

// using it to manage SSR rendering with best performance
import { isRuntimeSsrPreHydration } from '../../plugins/Platform.js'

export default function () {
  const canRender = ref(!isRuntimeSsrPreHydration)

  onMounted(() => {
    if (canRender.value === false) {
      canRender.value = true
    }
  })

  return canRender
}
