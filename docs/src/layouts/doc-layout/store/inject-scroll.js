import { scroll } from 'quasar'
import { onBeforeUnmount, onMounted, watch } from 'vue'

const { setVerticalScrollPosition, getVerticalScrollPosition } = scroll

let scrollTimer
let scrollFrame
let anchorTimer
const scrollDuration = 500

export const headerOffset = 166 // TODO dynamic header

export default function injectScroll(store) {
  let preventTocUpdate = store.$route.hash.length > 1

  // blocks that take their final height after the page renders (an example
  // mounting, an API card filling once its file arrives, one filling in
  // after a simulated request) register themselves. Whatever one of them
  // grows by while it starts above what the reader sees is scrolled past at
  // once: the adjustment the native scroll anchoring would make, which is
  // switched off for the page so the two never compound. An anchor jump
  // that the page bottom cut short (the blocks below its target not grown
  // yet) is re-aimed on each growth until it lands or the reader scrolls
  const blocks = new Set()
  const heights = new Map()
  let shortAnchor = null

  const growthObserver = import.meta.env.QUASAR_CLIENT
    ? new ResizeObserver(entries => {
        let delta = 0

        for (const { target, borderBoxSize } of entries) {
          const height = borderBoxSize[0].blockSize
          const previous = heights.get(target)
          heights.set(target, height)

          if (
            previous !== void 0 &&
            height !== previous &&
            // the block starts above what the reader sees (its bottom may
            // have just been pushed into view by this very growth)
            target.getBoundingClientRect().top < headerOffset
          ) {
            delta += height - previous
          }
        }

        if (shortAnchor !== null) {
          aimShortAnchor()
        } else if (delta !== 0) {
          window.scrollBy(0, delta)
        }
      })
    : null

  function aimShortAnchor() {
    const to = targetOffset(shortAnchor)
    setVerticalScrollPosition(window, to)
    if (getVerticalScrollPosition(window) === to) {
      shortAnchor = null
    }
  }

  function releaseShortAnchor() {
    shortAnchor = null
  }

  const readerInputs = ['wheel', 'touchstart', 'keydown']

  // the growth the settle waited for happened with the blocks below the
  // viewport, but the observer reports it after the jump, with the blocks
  // above it: taking their sizes as the baseline right before the jump
  // leaves those reports with nothing to compensate
  function snapshotHeights() {
    blocks.forEach(el => {
      heights.set(el, el.getBoundingClientRect().height)
    })
  }

  function trackLayout(el) {
    blocks.add(el)
    growthObserver.observe(el)
    return () => {
      blocks.delete(el)
      heights.delete(el)
      growthObserver.unobserve(el)
    }
  }

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
    snapshotHeights()

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
      store.setActiveToc()
    }
  }

  onMounted(() => {
    anchorTimer = setTimeout(() => {
      scrollToCurrentAnchor(true)
    }, 0)

    readerInputs.forEach(name => {
      window.addEventListener(name, releaseShortAnchor, { passive: true })
    })
  })

  onBeforeUnmount(() => {
    clearTimeout(scrollTimer)
    clearTimeout(anchorTimer)
    cancelAnimationFrame(scrollFrame)
    shortAnchor = null
    growthObserver.disconnect()
    blocks.clear()
    heights.clear()
    readerInputs.forEach(name => {
      window.removeEventListener(name, releaseShortAnchor)
    })
  })

  store.scrollTo = scrollTo
  store.onHeadingsCrossed = onHeadingsCrossed
  store.trackLayout = trackLayout
}
