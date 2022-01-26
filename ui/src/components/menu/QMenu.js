import { h, ref, computed, watch, Transition, onBeforeUnmount, getCurrentInstance } from 'vue'

import useAnchor, { useAnchorProps } from '../../composables/private/use-anchor.js'
import useScrollTarget from '../../composables/private/use-scroll-target.js'
import useModelToggle, { useModelToggleProps, useModelToggleEmits } from '../../composables/private/use-model-toggle.js'
import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import usePortal from '../../composables/private/use-portal.js'
import useTransition, { useTransitionProps } from '../../composables/private/use-transition.js'
import useTick from '../../composables/private/use-tick.js'
import useTimeout from '../../composables/private/use-timeout.js'

import { createComponent } from '../../utils/private/create.js'
import { closePortalMenus } from '../../utils/private/portal.js'
import { getScrollTarget } from '../../utils/scroll.js'
import { position, stopAndPrevent } from '../../utils/event.js'
import { hSlot } from '../../utils/private/render.js'
import { addEscapeKey, removeEscapeKey } from '../../utils/private/escape-key.js'
import { addFocusout, removeFocusout } from '../../utils/private/focusout.js'
import { childHasFocus } from '../../utils/dom.js'
import { addClickOutside, removeClickOutside } from '../../utils/private/click-outside.js'
import { addFocusFn } from '../../utils/private/focus-manager.js'

import {
  validatePosition, validateOffset, setPosition, parsePosition
} from '../../utils/private/position-engine.js'

