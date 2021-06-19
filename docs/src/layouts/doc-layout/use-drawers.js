import { ref, computed, watch } from 'vue'

export default function useDrawers (scope, $q, $route) {
  const leftDrawerState = ref(false)
  const rightDrawerState = ref(false)
  const rightDrawerOnLayout = ref(false)

  const hasRightDrawer = computed(() => scope.tocList.value.length > 0 || $q.screen.lt.sm)
  const showRightDrawerToggler = computed(() => {
    return hasRightDrawer.value === true && rightDrawerOnLayout.value === false
  })

  watch(hasRightDrawer, shown => {
    if (shown === false) {
      rightDrawerState.value = false
    }
  })

  watch(() => $route.path, () => {
    leftDrawerState.value = $q.screen.width > 1023
  })

  Object.assign(scope, {
    leftDrawerState,
    rightDrawerState,
    rightDrawerOnLayout,

    hasRightDrawer,
    showRightDrawerToggler,

    toggleLeftDrawer () {
      leftDrawerState.value = !leftDrawerState.value
    },

    toggleRightDrawer () {
      rightDrawerState.value = !rightDrawerState.value
    },

    updateRightDrawerOnLayout (state) {
      rightDrawerOnLayout.value = state
    }
  })
}
