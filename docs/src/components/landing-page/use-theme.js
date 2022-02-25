import { useQuasar } from 'quasar'
import { ref, watch } from 'vue'

const currentTheme = ref()
const availableThemes = [ 'brand', 'light', 'dark' ]

export function useTheme () {
  const $q = useQuasar()

  if (!currentTheme.value) {
    currentTheme.value = $q.localStorage.getItem('theme') ?? 'brand'
  }

  watch(currentTheme, newTheme => $q.dark.set(newTheme === 'dark'))

  return { currentTheme, availableThemes }
}
