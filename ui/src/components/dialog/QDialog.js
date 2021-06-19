import { h, defineComponent, ref, computed, watch, onBeforeUnmount, nextTick, Transition, getCurrentInstance } from 'vue'

import useHistory from '../../composables/private/use-history.js'
import useTimeout from '../../composables/private/use-timeout.js'
import useTick from '../../composables/private/use-tick.js'
import useModelToggle, { useModelToggleProps, useModelToggleEmits } from '../../composables/private/use-model-toggle.js'
import { useTransitionProps } from '../../composables/private/use-transition.js'
import usePortal from '../../composables/private/use-portal.js'
import usePreventScroll from '../../composables/private/use-prevent-scroll.js'

import { childHasFocus } from '../../utils/dom.js'
import { hSlot } from '../../utils/private/render.js'
import { addEscapeKey, removeEscapeKey } from '../../utils/private/escape-key.js'
import { addFocusout, removeFocusout } from '../../utils/private/focusout.js'
import { addFocusFn } from '../../utils/private/focus-manager.js'

let maximizedModals = 0

const positionClass = {
  standard: 'fixed-full flex-center',
  top: 'fixed-top justify-center',
  bottom: 'fixed-bottom justify-center',
  right: 'fixed-right items-center',
  left: 'fixed-left items-center'
}

const transitions = {
  standard: [ 'scale', 'scale' ],
  top: [ 'slide-down', 'slide-up' ],
  bottom: [ 'slide-up', 'slide-down' ],
  right: [ 'slide-left', 'slide-right' ],
  left: [ 'slide-right', 'slide-left' ]
}

