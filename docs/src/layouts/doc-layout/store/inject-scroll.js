import { scroll } from 'quasar'
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'

const { setVerticalScrollPosition, getVerticalScrollPosition } = scroll

let scrollTimer
let scrollFrame
let anchorTimer
const scrollDuration = 500

export const headerOffset = 166 // TODO dynamic header

export default function injectScroll(store) {
  let preventTocUpdate = store.$route.hash.length > 1

  // an anchor jump lands before the blocks above its target have their
  // final height (an example mounting, an API card filling once its file
  // arrives): each of them reports what it grew by once it settles, and
  // while the reader has not scrolled since the jump the page scrolls past
  // that growth, so the target stays where it landed. Native scroll
  // anchoring is switched off for the page so the two never compound. A
  // jump the page bottom cut short (the blocks below its target not grown
  // yet) is re-aimed on each report until it lands. The reader's first
  // wheel, touch or key ends both
  let anchored = false
  let shortAnchor = null

  function reportCardGrowth(vm) {
    nextTick(() => {
      if (vm.isUnmounted || !anchored) return

      if (shortAnchor !== null) {
        const to = targetOffset(shortAnchor)
        setVerticalScrollPosition(window, to)
        if (getVerticalScrollPosition(window) === to) {
          shortAnchor = null
        }
        return
      }

      const rect = vm.proxy.$el.getBoundingClientRect()
      const delta = rect.height - /* initial card height */ 50

      if (
        delta !== 0 &&
        // the block starts above what the reader sees (its bottom may have
        // just been pushed into view by this very growth)
        rect.top < headerOffset
      ) {
        window.scrollBy(0, delta)
      }
    })
  }

  function onReaderInput() {
    anchored = false
    shortAnchor = null
  }

  const readerInputs = ['wheel', 'touchstart', 'keydown']

  watch(
    () => store.$route.fullPath,
    (newRoute, oldRoute) => {
      clearTimeout(anchorTimer)
      anchorTimer = setTimeout(() => {
        scrollToCurrentAnchor(newRoute !== oldRoute)
      }, 0)
    }
  )

  function changeRouterHash(hash) {
    if (store.$route.hash !== hash) {
      store.$router.replace({ hash }).catch(() => {})
    } else {
      scrollToCurrentAnchor()
    }
  }

  function targetOffset(el) {
    return Math.max(
      0,
      el.getBoundingClientRect().top +
        getVerticalScrollPosition(window) -
        headerOffset
    )
  }

  // the same linear approach as Quasar's animated scroll, re-aiming at the
  // element every frame: the examples the scroll passes over mount and grow
  // while it runs, so a destination computed up front would land short
  function animateTo(el, duration, prevTime = performance.now()) {
    scrollFrame = requestAnimationFrame(nowTime => {
      const frameTime = nowTime - prevTime
      const pos = getVerticalScrollPosition(window)
      const to = targetOffset(el)
      const newPos =
        pos + ((to - pos) / Math.max(frameTime, duration)) * frameTime

      setVerticalScrollPosition(window, newPos)

      if (newPos !== to) {
        animateTo(el, duration - frameTime, nowTime)
      } else if (getVerticalScrollPosition(window) !== to) {
        shortAnchor = el
      }
    })
  }

  function scrollPage(el, delay, onSettled) {
    clearTimeout(scrollTimer)
    cancelAnimationFrame(scrollFrame)

    preventTocUpdate = true
    anchored = true
    shortAnchor = null

    if (delay > 0) {
      animateTo(el, delay)
    } else {
      const to = targetOffset(el)
      setVerticalScrollPosition(window, to)
      if (getVerticalScrollPosition(window) !== to) {
        shortAnchor = el
      }
    }

    scrollTimer = setTimeout(() => {
      preventTocUpdate = false
      onSettled()
    }, delay + 10)
  }

  function scrollTo(id) {
    clearTimeout(scrollTimer)
    changeRouterHash('#' + id)
  }

  // the anchor being scrolled to is the active entry when the TOC lists it,
  // from the moment the scroll starts and again once it lands; any other
  // anchor (an example, a heading the TOC skips) gets the entry above it
  // once the scroll lands
  function markActiveToc(id, settled) {
    if (store.state.value.toc.some(entry => entry.id === id)) {
      store.state.value.activeToc = id
    } else if (settled) {
      store.setActiveToc()
    }
  }

  // a heading crossed the reading line (inject-toc's observer): the active
  // entry follows, unless a programmatic scroll owns it for the moment
  function onHeadingsCrossed() {
    if (preventTocUpdate !== true && document.qScrollPrevented !== true) {
      store.setActiveToc()
    }
  }

  function scrollToCurrentAnchor(immediate) {
    const hash = window.location.hash
    const el = hash.length > 1 ? document.getElementById(hash.slice(1)) : null

    if (el !== null) {
      const id = hash.slice(1)
      const onSettled = () => {
        markActiveToc(id, true)
      }

      preventTocUpdate = true
      markActiveToc(id, false)

      const delay = immediate ? 0 : scrollDuration
      scrollPage(el, delay, onSettled)
    } else {
      preventTocUpdate = false
      anchored = false
      store.setActiveToc()
    }
  }

  onMounted(() => {
    anchorTimer = setTimeout(() => {
      scrollToCurrentAnchor(true)
    }, 0)

    readerInputs.forEach(name => {
      window.addEventListener(name, onReaderInput, { passive: true })
    })
  })

  onBeforeUnmount(() => {
    clearTimeout(scrollTimer)
    clearTimeout(anchorTimer)
    cancelAnimationFrame(scrollFrame)
    onReaderInput()
    readerInputs.forEach(name => {
      window.removeEventListener(name, onReaderInput)
    })
  })

  store.scrollTo = scrollTo
  store.onHeadingsCrossed = onHeadingsCrossed
  store.reportCardGrowth = reportCardGrowth
}
