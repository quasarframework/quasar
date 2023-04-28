import { scroll } from 'quasar'
import { watch, onMounted, onBeforeUnmount } from 'vue'

const { setVerticalScrollPosition, getVerticalScrollPosition } = scroll

let scrollTimer
const scrollDuration = 500

export default function injectScroll (store) {
  let preventTocUpdate = store.$route.hash.length > 1

  watch(() => store.$route.fullPath, (newRoute, oldRoute) => {
    setTimeout(() => {
      scrollToCurrentAnchor(newRoute.path !== oldRoute.path)
    })
  })

  function changeRouterHash (hash) {
    if (store.$route.hash !== hash) {
      store.$router.replace({ hash }).catch(() => {})
    }
    else {
      scrollToCurrentAnchor()
    }
  }

  function scrollPage (el, delay) {
    const { top } = el.getBoundingClientRect()
    const offset = Math.max(0, top + getVerticalScrollPosition(window) - 166) // TODO dynamic header

    clearTimeout(scrollTimer)

    preventTocUpdate = true
    setVerticalScrollPosition(window, offset, delay)

    scrollTimer = setTimeout(() => {
      preventTocUpdate = false
    }, delay + 10)
  }

  function scrollTo (id) {
    clearTimeout(scrollTimer)
    changeRouterHash('#' + id)

    setTimeout(() => {
      store.setActiveToc(getVerticalScrollPosition(window))
    }, scrollDuration + 50)
  }

  function onPageScroll ({ position }) {
    // TODO
    // store.state.value.page.scrollTop = position

    if (
      preventTocUpdate !== true &&
      // (drawers.rightDrawerOnLayout.value === true || drawers.rightDrawerState.value !== true) &&
      document.qScrollPrevented !== true
    ) {
      store.setActiveToc(position)
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
      store.setActiveToc()
    }
  }

  onMounted(() => {
    setTimeout(() => {
      scrollToCurrentAnchor(true)
    })
  })

  onBeforeUnmount(() => {
    clearTimeout(scrollTimer)
  })

  store.scrollTo = scrollTo
  store.onPageScroll = onPageScroll
}
