import { useColorScheme } from '../components/color-scheme/composables/index.js'

export default async function () {
  const { initColorScheme } = useColorScheme()
  initColorScheme()
}
