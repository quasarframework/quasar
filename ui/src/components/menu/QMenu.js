import {
  Transition,
  computed,
  getCurrentInstance,
  h,
  nextTick,
  onBeforeUnmount,
  ref,
  watch
} from 'vue'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useAnchor, {
  useAnchorProps
} from '../../composables/private.use-anchor/use-anchor.js'
import useModelToggle, {
  useModelToggleEmits,
  useModelToggleProps
} from '../../composables/private.use-model-toggle/use-model-toggle.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import usePortal from '../../composables/private.use-portal/use-portal.js'
import useTransition, {
  useTransitionProps
} from '../../composables/private.use-transition/use-transition.js'
import useTick from '../../composables/use-tick/use-tick.js'
import useTransitionEnd from '../../composables/private.use-transition-end/use-transition-end.js'

import { createComponent } from '../../utils/private.create/create.js'
import {
  closePortalMenus,
  getPortalProxy
} from '../../utils/private.portal/portal.js'
import { getParentProxy } from '../../utils/private.vm/vm.js'
import { position, stopAndPrevent } from '../../utils/event/event.js'
import { hSlot } from '../../utils/private.render/render.js'
import {
  addEscapeKey,
  removeEscapeKey
} from '../../utils/private.keyboard/escape-key.js'
import {
  addFocusout,
  removeFocusout
} from '../../utils/private.focus/focusout.js'
import { childHasFocus } from '../../utils/dom/dom.js'
import {
  addClickOutside,
  removeClickOutside
} from '../../utils/private.click-outside/click-outside.js'
import { addFocusFn } from '../../utils/private.focus/focus-manager.js'
import {
  addDetachedFullscreenListener,
  focusIsInDetachedFullscreen,
  removeDetachedFullscreenListener
} from '../../utils/private.focus/detached-fullscreen.js'

import {
  applyBoundary,
  applyPointBoundary,
  parsePosition,
  supportsCssAnchor,
  validateOffset,
  validatePosition
} from '../../utils/private.position-engine/position-engine.js'
import {
  getPositionStyle,
  removeAnchorName,
  setAnchorName
} from '../../utils/private.position-engine/anchor-position-engine.js'
import {
  addScrollTracking,
  applyPosition,
  removeScrollTracking,
  trackAnchorMotion
} from '../../utils/private.position-engine/fallback-position-engine.js'

const tabbableSelector =
  'a[href], button:not([disabled]), input:not([disabled]),' +
  ' select:not([disabled]), textarea:not([disabled]),' +
  ' [tabindex]:not([tabindex^="-"])'

