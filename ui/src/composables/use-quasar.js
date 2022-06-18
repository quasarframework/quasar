import { inject } from 'vue'
import { quasarKey } from '../utils/private/symbols.js'

/**
 * Returns the $q instance.
 * Equivalent to `this.$q` inside templates.
 */
export default function useQuasar () {
  return inject(quasarKey)
}
