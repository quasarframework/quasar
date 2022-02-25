import { useQuasar } from 'quasar'
import { inject, onMounted, provide, ref, watch } from 'vue'

const THEME_INJECTION_KEY = Symbol('q-theme')
const DEFAULT_THEME = 'brand'

export const AVAILABLE_THEMES = [ 'brand', 'light', 'dark' ]

export function useTheme () {
  const $q = useQuasar()
  // specifying a default value silence the runtime warning
  let currentTheme = inject(THEME_INJECTION_KEY, undefined)

  if (!currentTheme) {
    currentTheme = ref(DEFAULT_THEME)
    provide(THEME_INJECTION_KEY, currentTheme)
    onMounted(() => {
      const userPreference = $q.localStorage.getItem('theme')

      if (userPreference) {
        currentTheme.value = userPreference
      }
      else {
        $q.localStorage.set('theme', DEFAULT_THEME)
      }
    })
    watch(currentTheme, newTheme => $q.dark.set(newTheme === 'dark'), { immediate: true })
  }

  return { currentTheme }
}