function useCssAnchorEngine(
  props,
  { anchorEl, innerRef, anchorOrigin, selfOrigin }
) {
  let namedAnchorEl = null

  const anchorName = ref('')
  // set while the popup is anchored to a coordinate (touch position /
  // context menu) instead of the anchor's box: { top, left } relative
  // to the anchor's top-left corner
  const anchorPoint = ref(null)
  // overflow correction for point mode, measured on first paint
  const pointSelf = ref(null)
  // overflow correction for box mode (flip/cap), measured on first
  // paint; the popup stays invisible until the first pass ran
  const boundary = ref(null)
  const positioned = ref(false)

  const positionStyle = computed(() => {
    if (anchorName.value === '') return ''

    const b = anchorPoint.value === null ? boundary.value : null

    const style = getPositionStyle({
      anchorName: anchorName.value,
      anchorOrigin: b !== null ? b.anchorOrigin : anchorOrigin.value,
      selfOrigin:
        anchorPoint.value !== null
          ? (pointSelf.value ?? selfOrigin.value)
          : b !== null
            ? b.selfOrigin
            : selfOrigin.value,
      offset: props.offset,
      point: anchorPoint.value ?? void 0,
      fit: props.fit,
      cover: props.cover,
      maxHeight: props.maxHeight,
      maxWidth: props.maxWidth
    })

    if (b !== null) {
      if (b.maxHeight !== null) style.maxHeight = b.maxHeight
      if (b.maxWidth !== null) style.maxWidth = b.maxWidth
    }

    if (!positioned.value) {
      // hidden until the first boundary pass; lifted synchronously
      // there so the focus handoff never targets a hidden node
      style.visibility = 'hidden'
    }

    return style
  })

  // with CSS anchor positioning the browser owns the tracking and JS
  // only decides the placement: once per show, on demand (public
  // method, e.g. QSelect filtering) and on screen/prop changes
  const updatePosition = () => {
    const el = innerRef.value
    if (el === null || anchorEl.value === null) return

    if (anchorPoint.value === null) {
      boundary.value = applyBoundary({
        el,
        anchorEl: anchorEl.value,
        anchorOrigin: anchorOrigin.value,
        selfOrigin: selfOrigin.value,
        offset: props.offset,
        cover: props.cover,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth
      })
    } else {
      // point mode (touch position / context menu) mirrors around
      // the pointer instead of the anchor's box
      el.style.visibility = ''

      const res = applyPointBoundary({
        el,
        anchorEl: anchorEl.value,
        point: anchorPoint.value,
        selfOrigin: pointSelf.value ?? selfOrigin.value,
        offset: props.offset
      })

      if (res !== null) {
        pointSelf.value = res.selfOrigin
        anchorPoint.value = res.point
      }
    }

    positioned.value = true
  }

  const releaseAnchor = hidingInProgress => {
    // hidingInProgress keeps the anchor name until the leave transition is
    // done (the popup would lose its position mid-animation)
    if (!hidingInProgress) {
      if (namedAnchorEl !== null) {
        removeAnchorName(namedAnchorEl)
        namedAnchorEl = null
      }
      anchorName.value = ''
    }
  }

  return {
    positionStyle,

    releaseAnchor,
    updatePosition,
    setAnchorPoint(point) {
      anchorPoint.value = point
    },
    handleShow() {
      anchorPoint.value = null
      pointSelf.value = null
      boundary.value = null
      positioned.value = false

      // a rapid re-show can land while the previous hide transition
      // still holds the name; reuse it instead of acquiring twice
      if (namedAnchorEl !== anchorEl.value) {
        releaseAnchor(false)
        namedAnchorEl = anchorEl.value
        anchorName.value = setAnchorName(namedAnchorEl)
      }
    }
  }
}

