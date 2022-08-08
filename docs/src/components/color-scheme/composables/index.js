import { computed } from 'vue'
import { Dark, LocalStorage } from 'quasar'

export const useColorScheme = () => {
  const getColorScheme = value => {
    if (value === 'light' || value === false) return false
    if (value === 'dark' || value === true) return true

    return Dark.mode
  }

  const saveColorScheme = (value) => LocalStorage.set('color-scheme', value)
  const getSavedOrNativeColorScheme = () => LocalStorage.getItem('color-scheme') ?? window.matchMedia('(prefers-color-scheme: dark)').matches

  const setColorScheme = value => {
    const colorScheme = getColorScheme(value)
    Dark.set(colorScheme)
    saveColorScheme(colorScheme)
  }

  const initColorScheme = () => setColorScheme(getSavedOrNativeColorScheme())

  const colorScheme = computed({
    get: () => Dark.isActive ? 'dark' : 'light',
    set: setColorScheme
  })

  const isDarkMode = computed(() => Dark.isActive)

  return {
    initColorScheme,
    colorScheme,
    isDarkMode
  }
}
