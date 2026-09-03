import { watch } from 'vue'

import { position } from '../../utils/event/event.js'
import { supportsCssAnchor } from './engine/core.js'
import { useCssAnchorEngine } from './engine/anchor-engine.js'
import { useFallbackEngine } from './engine/fallback-engine.js'

export {
  parsePosition,
  validateOffset,
  validatePosition
} from './engine/core.js'

/*
 * The positioning of an anchored popup (QMenu, QTooltip): picks the
 * engine once per instance (native CSS anchor positioning where
 * supportsCssAnchor() says so, the JS fallback elsewhere) and drives it
 * through the popup's lifecycle.
 *
 * Usage:
 *   usePositionEngine({
 *     props,        // offset, maxHeight, maxWidth, transitionDuration
 *                   // (+ fit, cover where the popup supports them)
 *     $q,
 *     anchorEl,     // from useAnchor()
 *     innerRef,     // the popup's content element
 *     showing,
 *     anchorOrigin, // computed parsePosition() results
 *     selfOrigin,
 *     trackContent  // re-express the placement when the content
 *                   // mutates (fallback engine only; opt-in because
 *                   // it fires on every inner DOM change)
 *   })
 *
 * Returns:
 *   viaCssAnchor   // which engine drives this popup
 *   positionStyle  // .value: the content element's positioning style
 *   updatePosition // the placement decision; also the public method
 *   handleShow(pointEvt) // on show, before the content renders; the
 *                  // event's coordinates become the anchor point when
 *                  // one is given
 *   handleTick()   // once the content is in the DOM (the show tick)
 *   track()        // fallback engine only: re-express the placement
 *   releaseAnchor(hidingInProgress) // on hide (true), then again when
 *                  // the leave transition ends / on unmount (false)
 */
export default function usePositionEngine({
  props,
  $q,
  anchorEl,
  innerRef,
  showing,
  anchorOrigin,
  selfOrigin,
  trackContent = false
}) {
  let stopPositionWatcher

  // frozen per instance
  const viaCssAnchor = supportsCssAnchor()

  const engine = (viaCssAnchor ? useCssAnchorEngine : useFallbackEngine)(
    props,
    { anchorEl, innerRef, showing, anchorOrigin, selfOrigin, trackContent }
  )

  return {
    viaCssAnchor,
    positionStyle: engine.positionStyle,
    updatePosition: engine.updatePosition,
    handleTick: engine.handleTick,
    track: engine.track,

    handleShow(pointEvt) {
      engine.handleShow()

      if (pointEvt !== void 0 && anchorEl.value !== null) {
        const pos = position(pointEvt)

        // a keyboard event carries no coordinates and keeps the
        // anchor-relative placement
        if (pos.left !== void 0) {
          const { top, left } = anchorEl.value.getBoundingClientRect()

          engine.setAnchorPoint({
            left: pos.left - left,
            top: pos.top - top
          })
        }
      }

      if (stopPositionWatcher === void 0) {
        // with CSS anchor positioning the anchor() styles adapt on their
        // own and only the frozen flip/cap decision needs re-checking;
        // the fallback engine recomputes the whole position
        stopPositionWatcher = watch(
          () =>
            `${$q.screen.width}|${$q.screen.height}|${props.self}|` +
            `${props.anchor}|${$q.lang.rtl}`,
          () => {
            if (showing.value) engine.updatePosition()
          }
        )
      }
    },

    releaseAnchor(hidingInProgress) {
      if (stopPositionWatcher !== void 0) {
        stopPositionWatcher()
        stopPositionWatcher = void 0
      }

      engine.releaseAnchor(hidingInProgress)
    }
  }
}
