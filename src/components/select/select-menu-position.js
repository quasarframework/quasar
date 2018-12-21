export function updatePosition (el, anchorEl, cover) {
  el.style.top = '100%'
  el.style.bottom = null
  el.style.maxHeight = null
  el.style.maxWidth = null
  el.style.transform = cover === true
    ? 'translate3d(0,-50%,0)'
    : null

  const
    { top: elTop } = el.getBoundingClientRect(),
    { top: anchorTop, left: anchorLeft } = anchorEl.getBoundingClientRect(),
    elWidth = el.offsetWidth,
    elHeight = el.offsetHeight,
    anchorWidth = anchorEl.offsetWidth,
    anchorHeight = anchorEl.offsetHeight,
    width = window.innerWidth,
    height = window.innerHeight

  if (width - anchorLeft - elWidth < 5) {
    if (width - anchorLeft - anchorWidth > anchorLeft) {
      el.style.maxWidth = (width - anchorLeft - 5) + 'px'
    }
    else {
      el.style.left = 'unset'
      el.style.right = 0
      el.style.maxWidth = (anchorLeft + anchorWidth - 5) + 'px'
    }
  }

  if (cover === true) {
    if (elTop < 5) {
      el.style.transform = null
      el.style.top = Math.min(0, -anchorTop + 5) + 'px'
    }
    else if (elTop + elHeight > height) {
      el.style.transform = null
      el.style.top = 'unset'
      el.style.bottom = (anchorTop + anchorHeight - height + 5) + 'px'
    }
  }
  else {
    if (height - (anchorTop + anchorHeight + elHeight) > 5) { return }

    const diffBottom = height - anchorTop - anchorHeight

    if (diffBottom >= anchorTop) {
      el.style.maxHeight = (diffBottom - 5) + 'px'
    }
    else {
      el.style.top = 'unset'
      el.style.bottom = '100%'
      el.style.maxHeight = (anchorTop - 5) + 'px'
    }
  }
}
