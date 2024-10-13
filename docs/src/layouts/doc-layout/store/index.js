import { computed, inject, provide, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'

import injectToc from './inject-toc.js'
import injectScroll from './inject-scroll.js'

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
      dark: $q.cookies.get('theme') !== 'light',
      menuDrawer: false,
      tocDrawer: false,
      quicklyNavigation: false
    },

    toggleDark () {
      const val = store.state.value.dark = store.state.value.dark === false
      $q.cookies.set(
        'theme',
        val ? 'dark' : 'light',
        { path: '/', sameSite: 'Strict', expires: 400 }
      )
    },

    toggleMenuDrawer () {
      store.state.value.menuDrawer = store.state.value.menuDrawer === false
    },

    toggleTocDrawer () {
      store.state.value.tocDrawer = store.state.value.tocDrawer === false
    },

    openQuicklyNavigation () {
      store.state.value.quicklyNavigation = true
    },

    closeQuicklyNavigation () {
      store.state.value.quicklyNavigation = false
    }

  }

  injectToc(store)
  injectScroll(store)

  if (process.env.SERVER) {
    store.state = { value: store.state }
    $q.dark.set(store.state.value.dark || $route.meta.dark)
  }
  else {
    store.state = ref(store.state)
    store.dark = computed(() => (store.state.value.dark || $route.meta.dark))
    watch(store.dark, val => { $q.dark.set(val) }, { immediate: true })

    // let's auto-close the drawer when we're starting to show
    // the left menu on the page...
    watch(
      () => $q.screen.width < 1301,
      () => { store.state.value.menuDrawer = false }
    )

    // let's auto-close the drawer when we're starting to show
    // the toc on the page...
    watch(
      () => $q.screen.lt.md,
      () => { store.state.value.tocDrawer = false }
    )
  }

  provide(docStoreKey, store)
  return store
}
