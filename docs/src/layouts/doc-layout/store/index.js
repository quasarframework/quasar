import { computed, inject, provide, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'

import injectToc from './inject-toc'
import injectScroll from './inject-scroll'
import injectDrawer from './inject-drawer'

export const docStoreKey = '_q_ds_'

export function useDocStore () {
  return inject(docStoreKey)
}

export function provideDocStore () {
  const $q = useQuasar()

  const $route = useRoute()
  const $router = useRouter()

  const store = {
    $q,
    $route,
    $router,

    state: {
      dark: $q.cookies.get('dark-layout') === 'true',
      mounted: false
    },

    setDark (val) {
      if (store.state.value.dark !== val) {
        store.toggleDark()
      }
    },

    toggleDark () {
      const val = store.state.value.dark = store.state.value.dark === false
      $q.cookies.set('dark-layout', val, { path: '/' })
    }
  }

  injectToc(store)
  injectScroll(store)
  injectDrawer(store)

  if (process.env.SERVER) {
    store.state = { value: store.state }
    $q.dark.set(store.state.value.dark || $route.meta?.dark)
  }
  else {
    store.state = ref(store.state)
    store.dark = computed(() => (store.state.value.dark || $route.meta?.dark))
    watch(store.dark, val => { $q.dark.set(val) }, { immediate: true })
  }

  provide(docStoreKey, store)
  return store
}
