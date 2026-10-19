import { watch } from 'vue'

import { position } from '../../utils/event/event.js'
import { cssAnchorSupport } from './engine/core.js'
import { useCssAnchorEngine } from './engine/anchor-engine.js'
import { useFallbackEngine } from './engine/fallback-engine.js'

export {
  parsePosition,
  validateOffset,
  validatePosition
} from './engine/core.js'

const emptyStyle = { value: '' }

/*
 * The positioning of an anchored popup (QMenu, QTooltip): picks the
 * engine per anchor element (native CSS anchor positioning where
 * core.js' cssAnchorSupport says so, the JS fallback elsewhere) and
 * drives it through the popup's lifecycle.
 *
 * CSS anchor names are tree-scoped: the popup is teleported to <body>,
 * so an anchor-name declared on an element inside a shadow root (a
 * popup used in a web component, #18576) never resolves from there and
 * the popup would land at its static position. Such anchors run the JS
 * fallback instead, which measures across shadow boundaries; it does
 * not hear scrolls of containers inside the shadow tree though (scroll
 * events are not composed), only the document's.
 *
 * The decision is taken on show, for the anchor element in place then,
 * and kept until the anchor changes (a shared popup re-targeted); an
 * anchor that changes tree while keeping its identity, or that resolves
 * into a shadow root only after the show, is not re-examined.
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
 *     trackContent, // re-express the placement when the content
 *                   // mutates (fallback engine only; opt-in because
 *                   // it fires on every inner DOM change)
 *     viaCssAnchor  // tests only: false forces the JS fallback;
 *                   // production code leaves it to cssAnchorSupport
 *   })
 *
 * Returns:
 *   viaCssAnchor   // which engine drives this popup (read it at render
 *                  // time, never from a cached computed: it follows
 *                  // the anchor)
 *   positionStyle  // .value: the content element's positioning style
 *   updatePosition // the placement decision; also the public method
 *   handleShow(pointEvt) // on show, before the content renders; the
 *                  // event's coordinates become the anchor point when
 *                  // one is given
 *   handleTick()   // once the content is in the DOM (the show tick)
 *   track()        // re-express the placement (fallback engine; a
 *                  // no-op on the native one)
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
  trackContent = false,
  viaCssAnchor = cssAnchorSupport
}) {
  let stopPositionWatcher,
    // the engine driving the popup, decided for the anchor element in
    // `decidedAnchorRef`; each kind is created on its first use (a popup
    // that never opens allocates neither) and kept
    engine = null,
    // held weakly: a hidden popup must not keep a removed target alive
    // until its next show
    decidedAnchorRef = null,
    anchorEngine = null,
    fallbackEngine = null

  const engineOptions = {
    anchorEl,
    innerRef,
    showing,
    anchorOrigin,
    selfOrigin,
    trackContent
  }

  function selectEngine() {
    const el = anchorEl.value
    if (decidedAnchorRef?.deref() === el) return

    // the anchor's tree decides; an anchor still unresolved (target
    // prop) is assumed to be a light DOM one
    const next =
      viaCssAnchor && (el === null || !(el.getRootNode() instanceof ShadowRoot))
        ? (anchorEngine ??= useCssAnchorEngine(props, engineOptions))
        : (fallbackEngine ??= useFallbackEngine(props, engineOptions))

    if (engine !== next) {
      // a re-show during the leave transition still holds the previous
      // engine's anchor name / scroll tracking
      engine?.releaseAnchor(false)
      engine = next
    }

    decidedAnchorRef = el === null ? null : new WeakRef(el)
  }

  return {
    get viaCssAnchor() {
      return engine === null ? viaCssAnchor : engine === anchorEngine
    },
    get positionStyle() {
      return engine === null ? emptyStyle : engine.positionStyle
    },
    updatePosition() {
      engine?.updatePosition()
    },
    handleTick() {
      engine?.handleTick()
    },
    track() {
      engine?.track?.()
    },

    handleShow(pointEvt) {
      selectEngine()
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
        // the fallback engine recomputes the whole position; the anchor
        // itself can change while open (a shared popup re-targeted, or
        // a target prop that resolves right after the model turned on)
        stopPositionWatcher = watch(
          [
            anchorEl,
            () =>
              `${$q.screen.width}|${$q.screen.height}|${props.self}|` +
              `${props.anchor}|${$q.lang.rtl}`
          ],
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

      engine?.releaseAnchor(hidingInProgress)
    }
  }
}
