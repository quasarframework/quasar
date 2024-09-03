let rtlHasScrollBug = false

// mobile Chrome takes the crown for this
if (!__QUASAR_SSR__) {
  const scroller = document.createElement('div')
  scroller.setAttribute('dir', 'rtl')
  Object.assign(scroller.style, {
    width: '1px',
    height: '1px',
    overflow: 'auto'
  })

  const spacer = document.createElement('div')
  Object.assign(spacer.style, {
    width: '1000px',
    height: '1px'
  })

  document.body.appendChild(scroller)
  scroller.appendChild(spacer)
  scroller.scrollLeft = -1000

  rtlHasScrollBug = scroller.scrollLeft >= 0

  scroller.remove()
}

export {
  rtlHasScrollBug
}