function useFallbackEngine(
  props,
  { anchorEl, innerRef, showing, anchorOrigin, selfOrigin }
) {
  // set while the popup is anchored to a coordinate (touch position /
  // context menu) instead of the anchor's box: { top, left } relative
  // to the anchor's top-left corner
  let anchorPoint = null,
    // overflow correction for point mode, decided on first paint
    pointSelf = null,
    // overflow correction for box mode (flip/cap), decided on first
    // paint; the popup stays invisible until the first pass ran
    boundary = null,
    // the anchor-center viewport shift, frozen at decision time like
    // the native engine freezes it at layout time
    centerShift = null,
    retries = 0

  // re-expresses the frozen placement against the anchor's current
  // rect: cheap enough to run on every scroll step and anchor move
  const track = () => {
    if (innerRef.value === null || anchorEl.value === null) return

    const b = anchorPoint === null ? boundary : null

    centerShift = applyPosition({
      targetEl: innerRef.value,
      anchorEl: anchorEl.value,
      anchorOrigin: b !== null ? b.anchorOrigin : anchorOrigin.value,
      selfOrigin:
        anchorPoint !== null
          ? (pointSelf ?? selfOrigin.value)
          : b !== null
            ? b.selfOrigin
            : selfOrigin.value,
      offset: props.offset,
      point: anchorPoint ?? void 0,
      fit: props.fit,
      cover: props.cover,
      maxHeight: props.maxHeight,
      maxWidth: props.maxWidth,
      capHeight: b !== null ? b.maxHeight : null,
      capWidth: b !== null ? b.maxWidth : null,
      centerShift
    })
  }

  // the placement decision, with the same lifecycle as the native
  // engine's: re-run only per show, on demand (public method, e.g.
  // QSelect filtering) and on screen/placement-prop changes
  const updatePosition = () => {
    const el = innerRef.value
    if (el === null || anchorEl.value === null) return

    // some browsers report zero size when measuring too early
    if (el.offsetWidth === 0 || el.offsetHeight === 0) {
      if (retries < 5) {
        retries++
        setTimeout(updatePosition, 10)
      }
      return
    }
    retries = 0

    // a first pass at the intended placement also applies the fit/cover
    // min sizes the decision measures with
    if (anchorPoint === null) {
      boundary = null
      centerShift = null
      track()
      boundary = applyBoundary({
        el,
        anchorEl: anchorEl.value,
        anchorOrigin: anchorOrigin.value,
        selfOrigin: selfOrigin.value,
        offset: props.offset,
        cover: props.cover,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth
      })
    } else {
      track()
      const res = applyPointBoundary({
        el,
        anchorEl: anchorEl.value,
        point: anchorPoint,
        selfOrigin: pointSelf ?? selfOrigin.value,
        offset: props.offset
      })

      if (res !== null) {
        pointSelf = res.selfOrigin
        anchorPoint = res.point
      }
    }

    // the pass the frozen placement (boundary verdict + anchor-center
    // shift) is taken from
    centerShift = null
    track()
  }

  const onScroll = evt => {
    // a scroll inside the menu itself never moves its anchor; the iOS
    // visual viewport events carry a non-node target
    if (
      innerRef.value !== null &&
      (!(evt.target instanceof Node) || !innerRef.value.contains(evt.target))
    ) {
      track()
    }
  }

  const onDetachedFullscreenChange = () => {
    // useFullscreen() moved a subtree to <body> (or moved it back); if
    // the anchor traveled with it, the position written at show time is
    // stale (#18513) and no scroll event announces the move. The
    // notification fires before the DOM settles (enter: before the
    // fullscreen styles apply; exit: before the element is restored),
    // so re-express the placement only after the move and the re-render
    // are done. Only wired on the fallback engine: CSS anchor
    // positioning keeps tracking the anchor wherever it travels.
    nextTick(() => {
      requestAnimationFrame(() => {
        if (
          showing.value &&
          anchorEl.value !== null &&
          anchorEl.value.isConnected
        ) {
          track()
        }
      })
    })
  }

  const state = {
    stopAnchorTracking: void 0,
    positionStyle: { value: '' },

    track,
    updatePosition,
    setAnchorPoint(point) {
      anchorPoint = point
    },
    releaseAnchor(hidingInProgress) {
      if (state.stopAnchorTracking !== void 0) {
        state.stopAnchorTracking()
        state.stopAnchorTracking = void 0
      }

      if (hidingInProgress || showing.value) {
        removeDetachedFullscreenListener(onDetachedFullscreenChange)
      }

      // hidingInProgress keeps the scroll tracking until the leave
      // transition is done (the popup would lose its position
      // mid-animation), like the native engine holds its anchor name
      if (!hidingInProgress) {
        removeScrollTracking(onScroll)
        anchorPoint = null
        pointSelf = null
        boundary = null
        centerShift = null
      }
    },
    handleShow() {
      anchorPoint = null
      pointSelf = null
      boundary = null
      centerShift = null
      retries = 0

      addDetachedFullscreenListener(onDetachedFullscreenChange)
      addScrollTracking(onScroll)
    }
  }

  return state
}

