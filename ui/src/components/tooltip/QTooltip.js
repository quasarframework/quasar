import { h, ref, computed, watch, onBeforeUnmount, Transition, getCurrentInstance } from 'vue'

import useAnchor, { useAnchorProps } from '../../composables/private/use-anchor.js'
import useScrollTarget from '../../composables/private/use-scroll-target.js'
import useModelToggle, { useModelToggleProps, useModelToggleEmits } from '../../composables/private/use-model-toggle.js'
import usePortal from '../../composables/private/use-portal.js'
import useTransition, { useTransitionProps } from '../../composables/private/use-transition.js'
import useTick from '../../composables/private/use-tick.js'
import useTimeout from '../../composables/private/use-timeout.js'

import { createComponent } from '../../utils/private/create.js'
import { getScrollTarget } from '../../utils/scroll.js'
import { stopAndPrevent, addEvt, cleanEvt } from '../../utils/event.js'
import { clearSelection } from '../../utils/private/selection.js'
import { hSlot } from '../../utils/private/render.js'
import { addClickOutside, removeClickOutside } from '../../utils/private/click-outside.js'
import {
  validatePosition, validateOffset, setPosition, parsePosition
} from '../../utils/private/position-engine.js'

export default createComponent({
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

    const vm = getCurrentInstance()
    const { proxy: { $q } } = vm

    const innerRef = ref(null)
    const showing = ref(false)

    const anchorOrigin = computed(() => parsePosition(props.anchor, $q.lang.rtl))
    const selfOrigin = computed(() => parsePosition(props.self, $q.lang.rtl))
    const hideOnRouteChange = computed(() => props.persistent !== true)

    const { registerTick, removeTick } = useTick()
    const { registerTimeout, removeTimeout } = useTimeout()
    const { transition, transitionStyle } = useTransition(props, showing)
    const { localScrollTarget, changeScrollEvent, unconfigureScrollTarget } = useScrollTarget(props, configureScrollTarget)

    const { anchorEl, canShow, anchorEvents } = useAnchor({ showing, configureAnchorEl })

    const { show, hide } = useModelToggle({
      showing, canShow, handleShow, handleHide,
      hideOnRouteChange,
      processOnMount: true
    })

    Object.assign(anchorEvents, { delayShow, delayHide })

    const { showPortal, hidePortal, renderPortal } = usePortal(vm, innerRef, renderPortalContent)

    // if we're on mobile, let's improve the experience
    // by closing it when user taps outside of it
    if ($q.platform.is.mobile === true) {
      const clickOutsideProps = {
        anchorEl,
        innerRef,
        onClickOutside (e) {
          hide(e)

          // prevent click if it's on a dialog backdrop
          if (e.target.classList.contains('q-dialog__backdrop')) {
            stopAndPrevent(e)
          }

          return true
        }
      }

      const hasClickOutside = computed(() =>
        // it doesn't has external model
        // (null is the default value)
        props.modelValue === null
        // and it's not persistent
        && props.persistent !== true
        && showing.value === true
      )

      watch(hasClickOutside, val => {
        const fn = val === true ? addClickOutside : removeClickOutside
        fn(clickOutsideProps)
      })

      onBeforeUnmount(() => {
        removeClickOutside(clickOutsideProps)
      })
    }

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

      if (unwatchPosition === void 0) {
        unwatchPosition = watch(
          () => $q.screen.width + '|' + $q.screen.height + '|' + props.self + '|' + props.anchor + '|' + $q.lang.rtl,
          updatePosition
        )
      }

      registerTimeout(() => {
        showPortal(true) // done showing portal
        emit('show', evt)
      }, props.transitionDuration)
    }

    function handleHide (evt) {
      removeTick()
      removeTimeout()
      hidePortal()

      anchorCleanup()

      registerTimeout(() => {
        hidePortal(true) // done hiding, now destroy
        emit('hide', evt)
      }, props.transitionDuration)
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

      if (anchorEl.value === null || !el) {
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

        const target = anchorEl.value
        const evts = [ 'touchmove', 'touchcancel', 'touchend', 'click' ]
          .map(e => ([ target, e, 'delayHide', 'passiveCapture' ]))

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
      if (props.noParentEvent === true || anchorEl.value === null) { return }

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
      if (anchorEl.value !== null || props.scrollTarget !== void 0) {
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
          ...attrs,
          ref: innerRef,
          class: [
            'q-tooltip q-tooltip--style q-position-engine no-pointer-events',
            attrs.class
          ],
          style: [
            attrs.style,
            transitionStyle.value
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
