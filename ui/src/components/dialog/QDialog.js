import {
  Transition,
  computed,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  ref,
  watch
} from 'vue'

import useHistory from '../../composables/private.use-history/use-history.js'
import useTimeout from '../../composables/use-timeout/use-timeout.js'
import useTick from '../../composables/use-tick/use-tick.js'
import useModelToggle, {
  useModelToggleEmits,
  useModelToggleProps
} from '../../composables/private.use-model-toggle/use-model-toggle.js'
import useTransition, {
  useTransitionProps
} from '../../composables/private.use-transition/use-transition.js'
import usePortal from '../../composables/private.use-portal/use-portal.js'
import usePreventScroll from '../../composables/private.use-prevent-scroll/use-prevent-scroll.js'

import { createComponent } from '../../utils/private.create/create.js'
import { childHasFocus } from '../../utils/dom/dom.js'
import { hSlot } from '../../utils/private.render/render.js'
import {
  addEscapeKey,
  removeEscapeKey
} from '../../utils/private.keyboard/escape-key.js'
import {
  addFocusout,
  removeFocusout
} from '../../utils/private.focus/focusout.js'
import { addFocusFn } from '../../utils/private.focus/focus-manager.js'

let maximizedModals = 0

const positionClass = {
  standard: 'fixed-full flex-center',
  top: 'fixed-top justify-center',
  bottom: 'fixed-bottom justify-center',
  right: 'fixed-right items-center',
  left: 'fixed-left items-center'
}

