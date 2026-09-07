import { getCurrentInstance } from 'vue'

import { portalProxyList } from '../../utils/private.portal/portal.js'
import { addFocusFn } from '../../utils/private.focus/focus-manager.js'

/*
 * A focus-taking portal (QMenu, QDialog) remembers the element that was
 * focused when it opened and hands focus back to it when it closes.
 *
 * Closing during the same event that opens another focus-taking portal
 * (a menu item or a dialog button with v-close-popup opening a dialog)
 * would make the two compete in the focus manager, and the closing one
 * would win on both counts: a browser-dispatched event runs its
 * microtasks between listeners, so the opener's nextTick show queues its
 * autofocus BEFORE the closer's listener queues the restore, and the
 * manager runs the last queued function only; the opener has also
 * captured a refocus target inside the closer's content, which is about
 * to be destroyed. So a portal closing under an opening one does not
 * restore at all: it donates its target to the opener, which restores it
 * when it closes in turn.
 *
 * isTakingFocus() -> whether this portal is in its opening transition and
 * will move focus into itself once it is done showing
 */
export default function usePortalRefocus(props, isTakingFocus) {
  const { proxy } = getCurrentInstance()

  let refocusTarget = null

  // skip: a show that takes no focus (a hover-shown menu)
  function captureRefocusTarget(skip) {
    refocusTarget =
      props.noRefocus || skip === true ? null : document.activeElement
  }

  function setRefocusTarget(target) {
    refocusTarget = target || null
  }

  function clearRefocusTarget() {
    refocusTarget = null
  }

  // a keyboard-initiated close lands on the tabbable control itself
  // (a QBtn's inner focus helper is not one)
  function resolveTarget(evt) {
    return (
      (evt?.type.indexOf('key') === 0
        ? refocusTarget.closest('[tabindex]:not([tabindex^="-"])')
        : void 0) || refocusTarget
    )
  }

  function restoreFocus(evt) {
    if (refocusTarget === null) return

    const target = resolveTarget(evt)
    refocusTarget = null

    const index = portalProxyList.indexOf(proxy)

    if (index !== -1) {
      // portals registered after this one sit on top of it
      for (let i = portalProxyList.length - 1; i > index; i--) {
        if (
          portalProxyList[i].__adoptRefocusTarget?.(target, proxy.contentEl) ===
          true
        ) {
          return
        }
      }
    }

    addFocusFn(() => {
      if (target.isConnected) target.focus({ preventScroll: true })
    })
  }

  // synchronous variant for a Tab handoff, which must land before the
  // default Tab action moves focus on
  function restoreFocusSync(evt) {
    if (refocusTarget === null) return

    if (refocusTarget.isConnected) {
      resolveTarget(evt).focus({ preventScroll: true })
    }

    refocusTarget = null
  }

  // called by a portal closing underneath this one while it opens;
  // returns true when this portal is taking focus, in which case the
  // caller must not restore focus itself
  function adoptRefocusTarget(target, donorEl) {
    if (!isTakingFocus()) return false

    if (
      !props.noRefocus &&
      (refocusTarget === null || donorEl?.contains(refocusTarget) === true)
    ) {
      refocusTarget = target
    }

    return true
  }

  return {
    captureRefocusTarget,
    setRefocusTarget,
    clearRefocusTarget,
    restoreFocus,
    restoreFocusSync,
    adoptRefocusTarget
  }
}
