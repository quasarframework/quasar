import { h, onBeforeUnmount, Transition } from 'vue'

import { createComponent } from '../../utils/private/create.js'

export default createComponent({
  name: 'QSlideTransition',

  props: {
    appear: Boolean,
    duration: {
      type: Number,
      default: 300
    }
  },

  emits: [ 'show', 'hide' ],

  setup (props, { slots, emit }) {
    let animating = false, doneFn, element
    let timer, timerFallback, animListener, lastEvent

    function cleanup () {
      doneFn && doneFn()
      doneFn = null
      animating = false

      clearTimeout(timer)
      clearTimeout(timerFallback)
      element !== void 0 && element.removeEventListener('transitionend', animListener)
      animListener = null
    }

    function begin (el, height, done) {
      el.style.overflowY = 'hidden'
      if (height !== void 0) {
        el.style.height = `${ height }px`
      }
      el.style.transition = `height ${ props.duration }ms cubic-bezier(.25, .8, .50, 1)`

      animating = true
      doneFn = done
    }

    function end (el, event) {
      el.style.overflowY = null
      el.style.height = null
      el.style.transition = null
      cleanup()
      event !== lastEvent && emit(event)
    }

    function onEnter (el, done) {
      let pos = 0
      element = el

      if (animating === true) {
        cleanup()
        pos = el.offsetHeight === el.scrollHeight ? 0 : void 0
      }
      else {
        lastEvent = 'hide'
      }

      begin(el, pos, done)

      timer = setTimeout(() => {
        el.style.height = `${ el.scrollHeight }px`
        animListener = ev => {
          if (Object(ev) !== ev || ev.target === el) {
            end(el, 'show')
          }
        }
        el.addEventListener('transitionend', animListener)
        timerFallback = setTimeout(animListener, props.duration * 1.1)
      }, 100)
    }

    function onLeave (el, done) {
      let pos
      element = el

      if (animating === true) {
        cleanup()
      }
      else {
        lastEvent = 'show'
        pos = el.scrollHeight
      }

      begin(el, pos, done)

      timer = setTimeout(() => {
        el.style.height = 0
        animListener = ev => {
          if (Object(ev) !== ev || ev.target === el) {
            end(el, 'hide')
          }
        }
        el.addEventListener('transitionend', animListener)
        timerFallback = setTimeout(animListener, props.duration * 1.1)
      }, 100)
    }

    onBeforeUnmount(() => {
      animating === true && cleanup()
    })

    return () => h(Transition, {
      css: false,
      appear: props.appear,
      onEnter,
      onLeave
    }, slots.default)
  }
})