export default /*#__PURE__*/ createComponent({
  name: 'QMenu',

  inheritAttrs: false,

  props: {
    ...useAnchorProps,
    ...useModelToggleProps,
    ...useDarkProps,
    ...useTransitionProps,

    persistent: Boolean,
    autoClose: Boolean,
    separateClosePopup: Boolean,
    noEscDismiss: Boolean,
    noRouteDismiss: Boolean,
    noRefocus: Boolean,
    noFocus: Boolean,

    fit: Boolean,
    cover: Boolean,

    square: Boolean,

    anchor: {
      type: String,
      validator: validatePosition
    },
    self: {
      type: String,
      validator: validatePosition
    },
    offset: {
      type: Array,
      validator: validateOffset
    },

    touchPosition: Boolean,

    hover: Boolean,
    hoverDelay: {
      type: Number,
      default: 0
    },
    hoverHideDelay: {
      type: Number,
      default: 150
    },

    maxHeight: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null
    }
  },

  emits: [...useModelToggleEmits, 'click', 'escapeKey'],

  setup(props, { slots, emit, attrs }) {
    let stopPositionWatcher,
      refocusTarget = null,
      avoidAutoClose,
      hoverTimer = null,
      // set while the current "show" was triggered by hovering the anchor,
      // in which case the menu must leave focus wherever it already is
      hoverShown = false

    const vm = getCurrentInstance()
    const { proxy } = vm
    const $q = useQuasar()

    // frozen per instance: which of the two positioning engines drives
    // this menu (native CSS anchor positioning vs the JS fallback)
    const viaCssAnchor = supportsCssAnchor()

    const innerRef = ref(null)
    const showing = ref(false)

    const hideOnRouteChange = computed(
      () => !props.persistent && !props.noRouteDismiss
    )

    const isDark = useDark(props, $q)
    const { registerTick, removeTick } = useTick()
    const { registerTransitionEnd } = useTransitionEnd(props)
    const { transitionProps, transitionStyle } = useTransition(props)

    const { anchorEl, canShow, anchorEvents } = useAnchor({
      showing,
      // the anchor is the control that opens this popup, so it carries
      // the disclosure state; a role declared on the popup through
      // fall-through attrs is what aria-haspopup can name
      getPopupRole: () => attrs.role
    })

    // referenced by name when useAnchor wires the anchor's hover events
    Object.assign(anchorEvents, { hoverShow, hoverHide })

    const { show, hide } = useModelToggle({
      showing,
      canShow,
      canHide(evt) {
        // if the menu is being hovered, then a click on the anchor
        // while it is opening should not close it
        return hoverShown && !portalIsAccessible.value
          ? evt?.type !== 'click'
          : true
      },
      handleShow,
      handleHide,
      handleRouteChange,
      hideOnRouteChange,
      processOnMount: true
    })

    const { showPortal, hidePortal, portalIsAccessible, renderPortal } =
      usePortal(vm, innerRef, renderPortalContent, 'menu')

    const clickOutsideProps = {
      anchorEl,
      innerRef,
      onClickOutside(e) {
        if (!props.persistent && showing.value) {
          hide(e)

          if (
            // a dismissing tap must not click through to the element
            // underneath (the mobile convention)
            e.type === 'touchstart' ||
            // prevent a press on a dialog backdrop from also
            // closing the dialog
            e.target.classList.contains('q-dialog__backdrop')
          ) {
            stopAndPrevent(e)
          }

          return true
        }
      }
    }

    const anchorOrigin = computed(() =>
      parsePosition(
        props.anchor || (props.cover ? 'center middle' : 'bottom start'),
        $q.lang.rtl
      )
    )

    const selfOrigin = computed(() =>
      props.cover
        ? anchorOrigin.value
        : parsePosition(props.self || 'top start', $q.lang.rtl)
    )

    const posEngine = (viaCssAnchor ? useCssAnchorEngine : useFallbackEngine)(
      props,
      {
        anchorEl,
        innerRef,
        showing,
        anchorOrigin,
        selfOrigin
      }
    )

    const menuClass = computed(
      () =>
        'q-menu scroll' +
        (viaCssAnchor ? '' : ' q-position-engine') +
        (props.square ? ' q-menu--square' : '') +
        (isDark() ? ' q-menu--dark q-dark' : '')
    )

    const onEvents = computed(() =>
      props.autoClose ? { onClick: onAutoClose } : {}
    )

    const handlesFocus = computed(() => showing.value && !props.persistent)

    watch(handlesFocus, val => {
      if (val) {
        addEscapeKey(onEscapeKey)
        addClickOutside(clickOutsideProps)
      } else {
        removeEscapeKey(onEscapeKey)
        removeClickOutside(clickOutsideProps)
      }
    })

    function focus() {
      addFocusFn(() => {
        let node = innerRef.value

        // the ref can hold a non-Element stub in non-browser test environments
        if (
          node &&
          node.contains !== void 0 &&
          !node.contains(document.activeElement)
        ) {
          node =
            node.querySelector(
              '[autofocus][tabindex], [data-autofocus][tabindex]'
            ) ||
            node.querySelector(
              '[autofocus] [tabindex], [data-autofocus] [tabindex]'
            ) ||
            node.querySelector('[autofocus], [data-autofocus]') ||
            node

          node.focus({ preventScroll: true })
        }
      })
    }

    function clearHoverTimer() {
      if (hoverTimer !== null) {
        clearTimeout(hoverTimer)
        hoverTimer = null
      }
    }

    // is the pointer still over the menu's own scope: its anchor, its
    // content, or a popup opened from within it? (the latter is rendered
    // in a sibling portal, so it is never a DOM descendant of the content)
    function hoverWithinScope(el) {
      if (el === null || el === void 0) return false

      if (
        (anchorEl.value !== null && anchorEl.value.contains(el)) ||
        (innerRef.value !== null && innerRef.value.contains(el))
      ) {
        return true
      }

      let portalProxy = getPortalProxy(el)
      while (portalProxy !== void 0 && portalProxy !== null) {
        if (portalProxy === proxy) return true
        portalProxy = getParentProxy(portalProxy)
      }

      return false
    }

    function scheduleHoverHide(evt) {
      clearHoverTimer()

      if (!showing.value || hoverWithinScope(evt.relatedTarget)) return

      hoverTimer = setTimeout(() => {
        hoverTimer = null
        hide(evt)
      }, props.hoverHideDelay)
    }

    function hoverShow(evt) {
      // touch has no hover; a tap keeps acting through the click toggle
      if (evt.pointerType === 'touch') return

      clearHoverTimer()

      if (showing.value) return

      if (props.hoverDelay > 0) {
        hoverTimer = setTimeout(() => {
          hoverTimer = null
          show(evt)
        }, props.hoverDelay)
      } else {
        show(evt)
      }
    }

    function hoverHide(evt) {
      if (evt.pointerType === 'touch') return

      scheduleHoverHide(evt)

      // a leave across a portal boundary is invisible to the ancestor
      // menus' DOM (their content lives in sibling portals), so they get
      // told directly; each one re-checks its own scope before hiding
      let parent = getParentProxy(proxy)
      while (parent !== void 0 && parent !== null) {
        if (parent.$options.name === 'QMenu' && parent.$props.hover === true) {
          parent.__qHoverHide?.(evt)
        }
        parent = getParentProxy(parent)
      }
    }

    function onHoverContentEnter(evt) {
      if (evt.pointerType !== 'touch') {
        clearHoverTimer()
      }
    }

    function handleShow(evt) {
      // a hover-triggered open must not steal focus from wherever the
      // user currently is, nor hand it anywhere when hiding
      hoverShown = props.hover && evt?.type === 'pointerenter'

      clearHoverTimer()

      refocusTarget =
        props.noRefocus || hoverShown ? null : document.activeElement

      addFocusout(onFocusout)

      showPortal()
      posEngine.handleShow()

      // touch-position latches onto the coordinates of a deliberate
      // click/tap; a hover-show's pointerenter only carries the point
      // where the pointer happened to cross the target's edge
      if (
        !hoverShown &&
        evt !== void 0 &&
        (props.touchPosition || props.contextMenu)
      ) {
        const pos = position(evt)

        if (pos.left !== void 0) {
          const { top, left } = anchorEl.value.getBoundingClientRect()

          posEngine.setAnchorPoint({
            left: pos.left - left,
            top: pos.top - top
          })
        }
      }

      if (stopPositionWatcher === void 0) {
        // with CSS anchor positioning the anchor() styles adapt on their
        // own and only the frozen flip/cap decision needs re-checking; the
        // fallback engine recomputes the whole position
        stopPositionWatcher = watch(
          () =>
            `${$q.screen.width}|${$q.screen.height}|${props.self}|` +
            `${props.anchor}|${$q.lang.rtl}`,
          () => {
            if (showing.value) posEngine.updatePosition()
          }
        )
      }

      if (!props.noFocus && !hoverShown) {
        document.activeElement.blur()
      }

      // should removeTick() if this gets removed
      registerTick(() => {
        posEngine.updatePosition()

        if (!viaCssAnchor) {
          // the anchor itself may still be animating (e.g. a push QBtn
          // springing back from :active after the click that opened us),
          // so follow it while the enter transition plays out — otherwise
          // the transition-end re-expression lands as a visible snap
          posEngine.stopAnchorTracking = trackAnchorMotion(
            () => anchorEl.value,
            posEngine.track,
            props.transitionDuration
          )
        }

        if (!props.noFocus && !hoverShown) focus()
      })

      registerTransitionEnd(() => {
        // required in order to avoid the "double-tap needed" issue
        if ($q.platform.is.ios) {
          // if auto-close, then this click should
          // not close the menu
          avoidAutoClose = props.autoClose
          innerRef.value.click()
        }

        if (!viaCssAnchor) posEngine.track()
        showPortal(true) // done showing portal
        emit('show', evt)
      })
    }

    function handleHide(evt) {
      hoverShown = false

      removeTick()
      hidePortal()
      anchorCleanup(true)

      if (
        refocusTarget !== null &&
        // menu was hidden from code or ESC plugin
        (evt === void 0 ||
          // menu was not closed from a mouse or touch clickOutside
          !evt.qClickOutside)
      ) {
        const target =
          (evt?.type.indexOf('key') === 0
            ? refocusTarget.closest('[tabindex]:not([tabindex^="-"])')
            : void 0) || refocusTarget

        refocusTarget = null
        addFocusFn(() => {
          if (target.isConnected) target.focus({ preventScroll: true })
        })
      }

      registerTransitionEnd(() => {
        hidePortal(true) // done hiding, now destroy
        posEngine.releaseAnchor(false)
        emit('hide', evt)
      })
    }

    function handleRouteChange() {
      refocusTarget = null
    }

    function anchorCleanup(hidingInProgress) {
      clearHoverTimer()
      posEngine.releaseAnchor(hidingInProgress)

      if (stopPositionWatcher !== void 0) {
        stopPositionWatcher()
        stopPositionWatcher = void 0
      }

      if (hidingInProgress || showing.value) {
        removeFocusout(onFocusout)
        removeClickOutside(clickOutsideProps)
        removeEscapeKey(onEscapeKey)
      }

      if (!hidingInProgress) {
        refocusTarget = null
      }
    }

    function onAutoClose(e) {
      // if auto-close, then the ios double-tap fix which
      // issues a click should not close the menu
      if (!avoidAutoClose) {
        closePortalMenus(proxy, e)
        emit('click', e)
      } else {
        avoidAutoClose = false
      }
    }

    function onFocusout(evt) {
      // the focus is not in a vue child component
      if (
        handlesFocus.value &&
        !props.noFocus &&
        !hoverShown &&
        !childHasFocus(innerRef.value, evt.target) &&
        !focusIsInDetachedFullscreen(innerRef.value, evt.target)
      ) {
        focus()
      }
    }

    function onEscapeKey(evt) {
      if (!props.noEscDismiss) {
        emit('escapeKey')
        hide(evt)
      }
    }

    function onPortalKeydown(evt) {
      if (
        evt.keyCode !== 9 || // TAB key
        evt.defaultPrevented ||
        !handlesFocus.value ||
        innerRef.value === null
      ) {
        return
      }

      const inner = innerRef.value
      const tabbables = inner.querySelectorAll(tabbableSelector)
      const edge =
        tabbables.length === 0
          ? null
          : tabbables[evt.shiftKey ? 0 : tabbables.length - 1]

      if (
        edge !== null &&
        document.activeElement !== edge &&
        !(evt.shiftKey && document.activeElement === inner)
      ) {
        // focus stays inside the popup
        return
      }

      // Focus is about to leave the popup, which is rendered in a portal,
      // so the default TAB action would drop focus out of the page (WAI-ARIA
      // instead expects the popup to close and focus to move on). Hand focus
      // back to the anchor control synchronously — before the default TAB
      // action runs — so the sequence continues from there, and keep our
      // focusout recapture from interfering with the handoff.
      removeFocusout(onFocusout)

      if (refocusTarget !== null && refocusTarget.isConnected) {
        const target =
          refocusTarget.closest('[tabindex]:not([tabindex^="-"])') ||
          refocusTarget
        target.focus({ preventScroll: true })
      }

      refocusTarget = null
      hide(evt)
    }

    function renderPortalContent() {
      return h(Transition, transitionProps(), () =>
        showing.value
          ? h(
              'div',
              {
                // no default ARIA role: the popup hosts arbitrary content,
                // while role="menu" only allows menuitem* children (WAI-ARIA);
                // consumers declare a role through fall-through attrs
                ...attrs,
                ref: innerRef,
                tabindex: -1,
                // chains the consumer's own keydown listener, if any
                // oxlint-disable-next-line unicorn/prefer-spread
                onKeydown: [].concat(attrs.onKeydown || [], onPortalKeydown),
                ...(props.hover
                  ? {
                      // oxlint-disable-next-line unicorn/prefer-spread
                      onPointerenter: [].concat(
                        attrs.onPointerenter || [],
                        onHoverContentEnter
                      ),
                      // oxlint-disable-next-line unicorn/prefer-spread
                      onPointerleave: [].concat(
                        attrs.onPointerleave || [],
                        hoverHide
                      )
                    }
                  : {}),
                class: [menuClass.value, attrs.class],
                style: [
                  attrs.style,
                  transitionStyle(),
                  posEngine.positionStyle.value
                ],
                ...onEvents.value
              },
              hSlot(slots.default)
            )
          : null
      )
    }

    onBeforeUnmount(() => {
      anchorCleanup(false)
    })

    // expose public methods
    Object.assign(proxy, { focus, updatePosition: posEngine.updatePosition })

    // internal: how a descendant hover menu notifies this one that the
    // pointer left it (see hoverHide)
    proxy.__qHoverHide = scheduleHoverHide

    return renderPortal
  }
})
