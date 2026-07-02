import {
  Transition,
  computed,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  ref,
  watch
} from 'vue'

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
import useTimeout from '../../composables/use-timeout/use-timeout.js'

import { createComponent } from '../../utils/private.create/create.js'
import { closePortalMenus } from '../../utils/private.portal/portal.js'
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
  parsePosition,
  setPosition,
  validateOffset,
  validatePosition
} from '../../utils/private.position-engine/position-engine.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/menu
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QMenu',

  inheritAttrs: false,

  props: {
    ...useAnchorProps,
    ...useModelToggleProps,
    ...useDarkProps,
    ...useTransitionProps,

    /**
     * Allows the menu to not be dismissed by a click/tap outside of the menu or by hitting the ESC key; Also, an app route change won't dismiss it
     *
     * @api prop persistent
     * @type {Boolean}
     * @category behavior
     */
    persistent: Boolean,
    /**
     * Allows any click/tap in the menu to close it; Useful instead of attaching events to each menu item that should close the menu on click/tap
     *
     * @api prop auto-close
     * @type {Boolean}
     * @category behavior
     */
    autoClose: Boolean,
    /**
     * Separate from parent menu, marking it as a separate closing point for v-close-popup (without this, chained menus close all together)
     *
     * @api prop separate-close-popup
     * @type {Boolean}
     * @category behavior
     */
    separateClosePopup: Boolean,
    /**
     * User cannot dismiss the popup by hitting ESC key; No need to set it if 'persistent' prop is also set
     *
     * @api prop no-esc-dismiss
     * @type {Boolean}
     * @category behavior
     * @added-in v2.18
     */
    noEscDismiss: Boolean,
    /**
     * Changing route app won't dismiss the popup; No need to set it if 'persistent' prop is also set
     *
     * @api prop no-route-dismiss
     * @type {Boolean}
     * @category behavior
     */
    noRouteDismiss: Boolean,
    /**
     * (Accessibility) When Menu gets hidden, do not refocus on the DOM element that previously had focus
     *
     * @api prop no-refocus
     * @type {Boolean}
     * @category behavior
     */
    noRefocus: Boolean,
    /**
     * (Accessibility) When Menu gets shown, do not switch focus on it
     *
     * @api prop no-focus
     * @type {Boolean}
     * @category behavior
     */
    noFocus: Boolean,

    /**
     * Allows the menu to match at least the full width of its target
     *
     * @api prop fit
     * @type {Boolean}
     * @category position
     */
    fit: Boolean,
    /**
     * Allows the menu to cover its target. When used, the 'self' and 'fit' props are no longer effective
     *
     * @api prop cover
     * @type {Boolean}
     * @category position
     */
    cover: Boolean,

    /**
     * Forces content to have squared borders
     *
     * @api prop square
     * @type {Boolean}
     * @category style
     */
    square: Boolean,

    /**
     * Two values setting the starting position or anchor point of the menu relative to its target
     *
     * @api prop anchor
     * @type {String}
     * @category position
     */
    anchor: {
      type: String,
      validator: validatePosition
    },
    /**
     * Two values setting the menu's own position relative to its target
     *
     * @api prop self
     * @type {String}
     * @category position
     */
    self: {
      type: String,
      validator: validatePosition
    },
    /**
     * An array of two numbers to offset the menu horizontally and vertically in pixels
     *
     * @api prop offset
     * @type {Array}
     * @category position
     * @example [8, 8]
     * @example [5, 10]
     */
    offset: {
      type: Array,
      validator: validateOffset
    },

    /**
     * @api prop scroll-target
     * @extends scroll-target
     */
    scrollTarget: scrollTargetProp,

    /**
     * Allows for the target position to be set by the mouse position, when the target of the menu is either clicked or touched
     *
     * @api prop touch-position
     * @type {Boolean}
     * @category behavior
     */
    touchPosition: Boolean,

    /**
     * The maximum height of the menu; Size in CSS units, including unit name
     *
     * @api prop max-height
     * @extends size
     * @default null
     * @category style
     */
    maxHeight: {
      type: String,
      default: null
    },
    /**
     * The maximum width of the menu; Size in CSS units, including unit name
     *
     * @api prop max-width
     * @extends size
     * @default null
     * @category style
     */
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
      avoidAutoClose

    const vm = getCurrentInstance()
    const { proxy } = vm
    const { $q } = proxy

    const innerRef = ref(null)
    const showing = ref(false)

    const hideOnRouteChange = computed(
      () => !props.persistent && !props.noRouteDismiss
    )

    const isDark = useDark(props, $q)
    const { registerTick, removeTick } = useTick()
    const { registerTimeout } = useTimeout()
    const { transitionProps, transitionStyle } = useTransition(props)
    const { localScrollTarget, changeScrollEvent, unconfigureScrollTarget } =
      useScrollTarget(props, configureScrollTarget)

    const { anchorEl, canShow } = useAnchor({ showing })

    const { hide } = useModelToggle({
      showing,
      canShow,
      handleShow,
      handleHide,
      hideOnRouteChange,
      processOnMount: true
    })

    const { showPortal, hidePortal, renderPortal } = usePortal(
      vm,
      innerRef,
      renderPortalContent,
      'menu'
    )

    const clickOutsideProps = {
      anchorEl,
      innerRef,
      onClickOutside(e) {
        if (!props.persistent && showing.value) {
          hide(e)

          if (
            // always prevent touch event
            e.type === 'touchstart' ||
            // prevent click if it's on a dialog backdrop
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
        (isDark.value ? ' q-menu--dark q-dark' : '')
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

    /**
     * Focus menu; if you have content with autofocus attribute, it will directly focus it
     *
     * @api method focus
     */
    function focus() {
      addFocusFn(() => {
        let node = innerRef.value

        if (node && !node.contains(document.activeElement)) {
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

    function handleShow(evt) {
      refocusTarget = props.noRefocus ? null : document.activeElement

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

      if (!props.noFocus) {
        document.activeElement.blur()
      }

      // should removeTick() if this gets removed
      registerTick(() => {
        updatePosition()
        if (!props.noFocus) focus()
      })

      // should removeTimeout() if this gets removed
      registerTimeout(() => {
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
      }, props.transitionDuration)
    }

    function handleHide(evt) {
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
        ;(
          (evt?.type.indexOf('key') === 0
            ? refocusTarget.closest('[tabindex]:not([tabindex^="-"])')
            : void 0) || refocusTarget
        ).focus()

        refocusTarget = null
      }

      // should removeTimeout() if this gets removed
      registerTimeout(() => {
        hidePortal(true) // done hiding, now destroy
        emit('hide', evt)
      }, props.transitionDuration)
    }

    function anchorCleanup(hiding) {
      absoluteOffset = void 0

      if (unwatchPosition !== void 0) {
        unwatchPosition()
        unwatchPosition = void 0
      }

      if (hiding || showing.value) {
        removeFocusout(onFocusout)
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
        !childHasFocus(innerRef.value, evt.target)
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

    /**
     * There are some custom scenarios for which Quasar cannot automatically reposition the menu without significant performance drawbacks so the optimal solution is for you to call this method when you need it
     *
     * @api method updatePosition
     */
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
      return h(Transition, transitionProps.value, () =>
        showing.value
          ? h(
              'div',
              {
                role: 'menu',
                ...attrs,
                ref: innerRef,
                tabindex: -1,
                class: [
                  'q-menu q-position-engine scroll' + menuClass.value,
                  attrs.class
                ],
                style: [attrs.style, transitionStyle.value],
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

    return renderPortal
  }
})
