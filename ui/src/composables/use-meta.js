import { computed, watch, onActivated, onDeactivated, onUnmounted } from 'vue'

import useQuasar from './use-quasar.js'
import { clientList, planClientUpdate } from '../plugins/Meta.js'

export default metaOptions => {
  if (__QUASAR_SSR_SERVER__) {
    const { ssrContext } = useQuasar()

    ssrContext.__qMetaList.push(
      typeof metaOptions === 'function'
        ? metaOptions()
        : metaOptions
    )
  }
  else {
    const meta = { active: true }

    if (typeof metaOptions === 'function') {
      const content = computed(metaOptions)
      meta.val = content.value

      watch(() => content.value, val => {
        meta.val = val
        meta.active === true && planClientUpdate()
      })
    }
    else {
      meta.val = metaOptions
    }

    clientList.push(meta)
    planClientUpdate()

    onActivated(() => {
      meta.active = true
      planClientUpdate()
    })

    onDeactivated(() => {
      meta.active = false
      planClientUpdate()
    })

    onUnmounted(() => {
      clientList.splice(clientList.indexOf(meta), 1)
      planClientUpdate()
    })
  }
}
