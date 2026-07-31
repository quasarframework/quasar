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
import { focusIsInDetachedFullscreen } from '../../utils/private.focus/detached-fullscreen.js'

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

export default createComponent({
  name: 'QDialog',

  inheritAttrs: false,

  props: {
    ...useModelToggleProps,
    ...useTransitionProps,

    transitionShow: String, // override useTransitionProps
    transitionHide: String, // override useTransitionProps

    persistent: Boolean,
    autoClose: Boolean,
    allowFocusOutside: Boolean,

    noEscDismiss: Boolean,
    noBackdropDismiss: Boolean,
    noRouteDismiss: Boolean,
    noRefocus: Boolean,
    noFocus: Boolean,
    noShake: Boolean,

    seamless: Boolean,

    maximized: Boolean,
    fullWidth: Boolean,
    fullHeight: Boolean,

    square: Boolean,

    backdropFilter: String,

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
      handleRouteChange,
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
        const target =
          (evt?.type.indexOf('key') === 0
            ? refocusTarget.closest('[tabindex]:not([tabindex^="-"])')
            : void 0) || refocusTarget

        refocusTarget = null
        addFocusFn(() => {
          if (target.isConnected) target.focus({ preventScroll: true })
        })
      }

      // should removeTimeout() if this gets removed
      registerTimeout(() => {
        hidePortal(true) // done hiding, now destroy
        animating.value = false
        emit('hide', evt)
      }, props.transitionDuration)
    }

    function handleRouteChange() {
      refocusTarget = null
    }

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
        !childHasFocus(innerRef.value, evt.target) &&
        !focusIsInDetachedFullscreen(innerRef.value, evt.target)
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
