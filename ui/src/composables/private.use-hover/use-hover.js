import useTimeout from '../use-timeout/use-timeout.js'

export const useHoverProps = {
  hover: Boolean,
  hoverDelay: {
    type: Number,
    default: 0
  },
  hoverHideDelay: {
    type: Number,
    default: 150
  }
}

/*
 * The shared engine behind the hover/hover-delay/hover-hide-delay props:
 * one timer serves both the postponed show and the grace-period hide, so
 * scheduling either cancels the other.
 *
 * The consumer keeps everything the contract leaves component-specific:
 * how a show/hide is performed, the hover-shown bookkeeping (focus
 * handling, activation upgrades, animating-click swallows) and any
 * cross-portal notifications. It also clears the timer itself wherever
 * a non-hover code path makes a pending show/hide moot.
 *
 * Usage:
 *   useHover({
 *     props,   // must carry useHoverProps
 *     canShow, // (evt) => Boolean; checked when the pointer enters
 *     show,    // (evt) => void; runs after hover-delay
 *     canHide, // (evt) => Boolean; checked when the pointer leaves
 *              // (evt may come from the target, the popup content, or a
 *              // proxied leave, so scope re-checks belong here)
 *     hide     // (evt) => void; runs after hover-hide-delay
 *   })
 */
export default function useHover({ props, canShow, show, canHide, hide }) {
  const { removeTimeout, registerTimeout } = useTimeout()

  // pointerenter handler for the hover target
  function hoverShow(evt) {
    // touch has no hover; a tap keeps acting through the click toggle
    if (props.hover !== true || evt.pointerType === 'touch') return

    removeTimeout()

    if (!canShow(evt)) return

    if (props.hoverDelay > 0) {
      registerTimeout(() => {
        show(evt)
      }, props.hoverDelay)
    } else {
      show(evt)
    }
  }

  // also exposed on its own for leaves observed by proxy (a descendant
  // popup notifying its hover ancestors), which carry a pointer event
  // the ancestor's own DOM never saw
  function scheduleHoverHide(evt) {
    removeTimeout()

    if (!canHide(evt)) return

    registerTimeout(() => {
      hide(evt)
    }, props.hoverHideDelay)
  }

  // pointerleave handler for the hover target and the popup content
  function hoverHide(evt) {
    if (props.hover !== true || evt.pointerType === 'touch') return

    scheduleHoverHide(evt)
  }

  // pointerenter handler for the popup content: cancels a pending hide
  function onHoverContentEnter(evt) {
    if (evt.pointerType !== 'touch') {
      removeTimeout()
    }
  }

  return {
    clearHoverTimer: removeTimeout,
    hoverShow,
    hoverHide,
    scheduleHoverHide,
    onHoverContentEnter
  }
}
