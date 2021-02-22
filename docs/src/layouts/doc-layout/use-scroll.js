import { scroll } from 'quasar'
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const { setVerticalScrollPosition, getVerticalScrollPosition } = scroll

let preventTocUpdate = false
let scrollTimer

const scrollDuration = 500

function scrollPage (el, delay) {
  const { top } = el.getBoundingClientRect()
  const offset = Math.max(0, top + getVerticalScrollPosition(window) - 66)

  clearTimeout(scrollTimer)

  preventTocUpdate = true
  setVerticalScrollPosition(window, offset, delay)

  scrollTimer = setTimeout(() => {
    preventTocUpdate = false
  }, delay + 10)
}

export default function useScroll (scope, $route) {
  const $router = useRouter()

  preventTocUpdate = $route.hash.length > 1

  watch(() => $route.fullPath, (newRoute, oldRoute) => {
    setTimeout(() => {
      scrollToCurrentAnchor(newRoute.path !== oldRoute.path)
    })
  })

  function changeRouterHash (hash) {
    if ($route.hash !== hash) {
      $router.replace({ hash }).catch(() => {})
    }
    else {
      scrollToCurrentAnchor()
    }
  }

  function scrollTo (id) {
    clearTimeout(scrollTimer)
    const hashtag = '#' + id

    if (scope.rightDrawerOnLayout.value !== true) {
      scope.rightDrawerState.value = false
      scrollTimer = setTimeout(() => {
        changeRouterHash(hashtag)
      }, 300)
    }
    else {
      changeRouterHash(hashtag)
    }

    setTimeout(() => {
      scope.setActiveToc(getVerticalScrollPosition(window))
    }, scrollDuration + 50)
  }

  function onScroll ({ position }) {
    if (
      preventTocUpdate !== true &&
      (scope.rightDrawerOnLayout.value === true || scope.rightDrawerState.value !== true)
    ) {
      scope.setActiveToc(position.vertical)
    }
  }

  function scrollToCurrentAnchor (immediate) {
    const hash = window.location.hash
    const el = hash.length > 1
      ? document.getElementById(hash.substring(1))
      : null

    if (el !== null) {
      if (immediate === true) {
        let anchorEl = el
        while (anchorEl.parentElement !== null && anchorEl.parentElement.classList.contains('q-page') !== true) {
          anchorEl = anchorEl.parentElement
        }

        document.body.classList.add('q-scroll--lock')
        anchorEl.classList.add('q-scroll--anchor')

        setTimeout(() => {
          document.body.classList.remove('q-scroll--lock')
          anchorEl && anchorEl.classList.remove('q-scroll--anchor')
        }, 2000)
      }

      scrollPage(el, immediate === true ? 0 : scrollDuration)
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
