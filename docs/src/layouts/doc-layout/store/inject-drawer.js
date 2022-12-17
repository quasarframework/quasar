
import { computed, watch } from 'vue'

export default function injectDrawer (store) {
  store.state.drawer = false

  store.hasDrawer = computed(() => store.$q.screen.width < 1301)

  watch(store.hasDrawer, () => { store.state.value.drawer = false })

  store.toggleDrawer = () => {
    store.state.value.drawer = store.state.value.drawer === false
  }
}
