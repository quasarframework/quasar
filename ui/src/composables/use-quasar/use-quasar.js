import { getCurrentInstance, inject } from 'vue'

import { quasarKey } from '../../utils/private.symbols/symbols.js'

/**
 * Returns the $q instance.
 * Equivalent to `this.$q` inside templates.
 */
export default function useQuasar() {
  const vm = getCurrentInstance()

  // installQuasar() registers $q both as an app provide and as a global
  // property; the direct appContext read is ~15x cheaper than an inject()
  // provides-chain walk, so inject() is kept only for the instance-less
  // app.runWithContext() case
  return vm !== null
    ? vm.appContext.config.globalProperties.$q
    : inject(quasarKey)
}
