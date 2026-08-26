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
import useScrollTarget from '../../composables/private.use-scroll-target/use-scroll-target.js'
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
import { getScrollTarget, scrollTargetProp } from '../../utils/scroll/scroll.js'
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
  parsePosition,
  setPosition,
  trackAnchorMotion,
  validateOffset,
  validatePosition
} from '../../utils/private.position-engine/position-engine.js'

const tabbableSelector =
  'a[href], button:not([disabled]), input:not([disabled]),' +
  ' select:not([disabled]), textarea:not([disabled]),' +
  ' [tabindex]:not([tabindex^="-"])'

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

    scrollTarget: scrollTargetProp,

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
    let refocusTarget = null,
      absoluteOffset,
      unwatchPosition,
      stopAnchorTracking,
      avoidAutoClose,
      hoverTimer = null,
      // set while the current "show" was triggered by hovering the anchor,
      // in which case the menu must leave focus wherever it already is
      hoverShown = false

    const vm = getCurrentInstance()
    const { proxy } = vm
    const $q = useQuasar()

    const innerRef = ref(null)
    const showing = ref(false)

    const hideOnRouteChange = computed(
      () => !props.persistent && !props.noRouteDismiss
    )

    const isDark = useDark(props, $q)
    const { registerTick, removeTick } = useTick()
    const { registerTransitionEnd } = useTransitionEnd(props)
    const { transitionProps, transitionStyle } = useTransition(props)
    const { localScrollTarget, changeScrollEvent, unconfigureScrollTarget } =
      useScrollTarget(props, configureScrollTarget)

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

    const menuClass = computed(
      () =>
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
      addDetachedFullscreenListener(onDetachedFullscreenChange)

      showPortal()
      configureScrollTarget()

      absoluteOffset = void 0

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
          absoluteOffset = { left: pos.left - left, top: pos.top - top }
        }
      }

      if (unwatchPosition === void 0) {
        unwatchPosition = watch(
          () =>
            $q.screen.width +
            '|' +
            $q.screen.height +
            '|' +
            props.self +
            '|' +
            props.anchor +
            '|' +
            $q.lang.rtl,
          updatePosition
        )
      }

      if (!props.noFocus && !hoverShown) {
        document.activeElement.blur()
      }

      // should removeTick() if this gets removed
      registerTick(() => {
        updatePosition()

        // the anchor itself may still be animating (e.g. a push QBtn
        // springing back from :active after the click that opened us),
        // so follow it while the enter transition plays out — otherwise
        // the transition-end updatePosition() lands as a visible snap
        stopAnchorTracking = trackAnchorMotion(
          () => anchorEl.value,
          updatePosition,
          props.transitionDuration
        )

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

        updatePosition()
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
        emit('hide', evt)
      })
    }

    function handleRouteChange() {
      refocusTarget = null
    }

    function anchorCleanup(hiding) {
      clearHoverTimer()
      absoluteOffset = void 0

      if (unwatchPosition !== void 0) {
        unwatchPosition()
        unwatchPosition = void 0
      }

      if (stopAnchorTracking !== void 0) {
        stopAnchorTracking()
        stopAnchorTracking = void 0
      }

      if (hiding || showing.value) {
        removeFocusout(onFocusout)
        removeDetachedFullscreenListener(onDetachedFullscreenChange)
        unconfigureScrollTarget()
        removeClickOutside(clickOutsideProps)
        removeEscapeKey(onEscapeKey)
      }

      if (!hiding) {
        refocusTarget = null
      }
    }

    function configureScrollTarget() {
      if (anchorEl.value !== null || props.scrollTarget !== void 0) {
        localScrollTarget.value = getScrollTarget(
          anchorEl.value,
          props.scrollTarget
        )
        changeScrollEvent(localScrollTarget.value, updatePosition)
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

    function onDetachedFullscreenChange() {
      // useFullscreen() moved a subtree to <body> (or moved it back); if the
      // anchor traveled with it, the position measured at show time and the
      // scroll target bound to the old ancestor chain are both stale (#18513).
      // The notification fires before the DOM settles (enter: before the
      // fullscreen styles apply; exit: before the element is restored), so
      // re-measure only after the move and the re-render are done.
      nextTick(() => {
        requestAnimationFrame(() => {
          if (
            !showing.value ||
            anchorEl.value === null ||
            !anchorEl.value.isConnected
          ) {
            return
          }

          unconfigureScrollTarget()
          configureScrollTarget()
          updatePosition()
        })
      })
    }

    function updatePosition() {
      setPosition({
        targetEl: innerRef.value,
        offset: props.offset,
        anchorEl: anchorEl.value,
        anchorOrigin: anchorOrigin.value,
        selfOrigin: selfOrigin.value,
        absoluteOffset,
        fit: props.fit,
        cover: props.cover,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth
      })
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
                class: [
                  'q-menu q-position-engine scroll' + menuClass.value,
                  attrs.class
                ],
                style: [attrs.style, transitionStyle()],
                ...onEvents.value
              },
              hSlot(slots.default)
            )
          : null
      )
    }

    onBeforeUnmount(() => {
      anchorCleanup()
    })

    // expose public methods
    Object.assign(proxy, { focus, updatePosition })

    // internal: how a descendant hover menu notifies this one that the
    // pointer left it (see hoverHide)
    proxy.__qHoverHide = scheduleHoverHide

    return renderPortal
  }
})