export default createComponent({
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

    scrollTarget: {
      default: void 0
    },

    touchPosition: Boolean,

    maxHeight: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null
    }
  },

  emits: [
    ...useModelToggleEmits,
    'click', 'escape-key'
  ],

  setup (props, { slots, emit, attrs }) {
    let refocusTarget = null, absoluteOffset, unwatchPosition, avoidAutoClose

    const vm = getCurrentInstance()
    const { proxy } = vm
    const { $q } = proxy

    const innerRef = ref(null)
    const showing = ref(false)

    const hideOnRouteChange = computed(() =>
      props.persistent !== true
      && props.noRouteDismiss !== true
    )

    const isDark = useDark(props, $q)
    const { registerTick, removeTick } = useTick()
    const { registerTimeout, removeTimeout } = useTimeout()
    const { transition, transitionStyle } = useTransition(props, showing)
    const { localScrollTarget, changeScrollEvent, unconfigureScrollTarget } = useScrollTarget(props, configureScrollTarget)

    const { anchorEl, canShow } = useAnchor({ showing })

    const { hide } = useModelToggle({
      showing, canShow, handleShow, handleHide,
      hideOnRouteChange,
      processOnMount: true
    })

    const { showPortal, hidePortal, renderPortal } = usePortal(vm, innerRef, renderPortalContent)

    const clickOutsideProps = {
      anchorEl,
      innerRef,
      onClickOutside (e) {
        if (props.persistent !== true && showing.value === true) {
          hide(e)

          if (
            // always prevent touch event
            e.type === 'touchstart'
            // prevent click if it's on a dialog backdrop
            || e.target.classList.contains('q-dialog__backdrop')
          ) {
            stopAndPrevent(e)
          }

          return true
        }
      }
    }

    const anchorOrigin = computed(() =>
      parsePosition(
        props.anchor || (
          props.cover === true ? 'center middle' : 'bottom start'
        ),
        $q.lang.rtl
      )
    )

    const selfOrigin = computed(() => (
      props.cover === true
        ? anchorOrigin.value
        : parsePosition(props.self || 'top start', $q.lang.rtl)
    ))

    const menuClass = computed(() =>
      (props.square === true ? ' q-menu--square' : '')
      + (isDark.value === true ? ' q-menu--dark q-dark' : '')
    )

    const onEvents = computed(() => (
      props.autoClose === true
        ? { onClick: onAutoClose }
        : {}
    ))

    const handlesFocus = computed(() =>
      showing.value === true && props.persistent !== true
    )

    watch(handlesFocus, val => {
      if (val === true) {
        addEscapeKey(onEscapeKey)
        addClickOutside(clickOutsideProps)
      }
      else {
        removeEscapeKey(onEscapeKey)
        removeClickOutside(clickOutsideProps)
      }
    })

    function focus () {
      addFocusFn(() => {
        let node = innerRef.value

        if (node && node.contains(document.activeElement) !== true) {
          node = node.querySelector('[autofocus], [data-autofocus]') || node
          node.focus({ preventScroll: true })
        }
      })
    }

    function handleShow (evt) {
      removeTick()
      removeTimeout()

      refocusTarget = props.noRefocus === false
        ? document.activeElement
        : null

      addFocusout(onFocusout)

      showPortal()
      configureScrollTarget()

      absoluteOffset = void 0

      if (evt !== void 0 && (props.touchPosition || props.contextMenu)) {
        const pos = position(evt)

        if (pos.left !== void 0) {
          const { top, left } = anchorEl.value.getBoundingClientRect()
          absoluteOffset = { left: pos.left - left, top: pos.top - top }
        }
      }

      if (unwatchPosition === void 0) {
        unwatchPosition = watch(
          () => $q.screen.width + '|' + $q.screen.height + '|' + props.self + '|' + props.anchor + '|' + $q.lang.rtl,
          updatePosition
        )
      }

      if (props.noFocus !== true) {
        document.activeElement.blur()
      }

      registerTick(() => {
        updatePosition()
        props.noFocus !== true && focus()
      })

      registerTimeout(() => {
        // required in order to avoid the "double-tap needed" issue
        if ($q.platform.is.ios === true) {
          // if auto-close, then this click should
          // not close the menu
          avoidAutoClose = props.autoClose
          innerRef.value.click()
        }

        updatePosition()
        showPortal(true) // done showing portal
        emit('show', evt)
      }, props.transitionDuration)
    }

    function handleHide (evt) {
      removeTick()
      removeTimeout()

      anchorCleanup(true)

      if (
        refocusTarget !== null
        && (
          // menu was hidden from code or ESC plugin
          evt === void 0
          // menu was not closed from a mouse or touch clickOutside
          || evt.qClickOutside !== true
        )
      ) {
        refocusTarget.focus()
        refocusTarget = null
      }

      registerTimeout(() => {
        hidePortal()
        emit('hide', evt)
      }, props.transitionDuration)
    }

    function anchorCleanup (hiding) {
      absoluteOffset = void 0

      if (unwatchPosition !== void 0) {
        unwatchPosition()
        unwatchPosition = void 0
      }

      if (hiding === true || showing.value === true) {
        removeFocusout(onFocusout)
        unconfigureScrollTarget()
        removeClickOutside(clickOutsideProps)
        removeEscapeKey(onEscapeKey)
      }

      if (hiding !== true) {
        refocusTarget = null
      }
    }

    function configureScrollTarget () {
      if (anchorEl.value !== null || props.scrollTarget !== void 0) {
        localScrollTarget.value = getScrollTarget(anchorEl.value, props.scrollTarget)
        changeScrollEvent(localScrollTarget.value, updatePosition)
      }
    }

    function onAutoClose (e) {
      // if auto-close, then the ios double-tap fix which
      // issues a click should not close the menu
      if (avoidAutoClose !== true) {
        closePortalMenus(proxy, e)
        emit('click', e)
      }
      else {
        avoidAutoClose = false
      }
    }

    function onFocusout (evt) {
      // the focus is not in a vue child component
      if (
        handlesFocus.value === true
        && props.noFocus !== true
        && childHasFocus(innerRef.value, evt.target) !== true
      ) {
        focus()
      }
    }

    function onEscapeKey (evt) {
      emit('escape-key')
      hide(evt)
    }

    function updatePosition () {
      const el = innerRef.value

      if (el === null || anchorEl.value === null) {
        return
      }

      setPosition({
        el,
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

    function renderPortalContent () {
      return h(
        Transition,
        { name: transition.value, appear: true },
        () => (
          showing.value === true
            ? h('div', {
                ...attrs,
                ref: innerRef,
                tabindex: -1,
                class: [
                  'q-menu q-position-engine scroll' + menuClass.value,
                  attrs.class
                ],
                style: [
                  attrs.style,
                  transitionStyle.value
                ],
                ...onEvents.value
              }, hSlot(slots.default))
            : null
        )
      )
    }

    onBeforeUnmount(anchorCleanup)

    // expose public methods
    Object.assign(proxy, { focus, updatePosition })

    return renderPortal
  }
})
