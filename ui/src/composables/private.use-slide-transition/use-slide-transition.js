import { onBeforeUnmount } from 'vue'

const noop = () => {}

const easing = 'cubic-bezier(.25, .8, .50, 1)'
const contentHeight = 'calc-size(auto, size)'
const showKeyframes = [{ height: '0px' }, { height: contentHeight }]
const hideKeyframes = [{ height: contentHeight }, { height: '0px' }]

/**
 * Engines that size a `calc-size(auto, size)` keyframe at layout
 * (Chromium) slide between 0 and the content height on a Web Animation
 * without any JS measurement: no forced layout on show or hide, the
 * content height is tracked live while sliding, and a mid-slide
 * reversal is the same animation played backwards. Every other engine
 * drops the keyframe as invalid and takes the measuring transition
 * path instead. Resolved once at import (the typeof guard covers
 * DOM-less imports); the tests pick an engine through the exported
 * creators.
 */
export const cssAutoHeightSupport =
  __QUASAR_SSR_SERVER__ ||
  (typeof CSS !== 'undefined' && CSS.supports('height', contentHeight))

/**
 * The enter/leave hooks of a height slide, shaped for a Vue Transition
 * rendered with `css: false` (element, done) but usable on any element
 * a component owns the visibility of: `done` is optional, and a slide
 * that is interrupted on the same element is reversed without settling
 * its `done` (a Transition has already cancelled it by then; a direct
 * caller's would hide the content that is reopening).
 *
 * QSlideTransition wraps them as a component; QStep feeds them into its
 * own Transition so the vertical and horizontal orientations share one
 * Transition vnode; QExpansionItem and QTree call them on their content
 * element directly and bind `display: none` to the settled state.
 */
export default cssAutoHeightSupport ? createNativeSlide : createMeasuredSlide

export function createNativeSlide(getDuration, emit = noop) {
  let animation = null,
    doneFn,
    lastEvent
  let timerFallback = null

  function cleanup() {
    if (timerFallback !== null) {
      clearTimeout(timerFallback)
      timerFallback = null
    }

    // a cancelled animation fires no finish event; cancelling also
    // releases the forwards fill so the element sizes itself again
    animation?.cancel()
    animation = null
  }

  function settle() {
    cleanup()
    doneFn?.()
    doneFn = null
  }

  function end(el, event) {
    el.style.overflowY = null
    settle()
    if (event !== lastEvent) emit(event)
  }

  function slide(el, done, event, keyframes) {
    const duration = getDuration()

    // an interrupted slide of the same element (v-show, direct callers)
    // is reversed in place; the slide of a re-created element (v-if)
    // settles and the new element starts its own
    const reversible = animation !== null && animation.effect.target === el

    if (animation !== null) {
      if (!reversible) doneFn?.()
      clearTimeout(timerFallback)
    } else {
      lastEvent = event === 'show' ? 'hide' : 'show'
    }

    doneFn = done

    // nothing to animate: settle immediately, with no timers
    if (duration <= 0) {
      end(el, event)
      return
    }

    if (reversible) {
      animation.reverse()
    } else {
      animation?.cancel()
      el.style.overflowY = 'hidden'
      animation = el.animate(keyframes, {
        duration,
        easing,
        fill: 'forwards'
      })
    }

    animation.onfinish = () => {
      end(el, event)
    }
    timerFallback = setTimeout(animation.onfinish, duration * 1.1)
  }

  function onEnter(el, done) {
    slide(el, done, 'show', showKeyframes)
  }

  function onLeave(el, done) {
    slide(el, done, 'hide', hideKeyframes)
  }

  onBeforeUnmount(() => {
    if (animation !== null) settle()
  })

  return { onEnter, onLeave }
}

/**
 * The measuring fallback: the content height is read (forcing a
 * layout) and written as the inline target of a CSS transition.
 */
export function createMeasuredSlide(getDuration, emit = noop) {
  let animating = false,
    doneFn,
    element
  let timerFallback = null,
    animListener,
    lastEvent

  function cleanup() {
    animating = false

    if (timerFallback !== null) {
      clearTimeout(timerFallback)
      timerFallback = null
    }

    element?.removeEventListener('transitionend', animListener)
    animListener = null
  }

  function settle() {
    cleanup()
    doneFn?.()
    doneFn = null
  }

  // the slide of another element settles when this one starts; one
  // of the same element is retargeted below, its done left alone
  function interrupt(el) {
    if (element !== el) doneFn?.()
    doneFn = null
    cleanup()
  }

  function begin(el, height, done) {
    // here overflowY is 'hidden'
    if (height !== void 0) {
      el.style.height = `${height}px`
    }
    el.style.transition = `height ${getDuration()}ms ${easing}`

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
    settle()
    if (event !== lastEvent) emit(event)
  }

  function onEnter(el, done) {
    let pos = 0

    const wasAnimating = animating
    const duration = getDuration()

    if (wasAnimating) {
      interrupt(el)
    } else {
      lastEvent = 'hide'
    }

    element = el

    // nothing to animate: settle immediately, with no layout read
    // and no timers
    if (duration <= 0) {
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
    timerFallback = setTimeout(animListener, duration * 1.1)
  }

  function onLeave(el, done) {
    let pos

    const wasAnimating = animating
    const duration = getDuration()

    if (wasAnimating) {
      interrupt(el)
    } else {
      lastEvent = 'show'
    }

    element = el

    // nothing to animate: settle immediately, with no layout read
    // and no timers
    if (duration <= 0) {
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
    timerFallback = setTimeout(animListener, duration * 1.1)
  }

  onBeforeUnmount(() => {
    if (animating) settle()
  })

  return { onEnter, onLeave }
}
