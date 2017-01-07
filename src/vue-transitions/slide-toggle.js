import { css } from '../utils/dom'
import { get, add } from '../utils/store'
import animate from '../utils/animate'

function getHeight (el, style) {
  let initial = {
    visibility: el.style.visibility,
    maxHeight: el.style.maxHeight
  }

  css(el, {
    visibility: 'hidden',
    maxHeight: ''
  })
  const height = style.height
  css(el, initial)

  return parseFloat(height, 10)
}

function parsePadding (padding) {
  return padding.split(' ').map(t => {
    let unit = t.match(/[a-zA-Z]+/) || ''
    if (unit) {
      unit = unit[0]
    }
    return [parseFloat(t, 10), unit]
  })
}

function toggleSlide (el, showing, done) {
  let store = get('slidetoggle', el) || {}
  function anim () {
    store.uid = animate({
      finalPos: showing ? 100 : 0,
      pos: store.pos !== null ? store.pos : showing ? 0 : 100,
      factor: 10,
      threshold: 0.5,
      apply (pos) {
        store.pos = pos
        css(el, {
          maxHeight: `${store.height * pos / 100}px`,
          padding: store.padding ? store.padding.map(t => (t[0] * pos / 100) + t[1]).join(' ') : ''
        })
      },
      done () {
        store.uid = null
        store.pos = null
        done()
        css(el, store.css)
      }
    })
    add('slidetoggle', el, store)
  }

  if (store.uid) {
    animate.stop(store.uid)
    return anim()
  }

  store.css = {
    overflowY: el.style.overflowY,
    maxHeight: el.style.maxHeight,
    padding: el.style.padding
  }
  let style = window.getComputedStyle(el)
  if (style.padding && style.padding !== '0px') {
    store.padding = parsePadding(style.padding)
  }
  store.height = getHeight(el, style)
  store.pos = null
  el.style.overflowY = 'hidden'
  anim()
}

export default {
  enter (el, done) {
    toggleSlide(el, true, done)
  },
  leave (el, done) {
    toggleSlide(el, false, done)
  }
}
