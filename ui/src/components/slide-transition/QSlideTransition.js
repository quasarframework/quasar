import { h, onBeforeUnmount, Transition } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'

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
    let timer = null, timerFallback = null, animListener, lastEvent

    function cleanup () {
      doneFn && doneFn()
      doneFn = null
      animating = false

      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }

      if (timerFallback !== null) {
        clearTimeout(timerFallback)
        timerFallback = null
      }

      element !== void 0 && element.removeEventListener('transitionend', animListener)
      animListener = null
    }

    function begin (el, height, done) {
      // here overflowY is 'hidden'
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

      // if animationg overflowY is already 'hidden'
      if (animating === true) {
        cleanup()
        pos = el.offsetHeight === el.scrollHeight ? 0 : void 0
      }
      else {
        lastEvent = 'hide'
        el.style.overflowY = 'hidden'
      }

      begin(el, pos, done)

      timer = setTimeout(() => {
        timer = null
        el.style.height = `${ el.scrollHeight }px`
        animListener = evt => {
          timerFallback = null

          if (Object(evt) !== evt || evt.target === el) {
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
        // we need to set overflowY 'hidden' before calculating the height
        // or else we get small differences
        el.style.overflowY = 'hidden'
        pos = el.scrollHeight
      }

      begin(el, pos, done)

      timer = setTimeout(() => {
        timer = null
        el.style.height = 0
        animListener = evt => {
          timerFallback = null

          if (Object(evt) !== evt || evt.target === el) {
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
