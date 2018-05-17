import { css } from '../../utils/dom'
import { start, stop } from '../../utils/animate'

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

  return parseFloat(height)
}

function parseSize (padding) {
  return padding.split(' ').map(t => {
    let unit = t.match(/[a-zA-Z]+/) || ''
    if (unit) {
      unit = unit[0]
    }
    return [parseFloat(t), unit]
  })
}

function toggleSlide (el, showing, done) {
  let store = el.__qslidetoggle || {}
  function anim () {
    store.uid = start({
      to: showing ? 100 : 0,
      from: store.pos !== null ? store.pos : showing ? 0 : 100,
      apply (pos) {
        store.pos = pos
        css(el, {
          maxHeight: `${store.height * pos / 100}px`,
          padding: store.padding ? store.padding.map(t => (t[0] * pos / 100) + t[1]).join(' ') : '',
          margin: store.margin ? store.margin.map(t => (t[0] * pos / 100) + t[1]).join(' ') : ''
        })
      },
      done () {
        store.uid = null
        store.pos = null
        done()
        css(el, store.css)
      }
    })
    el.__qslidetoggle = store
  }

  if (store.uid) {
    stop(store.uid)
    return anim()
  }

  store.css = {
    overflowY: el.style.overflowY,
    maxHeight: el.style.maxHeight,
    padding: el.style.padding,
    margin: el.style.margin
  }
  let style = window.getComputedStyle(el)
  if (style.padding && style.padding !== '0px') {
    store.padding = parseSize(style.padding)
  }
  if (style.margin && style.margin !== '0px') {
    store.margin = parseSize(style.margin)
  }
  store.height = getHeight(el, style)
  store.pos = null
  el.style.overflowY = 'hidden'
  anim()
}

export default {
  name: 'QSlideTransition',
  props: {
    appear: Boolean
  },
  render (h) {
    return h('transition', {
      props: {
        mode: 'out-in',
        css: false,
        appear: this.appear
      },
      on: {
        enter: (el, done) => {
          toggleSlide(el, true, () => {
            this.$emit('show')
            done()
          })
        },
        leave: (el, done) => {
          toggleSlide(el, false, () => {
            this.$emit('hide')
            done()
          })
        }
      }
    }, this.$slots.default)
  }
}
