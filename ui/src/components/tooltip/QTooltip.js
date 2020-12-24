import { h, defineComponent, ref, computed, watch, onBeforeUnmount, Transition, getCurrentInstance } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useAnchor, { useAnchorProps } from '../../composables/private/use-anchor.js'
import useScrollTarget from '../../composables/private/use-scroll-target.js'
import useModelToggle, { useModelToggleProps, useModelToggleEmits } from '../../composables/private/use-model-toggle.js'
import usePortal from '../../composables/private/use-portal.js'
import useTransition, { useTransitionProps } from '../../composables/private/use-transition.js'
import useTick from '../../composables/use-tick.js'
import useTimeout from '../../composables/use-timeout.js'

import { getScrollTarget } from '../../utils/scroll.js'
import { getTouchTarget } from '../../utils/touch.js'
import { addEvt, cleanEvt } from '../../utils/event.js'
import { clearSelection } from '../../utils/selection.js'
import { hSlot } from '../../utils/composition-render.js'
import {
  validatePosition, validateOffset, setPosition, parsePosition
} from '../../utils/position-engine.js'

export default defineComponent({
  name: 'QTooltip',

  inheritAttrs: false,

  props: {
    ...useAnchorProps,
    ...useModelToggleProps,
    ...useTransitionProps,

    maxHeight: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null
    },

    transitionShow: {
      default: 'jump-down'
    },
    transitionHide: {
      default: 'jump-up'
    },

    anchor: {
      type: String,
      default: 'bottom middle',
      validator: validatePosition
    },
    self: {
      type: String,
      default: 'top middle',
      validator: validatePosition
    },
    offset: {
      type: Array,
      default: () => [ 14, 14 ],
      validator: validateOffset
    },

    scrollTarget: {
      default: void 0
    },

    delay: {
      type: Number,
      default: 0
    },

    hideDelay: {
      type: Number,
      default: 0
    }
  },

  emits: [
    ...useModelToggleEmits
  ],

  setup (props, { slots, emit, attrs }) {
    let unwatchPosition, observer

    const $q = useQuasar()

    const vm = getCurrentInstance()
    const innerRef = ref(null)
    const showing = ref(false)

    const anchorOrigin = computed(() => parsePosition(props.anchor, $q.lang.rtl))
    const selfOrigin = computed(() => parsePosition(props.self, $q.lang.rtl))
    const hideOnRouteChange = computed(() => props.persistent !== true)

    const { registerTick, removeTick, prepareTick } = useTick()
    const { registerTimeout, removeTimeout } = useTimeout()
    const { transition } = useTransition(props, showing)
    const { localScrollTarget, changeScrollEvent, unconfigureScrollTarget } = useScrollTarget(props, configureScrollTarget)

    const { anchorEl, canShow, anchorEvents } = useAnchor({
      props, emit, vm, showing, configureAnchorEl
    })

    const { show, hide } = useModelToggle({
      props,
      emit,
      vm,
      showing, canShow, handleShow, handleHide,
      hideOnRouteChange,
      processOnMount: true
    })

    anchorEvents.delayShow = delayShow
    anchorEvents.delayHide = delayHide

    const { showPortal, hidePortal, renderPortal } = usePortal(vm, innerRef, renderPortalContent)

    function handleShow (evt) {
      removeTick()
      removeTimeout()

      showPortal()

      registerTick(() => {
        observer = new MutationObserver(() => updatePosition())
        observer.observe(innerRef.value, { attributes: false, childList: true, characterData: true, subtree: true })
        updatePosition()
        configureScrollTarget()
      })
      prepareTick()

      if (unwatchPosition === void 0) {
        unwatchPosition = watch(
          () => $q.screen.width + '|' + $q.screen.height + '|' + props.self + '|' + props.anchor + '|' + $q.lang.rtl,
          updatePosition
        )
      }

      registerTimeout(() => {
        emit('show', evt)
      }, 300)
    }

    function handleHide (evt) {
      removeTick()
      removeTimeout()

      anchorCleanup()

      registerTimeout(() => {
        hidePortal()
        emit('hide', evt)
      }, 300)
    }

    function anchorCleanup () {
      if (observer !== void 0) {
        observer.disconnect()
        observer = void 0
      }

      if (unwatchPosition !== void 0) {
        unwatchPosition()
        unwatchPosition = void 0
      }

      unconfigureScrollTarget()
      cleanEvt(anchorEvents, 'tooltipTemp')
    }

    function updatePosition () {
      const el = innerRef.value

      if (anchorEl.value === void 0 || !el) {
        return
      }

      setPosition({
        el,
        offset: props.offset,
        anchorEl: anchorEl.value,
        anchorOrigin: anchorOrigin.value,
        selfOrigin: selfOrigin.value,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth
      })
    }

    function delayShow (evt) {
      if ($q.platform.is.mobile === true) {
        clearSelection()
        document.body.classList.add('non-selectable')

        const target = getTouchTarget(anchorEl.value)
        const evts = [ 'touchmove', 'touchcancel', 'touchend', 'click' ]
          .map(e => ([ target, e, '__delayHide', 'passiveCapture' ]))

        addEvt(anchorEvents, 'tooltipTemp', evts)
      }

      registerTimeout(() => {
        show(evt)
      }, props.delay)
    }

    function delayHide (evt) {
      removeTimeout()

      if ($q.platform.is.mobile === true) {
        cleanEvt(anchorEvents, 'tooltipTemp')
        clearSelection()
        // delay needed otherwise selection still occurs
        setTimeout(() => {
          document.body.classList.remove('non-selectable')
        }, 10)
      }

      registerTimeout(() => {
        hide(evt)
      }, props.hideDelay)
    }

    function configureAnchorEl () {
      if (props.noParentEvent === true || anchorEl.value === void 0) { return }

      const evts = $q.platform.is.mobile === true
        ? [
            [ anchorEl.value, 'touchstart', 'delayShow', 'passive' ]
          ]
        : [
            [ anchorEl.value, 'mouseenter', 'delayShow', 'passive' ],
            [ anchorEl.value, 'mouseleave', 'delayHide', 'passive' ]
          ]

      addEvt(anchorEvents, 'anchor', evts)
    }

    function configureScrollTarget () {
      if (anchorEl.value !== void 0 || props.scrollTarget !== void 0) {
        localScrollTarget.value = getScrollTarget(anchorEl.value, props.scrollTarget)
        const fn = props.noParentEvent === true
          ? updatePosition
          : hide

        changeScrollEvent(localScrollTarget.value, fn)
      }
    }

    function getTooltipContent () {
      return showing.value === true
        ? h('div', {
            ...attrs, // TODO vue3 - verify reactivity
            ref: innerRef,
            class: [
              'q-tooltip q-tooltip--style q-position-engine no-pointer-events',
              attrs.class
            ],
            role: 'complementary'
          }, hSlot(slots.default))
        : null
    }

    function renderPortalContent () {
      return h(Transition, {
        name: transition.value,
        appear: true
      }, getTooltipContent)
    }

    onBeforeUnmount(anchorCleanup)

    // expose public methods
    Object.assign(vm.proxy, { updatePosition })

    return renderPortal
  }
})
