import { scroll } from 'quasar'
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'

const { setVerticalScrollPosition, getVerticalScrollPosition } = scroll

let scrollTimer
let scrollFrame
const scrollDuration = 500
const headerOffset = 166 // TODO dynamic header
// how far outside the viewport an example mounts (DocExample's rootMargin)
const mountMargin = 400
// once the scroll lands, the layout around it gets this long to move
// (an example filling in after its mount) before the target is let go
const holdDuration = 600

export default function injectScroll(store) {
  let preventTocUpdate = store.$route.hash.length > 1

  // blocks that take their final height later register a settle function,
  // and an anchor scroll settles the ones above its target first, or the
  // target would move under the viewport. An API card fills once its file
  // arrives wherever it is; an on-demand block (an example) only mounts when
  // scrolled near, so only those within reach of the target need settling
  const blocks = new Map()

  function trackLayout(el, settle, { onDemand = false, refresh } = {}) {
    blocks.set(el, { settle, onDemand, refresh })
    return () => {
      blocks.delete(el)
    }
  }

  // while a scroll runs, the on-demand blocks it passes over stay
  // placeholders (a mount that lands after the scroll would push the target
  // away); once it lands, each one re-checks whether it is in view now, and
  // the target is held in place while the layout around it settles
  let scrolling = false

  function endScroll(el) {
    scrolling = false
    blocks.forEach(({ refresh }) => {
      refresh?.()
    })
    hold(el)
  }

  const holdBreakers = ['wheel', 'touchstart', 'keydown']

  function hold(el) {
    const until = performance.now() + holdDuration

    const release = () => {
      cancelAnimationFrame(scrollFrame)
      holdBreakers.forEach(name => {
        window.removeEventListener(name, release)
      })
    }

    const check = now => {
      const to = targetOffset(el)
      if (getVerticalScrollPosition(window) !== to) {
        setVerticalScrollPosition(window, to)
      }

      if (now < until) {
        scrollFrame = requestAnimationFrame(check)
      } else {
        release()
      }
    }

    // the reader's own scrolling wins over the hold
    holdBreakers.forEach(name => {
      window.addEventListener(name, release, { passive: true })
    })
    scrollFrame = requestAnimationFrame(check)
  }

  // what the scroll will land on: every block above the target that fills
  // in on its own, and every on-demand block the viewport around the target
  // will ask to mount (above it, the growth would push it away; below it,
  // the growth is what lets a target near the page end reach the top)
  function settleAround(target) {
    const pending = []
    const targetTop = target.getBoundingClientRect().top
    const from = targetTop - headerOffset - mountMargin
    const to = targetTop - headerOffset + window.innerHeight + mountMargin

    blocks.forEach(({ settle, onDemand }, el) => {
      let needed

      if (onDemand) {
        const { top, bottom } = el.getBoundingClientRect()
        needed = bottom > from && top < to
      } else {
        needed =
          (el.compareDocumentPosition(target) &
            Node.DOCUMENT_POSITION_FOLLOWING) !==
          0
      }

      if (needed) {
        pending.push(settle())
      }
    })

    return pending.length !== 0 ? Promise.all(pending) : null
  }

  watch(
    () => store.$route.fullPath,
    (newRoute, oldRoute) => {
      setTimeout(() => {
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
      } else {
        endScroll(el)
      }
    })
  }

  function scrollPage(el, delay, onSettled) {
    clearTimeout(scrollTimer)
    cancelAnimationFrame(scrollFrame)

    preventTocUpdate = true
    scrolling = true

    if (delay > 0) {
      animateTo(el, delay)
    } else {
      setVerticalScrollPosition(window, targetOffset(el))
      endScroll(el)
    }

    scrollTimer = setTimeout(
      () => {
        preventTocUpdate = false
        onSettled()
      },
      delay + holdDuration + 10
    )
  }

  function scrollTo(id) {
    clearTimeout(scrollTimer)
    changeRouterHash('#' + id)
  }

  // the anchor being scrolled to is the active entry when the TOC lists it,
  // from the moment the scroll starts; any other anchor (an example, a
  // heading the TOC skips) gets the entry above it once the scroll lands
  function markActiveToc(id, settled) {
    if (store.state.value.toc.some(entry => entry.id === id)) {
      if (!settled) {
        store.state.value.activeToc = id
      }
    } else if (settled) {
      store.setActiveToc(getVerticalScrollPosition(window))
    }
  }

  function onPageScroll({ position }) {
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

  function scrollToCurrentAnchor(immediate) {
    const hash = window.location.hash
    const el = hash.length > 1 ? document.getElementById(hash.slice(1)) : null

    if (el !== null) {
      const id = hash.slice(1)
      const onSettled = () => {
        markActiveToc(id, true)
      }

      markActiveToc(id, false)

      if (immediate) {
        let anchorEl = el
        while (
          anchorEl.parentElement !== null &&
          anchorEl.parentElement.classList.contains('q-page') !== true
        ) {
          anchorEl = anchorEl.parentElement
        }

        document.body.classList.add('q-scroll--lock')
        anchorEl.classList.add('q-scroll--anchor')

        setTimeout(() => {
          document.body.classList.remove('q-scroll--lock')
          anchorEl?.classList.remove('q-scroll--anchor')
        }, 2000)
      }

      const delay = immediate ? 0 : scrollDuration
      const pending = settleAround(el)

      if (pending === null) {
        scrollPage(el, delay, onSettled)
      } else {
        pending.then(() => {
          nextTick(() => {
            // unless the page changed while the blocks settled
            if (el.isConnected) {
              scrollPage(el, delay, onSettled)
            }
          })
        })
      }
    } else {
      preventTocUpdate = false
      store.setActiveToc()
    }
  }

  onMounted(() => {
    setTimeout(() => {
      scrollToCurrentAnchor(true)
    }, 0)
  })

  onBeforeUnmount(() => {
    clearTimeout(scrollTimer)
    cancelAnimationFrame(scrollFrame)
  })

  store.scrollTo = scrollTo
  store.onPageScroll = onPageScroll
  store.trackLayout = trackLayout
  store.isScrolling = () => scrolling
}
