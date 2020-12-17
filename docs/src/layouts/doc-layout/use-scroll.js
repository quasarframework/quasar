import { scroll } from 'quasar'
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const { setScrollPosition, getScrollPosition } = scroll

let preventTocUpdate = false
let scrollTimer

function scrollPage (el, delay) {
  const { top } = el.getBoundingClientRect()
  const offset = Math.max(0, top + getScrollPosition(window) - 66)

  clearTimeout(scrollTimer)

  preventTocUpdate = true
  setScrollPosition(window, offset, delay)

  scrollTimer = setTimeout(() => {
    preventTocUpdate = false
  }, delay + 10)
}

export default function useScroll (scope, $route) {
  const $router = useRouter()

  preventTocUpdate = $route.hash.length > 1

  watch(() => $route.fullPath, () => {
    setTimeout(() => {
      scrollToCurrentAnchor()
    })
  })

  function changeRouterHash (hash) {
    if ($route.hash !== hash) {
      $router.push({ hash }).catch(() => {})
    }
    else {
      scrollToCurrentAnchor()
    }
  }

  function scrollTo (id) {
    clearTimeout(scrollTimer)

    if (scope.rightDrawerOnLayout.value !== true) {
      scope.rightDrawerState.value = false
      scrollTimer = setTimeout(() => {
        changeRouterHash('#' + id)
      }, 300)
    }
    else {
      changeRouterHash('#' + id)
    }
  }

  function onScroll ({ position }) {
    if (
      preventTocUpdate !== true &&
      (scope.rightDrawerOnLayout.value === true || scope.rightDrawerState.value !== true)
    ) {
      scope.setActiveToc(position)
    }
  }

  function scrollToCurrentAnchor (immediate) {
    const hash = window.location.hash
    const el = hash.length > 1
      ? document.getElementById(hash.substring(1))
      : null

    const anchor = document.querySelector('.q-overflow-anchor')
    if (anchor !== null) {
      anchor.classList.remove('q-overflow-anchor')
    }

    if (el !== null) {
      el.classList.add('q-overflow-anchor')
      scrollPage(el, immediate === true ? 0 : 500)
    }
    else {
      preventTocUpdate = false
      scope.setActiveToc()
    }
  }

  onMounted(() => {
    // TODO: to be moved outside setTimeout once
    // QLayout updates QPageContainer spacing on time
    setTimeout(() => {
      scrollToCurrentAnchor(true)
    })
  })

  onBeforeUnmount(() => {
    clearTimeout(scrollTimer)
  })

  Object.assign(scope, {
    scrollTo,
    onScroll
  })
}
