let rtlHasScrollBug = false

// mobile Chrome takes the crown for this
if (!__QUASAR_SSR__) {
  const scroller = document.createElement('div')
  const spacer = document.createElement('div')

  scroller.setAttribute('dir', 'rtl')
  scroller.style.width = '1px'
  scroller.style.height = '1px'
  scroller.style.overflow = 'auto'

  spacer.style.width = '1000px'
  spacer.style.height = '1px'

  document.body.appendChild(scroller)
  scroller.appendChild(spacer)
  scroller.scrollLeft = -1000

  rtlHasScrollBug = scroller.scrollLeft >= 0

  scroller.remove()
}

export {
  rtlHasScrollBug
}
