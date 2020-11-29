import { scroll } from 'quasar'
import { watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

const { setScrollPosition, getScrollPosition } = scroll

let scrollingPage = false
let scrollTimer

function resetScroll (_, done) {
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  done !== void 0 && done()
}

function scrollPage (el, delay) {
  const { top } = el.getBoundingClientRect()
  const offset = top + getScrollPosition(window) - el.scrollHeight - 50

  scrollingPage = true
  setScrollPosition(window, offset, delay)

  scrollTimer = setTimeout(() => {
    scrollingPage = false
  }, delay + 10)
}

function scrollToCurrentAnchor () {
  const hash = window.location.hash

  if (hash.length > 0) {
    const el = document.getElementById(hash.substring(1))
    el !== null && scrollPage(el, 0)
  }
}

export default function useScroll (scope, $route) {
  watch(() => $route.path, () => {
    nextTick(() => {
      if ($route.hash === '') {
        resetScroll()
      }
      else {
        scrollToCurrentAnchor()
      }
    })
  })

  function scrollTo (id) {
    const el = document.getElementById(id)
    if (el === null) {
      return
    }

    clearTimeout(scrollTimer)

    if (el) {
      if (scope.rightDrawerOnLayout.value !== true) {
        scope.rightDrawerState.value = false
        scrollTimer = setTimeout(() => {
          scrollPage(el, 500)
        }, 300)
      }
      else {
        scrollPage(el, 500)
      }

      el.id = ''
    }

    window.location.hash = '#' + id

    if (el) {
      setTimeout(() => {
        el.id = id
      }, 300)
    }
  }

  function onScroll ({ position }) {
    if (scrollingPage !== true) {
      scope.setActiveToc(position)
    }
  }

  onMounted(scrollToCurrentAnchor)

  onBeforeUnmount(() => {
    clearTimeout(scrollTimer)
  })

  Object.assign(scope, {
    resetScroll,
    scrollTo,
    onScroll
  })
}
