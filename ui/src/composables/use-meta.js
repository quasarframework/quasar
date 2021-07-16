import { computed, watch, onActivated, onDeactivated, onUnmounted, useSSRContext } from 'vue'

import { clientList, planClientUpdate } from '../plugins/Meta.js'

export default function (metaOptions) {
  if (__QUASAR_SSR_SERVER__) {
    const ssrContext = useSSRContext()

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

      watch(content, val => {
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
