import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'

/**
 * Returns adjustHeight on the JS path only (undefined on the CSS path,
 * which is also where a DOM-less import lands: jsdom and friends have
 * no CSS global, and this runs at import time, not per instance).
 * The seam the component tests re-mock to force the JS fallback per
 * test (through the exported createAdjustHeightFn()).
 */
export const useAutogrow =
  __QUASAR_SSR_SERVER__ ||
  typeof CSS === 'undefined' ||
  CSS.supports('field-sizing', 'content')
    ? void 0
    : createAdjustHeightFn

/**
 * The measuring autogrow for browsers without CSS field-sizing:
 * collapses the textarea to 1px, reads its scrollHeight and writes it
 * back as the inline height. Runs on mount and on the autogrow/dense
 * prop changes by itself; returns the routine for the call sites that
 * must trigger it on their own schedule (input, model changes,
 * autofill animationend).
 */
export function createAdjustHeightFn(props, attrs, inputRef, $q) {
  let frameId = null

  function cancelPendingFrame() {
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
  }

  function adjustHeight() {
    // one measurement per frame however many callers ask for it (a
    // keystroke asks twice: the input handler and the model round-trip)
    if (frameId !== null) return

    frameId = requestAnimationFrame(() => {
      frameId = null

      const inp = inputRef.value
      if (inp !== null) {
        const parentStyle = inp.parentNode.style
        // chrome does not keep scroll #15498
        const { scrollTop } = inp
        // chrome calculates a smaller scrollHeight when in a .column container
        const { overflowY, maxHeight } = $q.platform.is.firefox
          ? {}
          : window.getComputedStyle(inp)
        // on firefox or if overflowY is specified as scroll #14263, #14344
        // we don't touch overflow
        // firefox is not so bad in the end
        const changeOverflow = overflowY !== void 0 && overflowY !== 'scroll'

        // reset height of textarea to a small size to detect the real height
        // but keep the total control size the same
        if (changeOverflow) inp.style.overflowY = 'hidden'
        parentStyle.marginBottom = inp.scrollHeight - 1 + 'px'
        inp.style.height = '1px'

        inp.style.height = inp.scrollHeight + 'px'
        // we should allow scrollbars only
        // if there is maxHeight and content is taller than maxHeight
        if (changeOverflow) {
          inp.style.overflowY =
            Number.parseInt(maxHeight, 10) < inp.scrollHeight
              ? 'auto'
              : 'hidden'
        }
        parentStyle.marginBottom = ''
        inp.scrollTop = scrollTop
      }
    })
  }

  watch(
    () => props.autogrow,
    val => {
      if (val) {
        nextTick(adjustHeight)
      }
      // restore the inline styles that adjustHeight() had set
      else if (inputRef.value !== null) {
        cancelPendingFrame()

        const { style } = inputRef.value
        style.overflowY = ''
        // if it has a number of rows set respect it
        style.height = attrs.rows > 0 ? 'auto' : ''
      }
    }
  )

  watch(
    () => props.dense,
    () => {
      if (props.autogrow) nextTick(adjustHeight)
    }
  )

  onMounted(() => {
    if (props.autogrow) adjustHeight()
  })

  onBeforeUnmount(cancelPendingFrame)

  return adjustHeight
}
