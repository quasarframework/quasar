import { getCurrentInstance, inject } from 'vue'

import { quasarKey } from '../../utils/private.symbols/symbols.js'

/**
 * Returns the $q instance.
 * Equivalent to `this.$q` inside templates.
 */
export default function useQuasar() {
  // installQuasar() registers $q both as an app provide and as a global
  // property; the appContext read is a fixed 3 hops, while inject() walks a
  // provides prototype chain as long as the component's tree depth, from a
  // call site that every component funnels through. inject() stays as the
  // fallback: for the instance-less app.runWithContext() case, and for the
  // shapes that reach $q through provides alone (a nested custom element
  // inherits its parent's provides, not its global properties)
  return (
    getCurrentInstance()?.appContext.config.globalProperties.$q ??
    inject(quasarKey)
  )
}
