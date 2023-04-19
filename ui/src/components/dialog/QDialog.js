import { h, ref, computed, watch, onBeforeUnmount, Transition, getCurrentInstance } from 'vue'

import useHistory from '../../composables/private/use-history.js'
import useTimeout from '../../composables/private/use-timeout.js'
import useTick from '../../composables/private/use-tick.js'
import useModelToggle, { useModelToggleProps, useModelToggleEmits } from '../../composables/private/use-model-toggle.js'
import useTransition, { useTransitionProps } from '../../composables/private/use-transition.js'
import usePortal from '../../composables/private/use-portal.js'
import usePreventScroll from '../../composables/private/use-prevent-scroll.js'

import { createComponent } from '../../utils/private/create.js'
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

const defaultTransitions = {
  standard: [ 'scale', 'scale' ],
  top: [ 'slide-down', 'slide-up' ],
  bottom: [ 'slide-up', 'slide-down' ],
  right: [ 'slide-left', 'slide-right' ],
  left: [ 'slide-right', 'slide-left' ]
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

    position: {
      type: String,
      default: 'standard',
      validator: val => val === 'standard'
        || [ 'top', 'bottom', 'left', 'right' ].includes(val)
    }
  },

  emits: [
    ...useModelToggleEmits,
    'shake', 'click', 'escapeKey'
  ],

  setup (props, { slots, emit, attrs }) {
    const vm = getCurrentInstance()

    const innerRef = ref(null)
    const showing = ref(false)
    const animating = ref(false)

    let shakeTimeout = null, refocusTarget = null, isMaximized, avoidAutoClose

    const hideOnRouteChange = computed(() =>
      props.persistent !== true
      && props.noRouteDismiss !== true
      && props.seamless !== true
    )

    const { preventBodyScroll } = usePreventScroll()
    const { registerTimeout } = useTimeout()
    const { registerTick, removeTick } = useTick()

    const { transitionProps, transitionStyle } = useTransition(
      props,
      () => defaultTransitions[ props.position ][ 0 ],
      () => defaultTransitions[ props.position ][ 1 ]
    )

    const { showPortal, hidePortal, portalIsAccessible, renderPortal } = usePortal(
      vm, innerRef, renderPortalContent, 'dialog'
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
      }
      else {
        removeTick()
      }

      // should removeTimeout() if this gets removed
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
      removeTick()
      removeFromHistory()
      cleanup(true)
      animating.value = true
      hidePortal()

      if (refocusTarget !== null) {
        ((evt && evt.type.indexOf('key') === 0
          ? refocusTarget.closest('[tabindex]:not([tabindex^="-"])')
          : void 0
        ) || refocusTarget).focus()
        refocusTarget = null
      }

      // should removeTimeout() if this gets removed
      registerTimeout(() => {
        hidePortal(true) // done hiding, now destroy
        animating.value = false
        emit('hide', evt)
      }, props.transitionDuration)
    }

    function focus (selector) {
      addFocusFn(() => {
        let node = innerRef.value

        if (node === null || node.contains(document.activeElement) === true) {
          return
        }

        node = (selector !== '' ? node.querySelector(selector) : null)
          || node.querySelector('[autofocus][tabindex], [data-autofocus][tabindex]')
          || node.querySelector('[autofocus] [tabindex], [data-autofocus] [tabindex]')
          || node.querySelector('[autofocus], [data-autofocus]')
          || node
        node.focus({ preventScroll: true })
      })
    }

    function shake (focusTarget) {
      if (focusTarget && typeof focusTarget.focus === 'function') {
        focusTarget.focus({ preventScroll: true })
      }
      else {
        focus()
      }

      emit('shake')

      const node = innerRef.value

      if (node !== null) {
        node.classList.remove('q-animate--scale')
        node.classList.add('q-animate--scale')
        shakeTimeout !== null && clearTimeout(shakeTimeout)
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

    function onEscapeKey () {
      if (props.seamless !== true) {
        if (props.persistent === true || props.noEscDismiss === true) {
          props.maximized !== true && props.noShake !== true && shake()
        }
        else {
          emit('escapeKey')
          hide()
        }
      }
    }

    function cleanup (hiding) {
      if (shakeTimeout !== null) {
        clearTimeout(shakeTimeout)
        shakeTimeout = null
      }

      if (hiding === true || showing.value === true) {
        updateMaximized(false)

        if (props.seamless !== true) {
          preventBodyScroll(false)
          removeFocusout(onFocusChange)
          removeEscapeKey(onEscapeKey)
        }
      }

      if (hiding !== true) {
        refocusTarget = null
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
      else if (props.noShake !== true) {
        shake()
      }
    }

    function onFocusChange (evt) {
      // the focus is not in a vue child component
      if (
        props.allowFocusOutside !== true
        && portalIsAccessible.value === true
        && childHasFocus(innerRef.value, evt.target) !== true
      ) {
        focus('[tabindex]:not([tabindex="-1"])')
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

    onBeforeUnmount(cleanup)

    function renderPortalContent () {
      return h('div', {
        role: 'dialog',
        'aria-modal': useBackdrop.value === true ? 'true' : 'false',
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
              style: transitionStyle.value,
              'aria-hidden': 'true',
              tabindex: -1,
              onClick: onBackdropClick
            })
            : null
        )),

        h(
          Transition,
          transitionProps.value,
          () => (
            showing.value === true
              ? h('div', {
                ref: innerRef,
                class: classes.value,
                style: transitionStyle.value,
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
