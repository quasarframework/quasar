export function updatePosition (el, anchorEl, cover) {
  el.style.top = '100%'
  el.style.bottom = null
  el.style.maxHeight = null
  el.style.transform = cover === true
    ? 'translate3d(0,-50%,0)'
    : null

  if (cover === true) {
    const { top } = el.getBoundingClientRect()

    if (top < 0) {
      el.style.transform = null
      el.style.top = Math.min(0, -anchorEl.getBoundingClientRect().top) + 'px'
    }
    else if (top + el.offsetHeight > window.innerHeight) {
      el.style.transform = null
      const rect = anchorEl.getBoundingClientRect()
      el.style.top = 'unset'
      el.style.bottom = (rect.top + anchorEl.offsetHeight - window.innerHeight) + 'px'
    }
    return
  }

  const
    elHeight = el.offsetHeight,
    { top } = anchorEl.getBoundingClientRect(),
    winHeight = window.innerHeight

  const diffBottom = winHeight - (top + anchorEl.offsetHeight + elHeight)

  if (diffBottom > 0) { return }

  const diffTop = top - elHeight

  if (diffBottom >= diffTop) {
    el.style.maxHeight = -diffBottom + 'px'
  }
  else {
    el.style.top = 'unset'
    el.style.bottom = '100%'
    el.style.maxHeight = top + 'px'
  }
}
