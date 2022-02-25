import { useQuasar } from 'quasar'
import { inject, provide, ref, watch } from 'vue'

const THEME_INJECTION_KEY = Symbol('q-theme')

export const AVAILABLE_THEMES = [ 'brand', 'light', 'dark' ]

export function useTheme () {
  const $q = useQuasar()
  // specifying a default value silence the runtime warning
  let currentTheme = inject(THEME_INJECTION_KEY, undefined)

  if (!currentTheme) {
    currentTheme = ref($q.localStorage.getItem('theme') ?? 'brand')
    provide(THEME_INJECTION_KEY, currentTheme)
    watch(currentTheme, newTheme => $q.dark.set(newTheme === 'dark'))
  }

  return { currentTheme }
}
