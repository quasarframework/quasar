import { h, defineComponent, ref, computed, watch, onBeforeUnmount, nextTick, Transition, getCurrentInstance } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useHistory from '../../composables/use-history.js'
import useTimeout from '../../composables/use-timeout.js'
import useTick from '../../composables/use-tick.js'
import useModelToggle, { useModelToggleProps, useModelToggleEmits } from '../../composables/use-model-toggle.js'
import useEmitListeners from '../../composables/use-emit-listeners.js'
import usePortal from '../../composables/use-portal.js'
import usePreventScroll from '../../composables/use-prevent-scroll.js'

import { childHasFocus } from '../../utils/dom.js'
import { hSlot } from '../../utils/composition-render.js'
import { addEscapeKey, removeEscapeKey } from '../../utils/escape-key.js'
import { addFocusout, removeFocusout } from '../../utils/focusout.js'

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
      validator: val => val === 'standard' ||
        [ 'top', 'bottom', 'left', 'right' ].includes(val)
    },

    transitionShow: String,
    transitionHide: String
  },

  emits: [
    ...useModelToggleEmits,
    'shake', 'click', 'escape-key'
  ],

  setup (props, { slots, emit, attrs }) {
    const vm = getCurrentInstance()
    const transitionState = ref(props.showing)
    const innerRef = ref(null)
    const showing = ref(false)

    let shakeTimeout, refocusTarget, isMaximized

    const hideOnRouteChange = computed(() =>
      props.persistent !== true &&
        props.noRouteDismiss !== true &&
        props.seamless !== true
    )

    const $q = useQuasar()
    const { preventBodyScroll } = usePreventScroll()
    const { registerTimeout, removeTimeout } = useTimeout()
    const { registerTick, removeTick, prepareTick } = useTick()
    const { emitListeners } = useEmitListeners(vm)

    const { showPortal, hidePortal, portalIsActive, renderPortal } = usePortal(vm, renderPortalContent)

    const { show, hide, toggle } = useModelToggle(props, {
      emit,
      showing,
      hideOnRouteChange,
      emitListeners,
      handleShow,
      handleHide,
      processOnMount: true
    })

    const { addToHistory, removeFromHistory } = useHistory(showing, hide, hideOnRouteChange)

    const classes = computed(() =>
      'q-dialog__inner flex no-pointer-events' +
      ` q-dialog__inner--${props.maximized === true ? 'maximized' : 'minimized'}` +
      ` q-dialog__inner--${props.position} ${positionClass[ props.position ]}` +
      (props.fullWidth === true ? ' q-dialog__inner--fullwidth' : '') +
      (props.fullHeight === true ? ' q-dialog__inner--fullheight' : '') +
      (props.square === true ? ' q-dialog__inner--square' : '')
    )

    const transitionShow = computed(() =>
      'q-transition--' +
      (props.transitionShow === void 0 ? transitions[ props.position ][ 0 ] : props.transitionShow)
    )

    const transitionHide = computed(() =>
      'q-transition--' +
      (props.transitionHide === void 0 ? transitions[ props.position ][ 1 ] : props.transitionHide)
    )

    const transition = computed(() =>
      transitionState.value === true
        ? transitionHide.value
        : transitionShow.value
    )

    const useBackdrop = computed(() => showing.value === true && props.seamless !== true)

    const onEvents = computed(() =>
      props.autoClose === true
        ? { onClick: onAutoClose }
        : {}
    )

    watch(showing, val => {
      if (transitionShow.value !== transitionHide.value) {
        nextTick(() => {
          transitionState.value = val
        })
      }
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

      // IE can have null document.activeElement
      refocusTarget = props.noRefocus === false && document.activeElement !== null
        ? document.activeElement
        : void 0

      updateMaximized(props.maximized)
      showPortal()

      if (props.noFocus !== true) {
        // IE can have null document.activeElement
        document.activeElement !== null && document.activeElement.blur()
        registerTick(focus)
        prepareTick()
      }

      registerTimeout(() => {
        if ($q.platform.is.ios === true) {
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
          innerRef.value.click()
        }

        emit('show', evt)
      }, 300)
    }

    function handleHide (evt) {
      removeTimeout()
      removeTick()
      removeFromHistory()
      cleanup(true)

      if (refocusTarget !== void 0) {
        refocusTarget.focus()
      }

      registerTimeout(() => {
        hidePortal()
        emit('hide', evt)
      }, 300)
    }

    function focus () {
      let node = innerRef.value

      if (!node || node.contains(document.activeElement) === true) {
        return
      }

      node = node.querySelector('[autofocus], [data-autofocus]') || node
      node.focus()
    }

    function shake () {
      focus()
      emit('shake')

      const node = innerRef.value

      if (node) {
        node.classList.remove('q-animate--scale')
        node.classList.add('q-animate--scale')
        clearTimeout(shakeTimeout)
        shakeTimeout = setTimeout(() => {
          node.classList.remove('q-animate--scale')
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
      hide(e)
      emit('click', e)
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
        showing.value === true &&
        portalIsActive.value === true &&
        childHasFocus(innerRef.value, evt.target) !== true
      ) {
        focus()
      }
    }

    Object.assign(vm.proxy, {
      // expose public methods
      show, hide, toggle, focus, shake,

      // expose needed stuff for portal utils
      quasarPortalInnerRef: innerRef
    })

    onBeforeUnmount(() => {
      cleanup()
    })

    function renderPortalContent () {
      return h('div', {
        ...attrs, // TODO vue3 - verify reactivity
        class: [
          'q-dialog fullscreen no-pointer-events ' +
            `q-dialog--${useBackdrop.value === true ? 'modal' : 'seamless'}`,
          attrs.class
        ]
      }, [
        h(Transition, {
          name: 'q-transition--fade',
          appear: true
        }, () => (
          useBackdrop.value === true
            ? h('div', {
                class: 'q-dialog__backdrop fixed-full',
                'aria-hidden': 'true',
                onClick: onBackdropClick
              })
            : null
        )),

        h(
          Transition,
          { name: transition.value, appear: true },
          () => showing.value === true
            ? h('div', {
                ref: innerRef,
                class: classes.value,
                tabindex: -1,
                ...onEvents.value
              }, hSlot(slots.default))
            : null
        )
      ])
    }

    return renderPortal
  }
})