export default defineComponent({
  name: 'QDialog',

  inheritAttrs: false,

  props: {
    ...useModelToggleProps,
    ...useTransitionProps,

    transitionShow: String,
    transitionHide: String,

    persistent: Boolean,
    autoClose: Boolean,

    noEscDismiss: Boolean,
    noBackdropDismiss: Boolean,
    noRouteDismiss: Boolean,
    noRefocus: Boolean,
    noFocus: Boolean,

    seamless: Boolean,

    maximized: Boolean,
    fullWidth: Boolean,
    fullHeight: Boolean,

    square: Boolean,

    position: {
      type: String,
      default: 'standard',
      validator: val => val === 'standard'
        || [ 'top', 'bottom', 'left', 'right' ].includes(val)
    }
  },

  emits: [
    ...useModelToggleEmits,
    'shake', 'click', 'escape-key'
  ],

  setup (props, { slots, emit, attrs }) {
    const vm = getCurrentInstance()

    const innerRef = ref(null)
    const showing = ref(false)
    const transitionState = ref(false)
    const animating = ref(false)

    let shakeTimeout, refocusTarget = null, isMaximized, avoidAutoClose

    const hideOnRouteChange = computed(() =>
      props.persistent !== true
      && props.noRouteDismiss !== true
      && props.seamless !== true
    )

    const { preventBodyScroll } = usePreventScroll()
    const { registerTimeout, removeTimeout } = useTimeout()
    const { registerTick, removeTick, prepareTick } = useTick()

    const { showPortal, hidePortal, portalIsActive, renderPortal } = usePortal(
      vm, innerRef, renderPortalContent, /* pls do check if on a global dialog */ true
    )

    const { hide } = useModelToggle({
      showing,
      hideOnRouteChange,
      handleShow,
      handleHide,
      processOnMount: true
    })

    const { addToHistory, removeFromHistory } = useHistory(showing, hide, hideOnRouteChange)

    const classes = computed(() =>
      'q-dialog__inner flex no-pointer-events'
      + ` q-dialog__inner--${ props.maximized === true ? 'maximized' : 'minimized' }`
      + ` q-dialog__inner--${ props.position } ${ positionClass[ props.position ] }`
      + (animating.value === true ? ' q-dialog__inner--animating' : '')
      + (props.fullWidth === true ? ' q-dialog__inner--fullwidth' : '')
      + (props.fullHeight === true ? ' q-dialog__inner--fullheight' : '')
      + (props.square === true ? ' q-dialog__inner--square' : '')
    )

    const transitionShow = computed(() =>
      'q-transition--'
      + (props.transitionShow === void 0 ? transitions[ props.position ][ 0 ] : props.transitionShow)
    )

    const transitionHide = computed(() =>
      'q-transition--'
      + (props.transitionHide === void 0 ? transitions[ props.position ][ 1 ] : props.transitionHide)
    )

    const transition = computed(() => (
      transitionState.value === true
        ? transitionHide.value
        : transitionShow.value
    ))

    const useBackdrop = computed(() => showing.value === true && props.seamless !== true)

    const onEvents = computed(() => (
      props.autoClose === true
        ? { onClick: onAutoClose }
        : {}
    ))

    const rootClasses = computed(() => [
      'q-dialog fullscreen no-pointer-events '
        + `q-dialog--${ useBackdrop.value === true ? 'modal' : 'seamless' }`,
      attrs.class
    ])

    watch(showing, val => {
      nextTick(() => {
        transitionState.value = val
      })
    })

    watch(() => props.maximized, state => {
      showing.value === true && updateMaximized(state)
    })

    watch(useBackdrop, val => {
      preventBodyScroll(val)

      if (val === true) {
        addFocusout(onFocusChange)
        addEscapeKey(onEscapeKey)
      }
      else {
        removeFocusout(onFocusChange)
        removeEscapeKey(onEscapeKey)
      }
    })

    function handleShow (evt) {
      removeTimeout()
      removeTick()
      addToHistory()

      refocusTarget = props.noRefocus === false && document.activeElement !== null
        ? document.activeElement
        : null

      updateMaximized(props.maximized)
      showPortal()
      animating.value = true

      if (props.noFocus !== true) {
        document.activeElement !== null && document.activeElement.blur()
        registerTick(focus)
        prepareTick()
      }

      registerTimeout(() => {
        if (vm.proxy.$q.platform.is.ios === true) {
          if (props.seamless !== true && document.activeElement) {
            const
              { top, bottom } = document.activeElement.getBoundingClientRect(),
              { innerHeight } = window,
              height = window.visualViewport !== void 0
                ? window.visualViewport.height
                : innerHeight

            if (top > 0 && bottom > height / 2) {
              document.scrollingElement.scrollTop = Math.min(
                document.scrollingElement.scrollHeight - height,
                bottom >= innerHeight
                  ? Infinity
                  : Math.ceil(document.scrollingElement.scrollTop + bottom - height / 2)
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

    function handleHide (evt) {
      removeTimeout()
      removeTick()
      removeFromHistory()
      cleanup(true)
      animating.value = true

      if (refocusTarget !== null) {
        refocusTarget.focus()
      }

      registerTimeout(() => {
        hidePortal()
        animating.value = false
        emit('hide', evt)
      }, props.transitionDuration)
    }

    function focus () {
      addFocusFn(() => {
        let node = innerRef.value

        if (node === null || node.contains(document.activeElement) === true) {
          return
        }

        node = node.querySelector('[autofocus], [data-autofocus]') || node
        node.focus()
      })
    }

    function shake () {
      focus()
      emit('shake')

      const node = innerRef.value

      if (node !== null) {
        node.classList.remove('q-animate--scale')
        node.classList.add('q-animate--scale')
        clearTimeout(shakeTimeout)
        shakeTimeout = setTimeout(() => {
          if (innerRef.value !== null) {
            node.classList.remove('q-animate--scale')
            // some platforms (like desktop Chrome)
            // require calling focus() again
            focus()
          }
        }, 170)
      }
    }

    function onEscapeKey () {
      if (props.seamless !== true) {
        if (props.persistent === true || props.noEscDismiss === true) {
          props.maximized !== true && shake()
        }
        else {
          emit('escape-key')
          hide()
        }
      }
    }

    function cleanup (hiding) {
      clearTimeout(shakeTimeout)

      if (hiding === true || showing.value === true) {
        updateMaximized(false)

        if (props.seamless !== true) {
          preventBodyScroll(false)
          removeFocusout(onFocusChange)
          removeEscapeKey(onEscapeKey)
        }
      }
    }

    function updateMaximized (active) {
      if (active === true) {
        if (isMaximized !== true) {
          maximizedModals < 1 && document.body.classList.add('q-body--dialog')
          maximizedModals++

          isMaximized = true
        }
      }
      else if (isMaximized === true) {
        if (maximizedModals < 2) {
          document.body.classList.remove('q-body--dialog')
        }

        maximizedModals--
        isMaximized = false
      }
    }

    function onAutoClose (e) {
      if (avoidAutoClose !== true) {
        hide(e)
        emit('click', e)
      }
    }

    function onBackdropClick (e) {
      if (props.persistent !== true && props.noBackdropDismiss !== true) {
        hide(e)
      }
      else {
        shake()
      }
    }

    function onFocusChange (evt) {
      // the focus is not in a vue child component
      if (
        showing.value === true
        && portalIsActive.value === true
        && childHasFocus(innerRef.value, evt.target) !== true
      ) {
        focus()
      }
    }

    Object.assign(vm.proxy, {
      // expose public methods
      focus, shake,

      // private but needed by QSelect
      __updateRefocusTarget (target) {
        refocusTarget = target || null
      }
    })

    onBeforeUnmount(() => {
      cleanup()
    })

    function renderPortalContent () {
      return h('div', {
        ...attrs,
        class: rootClasses.value
      }, [
        h(Transition, {
          name: 'q-transition--fade',
          appear: true
        }, () => (
          useBackdrop.value === true
            ? h('div', {
                class: 'q-dialog__backdrop fixed-full',
                'aria-hidden': 'true',
                onMousedown: onBackdropClick
              })
            : null
        )),

        h(
          Transition,
          { name: transition.value, appear: true },
          () => (
            showing.value === true
              ? h('div', {
                  ref: innerRef,
                  class: classes.value,
                  tabindex: -1,
                  ...onEvents.value
                }, hSlot(slots.default))
              : null
          )
        )
      ])
    }

    return renderPortal
  }
})
