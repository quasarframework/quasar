import { headerOffset } from './inject-scroll.js'

// a heading at or above where an anchor scroll puts it counts as read
// past: the entry it belongs to is the active one (2px: the jump lands
// within a subpixel, and an edge that only touches the line must count)
const readingLine = headerOffset + 2

export default function injectToc(store) {
  Object.assign(store.state, {
    toc: [],
    hasToc: false,
    activeToc: store.$route.hash.length > 1 ? store.$route.hash.slice(1) : null
  })

  const onClick = () => {
    store.scrollTo('introduction')
  }

  let ids = []

  store.setToc = toc => {
    store.state.value.toc =
      toc !== void 0
        ? [
            {
              id: 'introduction',
              title: '1. Introduction',
              onClick
            },
            ...toc.map(entry => ({
              ...entry,
              onClick() {
                store.state.value.tocDrawer = false
                store.scrollTo(entry.id)
              }
            }))
          ]
        : []

    store.state.value.hasToc = toc !== void 0
    ids = store.state.value.toc.map(entry => entry.id)

    if (import.meta.env.QUASAR_CLIENT) {
      // the page renders its headings in the flush that follows setToc
      Promise.resolve().then(observeHeadings)
    }
  }

  // the active entry is the last heading above the reading line. One
  // observer over the page's headings watches the area above that line
  // (open-ended upwards, so a heading a long jump carries past the line
  // still changes state) and reports every crossing, including the ones a
  // layout change causes, so nothing is measured on scroll: no offsetTop
  // reads, no forced layout. The area's bottom edge is the line, which
  // takes the viewport height, so a resize rebuilds the observer
  const above = new Set()
  let observer = null
  let resizeTimer

  function onEntries(entries) {
    for (const { isIntersecting, target } of entries) {
      if (isIntersecting) {
        above.add(target.id)
      } else {
        above.delete(target.id)
      }
    }

    store.onHeadingsCrossed()
  }

  function observeHeadings() {
    if (observer !== null) {
      observer.disconnect()
    }

    observer = new IntersectionObserver(onEntries, {
      rootMargin: `100000px 0px ${readingLine - window.innerHeight}px 0px`
    })
    above.clear()

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el !== null) {
        observer.observe(el)
      }
    }
  }

  function onResize() {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(observeHeadings, 200)
  }

  if (import.meta.env.QUASAR_CLIENT) {
    window.addEventListener('resize', onResize, { passive: true })
  }

  store.setActiveToc = () => {
    let last

    for (const id of ids) {
      if (above.has(id)) {
        last = id
      }
    }

    const active = last ?? ids[0] ?? null

    if (active !== null && active !== store.state.value.activeToc) {
      store.state.value.activeToc = active
    }
  }
}
