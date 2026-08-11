import { Transition, h, onBeforeUnmount } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'

export default /*#__PURE__*/ createComponent({
  name: 'QSlideTransition',

  props: {
    appear: Boolean,
    duration: {
      type: Number,
      default: 300
    }
  },

  emits: ['show', 'hide'],

  setup(props, { slots, emit }) {
    let animating = false,
      doneFn,
      element
    let timerFallback = null,
      animListener,
      lastEvent

    function cleanup() {
      doneFn?.()
      doneFn = null
      animating = false

      if (timerFallback !== null) {
        clearTimeout(timerFallback)
        timerFallback = null
      }

      element?.removeEventListener('transitionend', animListener)
      animListener = null
    }

    function begin(el, height, done) {
      // here overflowY is 'hidden'
      if (height !== void 0) {
        el.style.height = `${height}px`
      }
      el.style.transition = `height ${props.duration}ms cubic-bezier(.25, .8, .50, 1)`

      animating = true
      doneFn = done

      // the read forces a style flush, so the height target applied right
      // after transitions from the starting height instead of snapping;
      // it also happens to be the content height (the "show" target)
      return el.scrollHeight
    }

    function end(el, event) {
      el.style.overflowY = null
      el.style.height = null
      el.style.transition = null
      cleanup()
      if (event !== lastEvent) emit(event)
    }

    function onEnter(el, done) {
      let pos = 0
      element = el

      const wasAnimating = animating

      if (wasAnimating) {
        cleanup()
      } else {
        lastEvent = 'hide'
      }

      // nothing to animate: settle immediately, with no layout read
      // and no timers
      if (props.duration <= 0) {
        doneFn = done
        end(el, 'show')
        return
      }

      if (wasAnimating) {
        pos = el.offsetHeight === el.scrollHeight ? 0 : void 0
      } else {
        // if animating, overflowY is already 'hidden'
        el.style.overflowY = 'hidden'
      }

      const target = begin(el, pos, done)

      el.style.height = `${target}px`
      animListener = evt => {
        if (Object(evt) !== evt || evt.target === el) {
          end(el, 'show')
        }
      }
      el.addEventListener('transitionend', animListener)
      timerFallback = setTimeout(animListener, props.duration * 1.1)
    }

    function onLeave(el, done) {
      let pos
      element = el

      const wasAnimating = animating

      if (wasAnimating) {
        cleanup()
      } else {
        lastEvent = 'show'
      }

      // nothing to animate: settle immediately, with no layout read
      // and no timers
      if (props.duration <= 0) {
        doneFn = done
        end(el, 'hide')
        return
      }

      if (wasAnimating === false) {
        // we need to set overflowY 'hidden' before calculating the height
        // or else we get small differences
        el.style.overflowY = 'hidden'
        pos = el.scrollHeight
      }

      begin(el, pos, done)

      el.style.height = 0
      animListener = evt => {
        if (Object(evt) !== evt || evt.target === el) {
          end(el, 'hide')
        }
      }
      el.addEventListener('transitionend', animListener)
      timerFallback = setTimeout(animListener, props.duration * 1.1)
    }

    onBeforeUnmount(() => {
      if (animating) cleanup()
    })

    return () =>
      h(
        Transition,
        {
          css: false,
          appear: props.appear,
          onEnter,
          onLeave
        },
        slots.default
      )
  }
})