const defaultTransitions = {
  standard: ['scale', 'scale'],
  top: ['slide-down', 'slide-up'],
  bottom: ['slide-up', 'slide-down'],
  right: ['slide-left', 'slide-right'],
  left: ['slide-right', 'slide-left']
}

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/dialog
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QDialog',

  inheritAttrs: false,

  props: {
    ...useModelToggleProps,
    ...useTransitionProps,

    /**
     * @api prop transition-show
     */
    transitionShow: String, // override useTransitionProps
    /**
     * @api prop transition-hide
     */
    transitionHide: String, // override useTransitionProps

    /**
     * User cannot dismiss Dialog if clicking outside of it or hitting ESC key; Also, an app route change won't dismiss it
     *
     * @api prop persistent
     * @type {Boolean}
     * @category behavior
     */
    persistent: Boolean,
    /**
     * Any click/tap inside of the dialog will close it
     *
     * @api prop auto-close
     * @type {Boolean}
     * @category behavior
     */
    autoClose: Boolean,
    /**
     * Allow elements outside of the Dialog to be focusable; By default, for accessibility reasons, QDialog does not allow outer focus
     *
     * @api prop allow-focus-outside
     * @type {Boolean}
     * @category behavior
     * @added-in v2.7.2
     */
    allowFocusOutside: Boolean,

    /**
     * User cannot dismiss Dialog by hitting ESC key; No need to set it if 'persistent' prop is also set
     *
     * @api prop no-esc-dismiss
     * @type {Boolean}
     * @category behavior
     */
    noEscDismiss: Boolean,
    /**
     * User cannot dismiss Dialog by clicking outside of it; No need to set it if 'persistent' prop is also set
     *
     * @api prop no-backdrop-dismiss
     * @type {Boolean}
     * @category behavior
     */
    noBackdropDismiss: Boolean,
    /**
     * Changing route app won't dismiss Dialog; No need to set it if 'persistent' prop is also set
     *
     * @api prop no-route-dismiss
     * @type {Boolean}
     * @category behavior
     */
    noRouteDismiss: Boolean,
    /**
     * (Accessibility) When Dialog gets hidden, do not refocus on the DOM element that previously had focus
     *
     * @api prop no-refocus
     * @type {Boolean}
     * @category behavior
     */
    noRefocus: Boolean,
    /**
     * (Accessibility) When Dialog gets shown, do not switch focus on it
     *
     * @api prop no-focus
     * @type {Boolean}
     * @category behavior
     */
    noFocus: Boolean,
    /**
     * Do not shake up the Dialog to catch user's attention
     *
     * @api prop no-shake
     * @type {Boolean}
     * @category behavior
     * @added-in v2.1.1
     */
    noShake: Boolean,

    /**
     * Put Dialog into seamless mode; Does not use a backdrop so user is able to interact with the rest of the page too
     *
     * @api prop seamless
     * @type {Boolean}
     * @category content
     */
    seamless: Boolean,

    /**
     * Put Dialog into maximized mode
     *
     * @api prop maximized
     * @type {Boolean}
     * @category content
     */
    maximized: Boolean,
    /**
     * Dialog will try to render with same width as the window
     *
     * @api prop full-width
     * @type {Boolean}
     * @category content
     */
    fullWidth: Boolean,
    /**
     * Dialog will try to render with same height as the window
     *
     * @api prop full-height
     * @type {Boolean}
     * @category content
     */
    fullHeight: Boolean,

    /**
     * Forces content to have squared borders
     *
     * @api prop square
     * @type {Boolean}
     * @category style
     */
    square: Boolean,

    /**
     * Apply a backdrop filter; The value needs to be the same as in the CSS specs for backdrop-filter; The examples are not an exhaustive list
     *
     * @api prop backdrop-filter
     * @type {String}
     * @category style
     * @added-in v2.15
     * @example 'blur(4px)'
     * @example 'blur(4px) saturate(150%)'
     * @example 'brightness(60%)'
     */
    backdropFilter: String,

    /**
     * Stick dialog to one of the sides (top, right, bottom or left)
     *
     * @api prop position
     * @type {String}
     * @default 'standard'
     * @category content
     */
    position: {
      type: String,
      default: 'standard',
      validator: val =>
        ['standard', 'top', 'bottom', 'left', 'right'].includes(val)
    }
  },

  emits: [...useModelToggleEmits, 'shake', 'click', 'escapeKey'],

  setup(props, { slots, emit, attrs }) {
    const vm = getCurrentInstance()

    const innerRef = ref(null)
    const showing = ref(false)
    const animating = ref(false)

    let shakeTimeout = null,
      refocusTarget = null,
      isMaximized = false,
      avoidAutoClose = false

    const hideOnRouteChange = computed(
      () => !props.persistent && !props.noRouteDismiss && !props.seamless
    )

    const { preventBodyScroll } = usePreventScroll()
    const { registerTimeout } = useTimeout()
    const { registerTick, removeTick } = useTick()

    const { transitionProps, transitionStyle } = useTransition(
      props,
      () => defaultTransitions[props.position][0],
      () => defaultTransitions[props.position][1]
    )

    const backdropStyle = computed(
      () =>
        transitionStyle.value +
        (props.backdropFilter !== void 0
          ? // Safari requires the -webkit prefix
            `;backdrop-filter:${props.backdropFilter};-webkit-backdrop-filter:${props.backdropFilter}`
          : '')
    )

    const { showPortal, hidePortal, portalIsAccessible, renderPortal } =
      usePortal(vm, innerRef, renderPortalContent, 'dialog')

    const { hide } = useModelToggle({
      showing,
      hideOnRouteChange,
      handleShow,
      handleHide,
      processOnMount: true
    })

    const { addToHistory, removeFromHistory } = useHistory(
      showing,
      hide,
      hideOnRouteChange
    )

    const classes = computed(
      () =>
        'q-dialog__inner flex no-pointer-events' +
        ` q-dialog__inner--${props.maximized ? 'maximized' : 'minimized'}` +
        ` q-dialog__inner--${props.position} ${positionClass[props.position]}` +
        (animating.value ? ' q-dialog__inner--animating' : '') +
        (props.fullWidth ? ' q-dialog__inner--fullwidth' : '') +
        (props.fullHeight ? ' q-dialog__inner--fullheight' : '') +
        (props.square ? ' q-dialog__inner--square' : '')
    )

    const useBackdrop = computed(() => showing.value && !props.seamless)

    const onEvents = computed(() =>
      props.autoClose ? { onClick: onAutoClose } : {}
    )

    const rootClasses = computed(() => [
      'q-dialog fullscreen no-pointer-events ' +
        `q-dialog--${useBackdrop.value ? 'modal' : 'seamless'}`,
      attrs.class
    ])

    watch(
      () => props.maximized,
      state => {
        if (showing.value) updateMaximized(state)
      }
    )

    watch(useBackdrop, val => {
      preventBodyScroll(val)

      if (val) {
        addFocusout(onFocusChange)
        addEscapeKey(onEscapeKey)
      } else {
        removeFocusout(onFocusChange)
        removeEscapeKey(onEscapeKey)
      }
    })

    function handleShow(evt) {
      addToHistory()

      refocusTarget =
        !props.noRefocus && document.activeElement !== null
          ? document.activeElement
          : null

      updateMaximized(props.maximized)
      showPortal()
      animating.value = true

      if (props.noFocus) removeTick()
      else {
        document.activeElement?.blur()
        registerTick(focus)
      }

      // should removeTimeout() if this gets removed
      registerTimeout(() => {
        if (vm.proxy.$q.platform.is.ios) {
          if (!props.seamless && document.activeElement) {
            const { top, bottom } =
                document.activeElement.getBoundingClientRect(),
              { innerHeight } = window,
              height =
                window.visualViewport !== void 0
                  ? window.visualViewport.height
                  : innerHeight

            if (top > 0 && bottom > height / 2) {
              document.scrollingElement.scrollTop = Math.min(
                document.scrollingElement.scrollHeight - height,
                bottom >= innerHeight
                  ? Infinity
                  : Math.ceil(
                      document.scrollingElement.scrollTop + bottom - height / 2
                    )
              )
            }

            document.activeElement.scrollIntoView()
          }

          // required in order to avoid the "double-tap needed" issue
          avoidAutoClose = true
          innerRef.value.click()
          avoidAutoClose = false
        }

        showPortal(true) // done showing portal
        animating.value = false
        emit('show', evt)
      }, props.transitionDuration)
    }

    function handleHide(evt) {
      removeTick()
      removeFromHistory()
      cleanup(true)
      animating.value = true
      hidePortal()

      if (refocusTarget !== null) {
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
        animating.value = false
        emit('hide', evt)
      }, props.transitionDuration)
    }

    /**
     * Focus dialog; if you have content with autofocus attribute, it will directly focus it
     *
     * @api method focus
     * @param {String} [selector] Optional CSS selector to override default focusable element
     */
    function focus(selector) {
      addFocusFn(() => {
        let node = innerRef.value

        if (node === null) return

        if (selector !== void 0) {
          const target = node.querySelector(selector)
          if (target !== null) {
            target.focus({ preventScroll: true })
            return
          }
        }

        if (!node.contains(document.activeElement)) {
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

    /**
     * Shakes dialog
     *
     * @api method shake
     * @param {Element} focusTarget Optional DOM Element to be focused after shake
     */
    function shake(focusTarget) {
      if (focusTarget && typeof focusTarget.focus === 'function') {
        focusTarget.focus({ preventScroll: true })
      } else {
        focus()
      }

      emit('shake')

      const node = innerRef.value

      if (node !== null) {
        node.classList.remove('q-animate--scale')
        node.classList.add('q-animate--scale')
        if (shakeTimeout !== null) clearTimeout(shakeTimeout)
        shakeTimeout = setTimeout(() => {
          shakeTimeout = null
          if (innerRef.value !== null) {
            node.classList.remove('q-animate--scale')
            // some platforms (like desktop Chrome)
            // require calling focus() again
            focus()
          }
        }, 170)
      }
    }

    function onEscapeKey() {
      if (!props.seamless) {
        if (props.persistent || props.noEscDismiss) {
          if (!props.maximized && !props.noShake) shake()
        } else {
          emit('escapeKey')
          hide()
        }
      }
    }

    function cleanup(hiding) {
      if (shakeTimeout !== null) {
        clearTimeout(shakeTimeout)
        shakeTimeout = null
      }

      if (hiding || showing.value) {
        updateMaximized(false)

        if (!props.seamless) {
          preventBodyScroll(false)
          removeFocusout(onFocusChange)
          removeEscapeKey(onEscapeKey)
        }
      }

      if (!hiding) {
        refocusTarget = null
      }
    }

    function updateMaximized(active) {
      if (active) {
        if (!isMaximized) {
          if (maximizedModals < 1) {
            document.body.classList.add('q-body--dialog')
          }
          maximizedModals++

          isMaximized = true
        }
      } else if (isMaximized) {
        if (maximizedModals < 2) {
          document.body.classList.remove('q-body--dialog')
        }

        maximizedModals--
        isMaximized = false
      }
    }

    function onAutoClose(e) {
      if (!avoidAutoClose) {
        hide(e)
        emit('click', e)
      }
    }

    function onBackdropClick(e) {
      if (!props.persistent && !props.noBackdropDismiss) {
        hide(e)
      } else if (!props.noShake) {
        shake()
      }
    }

    function onFocusChange(evt) {
      // the focus is not in a vue child component
      if (
        !props.allowFocusOutside &&
        portalIsAccessible.value &&
        !childHasFocus(innerRef.value, evt.target)
      ) {
        focus('[tabindex]:not([tabindex="-1"])')
      }
    }

    Object.assign(vm.proxy, {
      // expose public methods
      focus,
      shake,

      // private but needed by QSelect
      __updateRefocusTarget(target) {
        refocusTarget = target || null
      }
    })

    onBeforeUnmount(cleanup)

    function renderPortalContent() {
      return h(
        'div',
        {
          role: 'dialog',
          'aria-modal': useBackdrop.value ? 'true' : 'false',
          ...attrs,
          class: rootClasses.value
        },
        [
          h(
            Transition,
            {
              name: 'q-transition--fade',
              appear: true
            },
            () =>
              useBackdrop.value
                ? h('div', {
                    class: 'q-dialog__backdrop fixed-full',
                    style: backdropStyle.value,
                    'aria-hidden': 'true',
                    onClick: onBackdropClick
                  })
                : null
          ),

          h(Transition, transitionProps.value, () =>
            showing.value
              ? h(
                  'div',
                  {
                    ref: innerRef,
                    class: classes.value,
                    style: transitionStyle.value,
                    tabindex: -1,
                    ...onEvents.value
                  },
                  hSlot(slots.default)
                )
              : null
          )
        ]
      )
    }

    return renderPortal
  }
})
