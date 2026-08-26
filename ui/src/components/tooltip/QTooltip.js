import {
  Transition,
  computed,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  ref,
  watch
} from 'vue'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useAnchor, {
  useAnchorStaticProps
} from '../../composables/private.use-anchor/use-anchor.js'
import useScrollTarget from '../../composables/private.use-scroll-target/use-scroll-target.js'
import useModelToggle, {
  useModelToggleEmits,
  useModelToggleProps
} from '../../composables/private.use-model-toggle/use-model-toggle.js'
import usePortal from '../../composables/private.use-portal/use-portal.js'
import useTransition, {
  useTransitionProps
} from '../../composables/private.use-transition/use-transition.js'
import useTick from '../../composables/use-tick/use-tick.js'
import useTransitionEnd from '../../composables/private.use-transition-end/use-transition-end.js'
import useId from '../../composables/use-id/use-id.js'

import { createComponent } from '../../utils/private.create/create.js'
import { getScrollTarget, scrollTargetProp } from '../../utils/scroll/scroll.js'
import { addEvt, cleanEvt } from '../../utils/event/event.js'
import {
  addEscapeKey,
  removeEscapeKey
} from '../../utils/private.keyboard/escape-key.js'
import { clearSelection } from '../../utils/private.selection/selection.js'
import { hSlot } from '../../utils/private.render/render.js'
import {
  parsePosition,
  setPosition,
  trackAnchorMotion,
  validateOffset,
  validatePosition
} from '../../utils/private.position-engine/position-engine.js'

let nonSelectableCount = 0

// a finger, or a stylus pressed to the screen (buttons is 0 while it
// merely hovers): both start native text selection when held, unlike
// a hovering pointer, so both need the touch UX
function isContactPointer(evt) {
  return (
    evt.pointerType === 'touch' ||
    (evt.pointerType === 'pen' && evt.buttons !== 0)
  )
}

export default /*#__PURE__*/ createComponent({
  name: 'QTooltip',

  inheritAttrs: false,

  props: {
    ...useAnchorStaticProps,
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
      ...useTransitionProps.transitionShow,
      default: 'jump-down'
    },
    transitionHide: {
      ...useTransitionProps.transitionHide,
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
      default: () => [14, 14],
      validator: validateOffset
    },

    scrollTarget: scrollTargetProp,

    delay: {
      type: Number,
      default: 0
    },

    hideDelay: {
      type: Number,
      default: 0
    },

    persistent: Boolean
  },

  emits: [...useModelToggleEmits],

  setup(props, { slots, emit, attrs }) {
    let unwatchPosition,
      stopAnchorTracking,
      observer,
      removeNonSelectableTimer,
      hasNonSelectable = false,
      // the pointerType of the contact interaction (touch or a pressed
      // stylus) driving the current show, if any; the hide side needs it
      // because its events can't tell us themselves
      contactType = null,
      describedBy

    const vm = getCurrentInstance()
    const $q = useQuasar()

    const innerRef = ref(null)
    const showing = ref(false)
    const targetUid = useId()
    // attrs is not reactive, so the custom id must be resolved on
    // demand (render/show path) instead of through a cached computed
    function getTooltipId() {
      return attrs.id || targetUid.value
    }

    const anchorOrigin = computed(() =>
      parsePosition(props.anchor, $q.lang.rtl)
    )
    const selfOrigin = computed(() => parsePosition(props.self, $q.lang.rtl))
    const hideOnRouteChange = computed(() => !props.persistent)

    const { registerTick, removeTick } = useTick()
    // registerTimeout also drives delay/hideDelay: sharing the slot with
    // the transition tail keeps a starting delay able to supersede it
    const { registerTimeout, registerTransitionEnd } = useTransitionEnd(props)
    const { transitionProps, transitionStyle } = useTransition(props)
    const { localScrollTarget, changeScrollEvent, unconfigureScrollTarget } =
      useScrollTarget(props, configureScrollTarget)

    const { anchorEl, canShow, anchorEvents } = useAnchor({
      showing,
      configureAnchorEl
    })

    const { show, hide } = useModelToggle({
      showing,
      canShow,
      handleShow,
      handleHide,
      hideOnRouteChange,
      processOnMount: true
    })

    Object.assign(anchorEvents, {
      delayShow,
      delayHide,
      onFocusin,
      onPointerdown
    })

    const { showPortal, hidePortal, renderPortal } = usePortal(
      vm,
      innerRef,
      renderPortalContent,
      'tooltip'
    )

    // independent of the touch handling above: hybrid devices
    // (touchscreen laptop, iPad with a keyboard) need both
    // dismissal methods, so no platform gate here.
    // Dismiss with the ESC key (WCAG 1.4.13) without moving focus;
    // uses the shared escape stack so only the top-most popup reacts
    watch(
      () =>
        // trigger only if it doesn't have external model
        // or else only if the model can be updated (otherwise respect the external model)
        (props.modelValue === null || props['onUpdate:modelValue']) &&
        showing.value === true &&
        props.persistent !== true,
      val => {
        const fn = val === true ? addEscapeKey : removeEscapeKey
        fn(onEscapeKey)
      }
    )

    function handleShow(evt) {
      showPortal()
      addAriaDescription()

      // should removeTick() if this gets removed
      registerTick(() => {
        observer?.disconnect()
        if (innerRef.value === null) {
          observer = void 0
          return
        }

        observer = new MutationObserver(() => updatePosition())
        observer.observe(innerRef.value, {
          attributes: false,
          childList: true,
          characterData: true,
          subtree: true
        })
        updatePosition()
        configureScrollTarget()

        // the anchor itself may still be animating when the tooltip
        // opens (focus/hover styles moving it, an entering parent);
        // unlike QMenu there is no transition-end re-measure, so a
        // moving anchor would leave the tooltip permanently offset
        stopAnchorTracking = trackAnchorMotion(
          () => anchorEl.value,
          updatePosition,
          props.transitionDuration
        )
      })

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

      registerTransitionEnd(() => {
        showPortal(true) // done showing portal
        emit('show', evt)
      })
    }

    function handleHide(evt) {
      removeTick()
      hidePortal()

      anchorCleanup()

      registerTransitionEnd(() => {
        hidePortal(true) // done hiding, now destroy
        emit('hide', evt)
      })
    }

    function anchorCleanup() {
      if (observer !== void 0) {
        observer.disconnect()
        observer = void 0
      }

      if (unwatchPosition !== void 0) {
        unwatchPosition()
        unwatchPosition = void 0
      }

      if (stopAnchorTracking !== void 0) {
        stopAnchorTracking()
        stopAnchorTracking = void 0
      }

      unconfigureScrollTarget()
      removeEscapeKey(onEscapeKey)
      contactType = null
      cleanEvt(anchorEvents, 'tooltipTemp')
      removeAriaDescription()
      setNonSelectable(false)
    }

    function updatePosition() {
      setPosition({
        targetEl: innerRef.value,
        offset: props.offset,
        anchorEl: anchorEl.value,
        anchorOrigin: anchorOrigin.value,
        selfOrigin: selfOrigin.value,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth
      })
    }

    function delayShow(evt) {
      // secondary fingers (multi-touch, e.g. a starting pinch-zoom) don't
      // get to drive the tooltip; only guard real touches: synthetic
      // PointerEvents default to isPrimary false, so a broader check would
      // break tooltips for everyone dispatching them (tests included)
      if (evt.pointerType === 'touch' && evt.isPrimary === false) return

      if (isContactPointer(evt)) {
        engageContact(evt)
      }

      registerTimeout(() => {
        show(evt)
      }, props.delay)
    }

    function engageContact(evt) {
      contactType = evt.pointerType

      if (removeNonSelectableTimer !== void 0) {
        clearTimeout(removeNonSelectableTimer)
        removeNonSelectableTimer = void 0
      }

      clearSelection()
      setNonSelectable(true)

      const target = anchorEl.value
      const evts = ['touchmove', 'touchcancel', 'touchend', 'click'].map(e => [
        target,
        e,
        'delayHide',
        'passiveCapture'
      ])

      addEvt(anchorEvents, 'tooltipTemp', evts)
    }

    function onPointerdown(evt) {
      // a stylus that was already hovering (which showed the tooltip
      // through the hover path, so no pointerenter fires anymore) gets
      // upgraded to the touch UX when it presses down; touch is engaged
      // by its own pointerenter and a mouse press needs no contact UX
      if (evt.pointerType === 'pen' && contactType === null) {
        engageContact(evt)
      }
    }

    function delayHide(evt) {
      if (evt.pointerType === 'touch' && evt.isPrimary === false) return

      // focus moving WITHIN the anchor is not a blur; QBtn for one
      // shuffles focus to an internal helper after every press, which
      // must neither hide the tooltip nor end a contact interaction
      if (
        evt.type === 'focusout' &&
        anchorEl.value !== null &&
        anchorEl.value.contains(evt.relatedTarget)
      ) {
        return
      }

      if (contactType !== null) {
        const liftedPen =
          contactType === 'pen' &&
          (evt.type === 'click' || evt.type === 'touchend')

        contactType = null
        cleanEvt(anchorEvents, 'tooltipTemp')
        clearSelection()
        // delay needed otherwise selection still occurs
        removeNonSelectableTimer = setTimeout(() => {
          removeNonSelectableTimer = void 0
          setNonSelectable(false)
        }, 10)

        // a lifted stylus keeps hovering the anchor, so the tooltip stays
        // shown like it would for a mouse; pointerleave closes it later
        // (or right away, on a pen that leaves the digitizer range)
        if (liftedPen) return
      }

      // should removeTimeout() if this gets removed
      registerTimeout(() => {
        hide(evt)
      }, props.hideDelay)
    }

    function onFocusin(evt) {
      const el = evt.target
      if (!el) return

      // only react to keyboard focus, not to focus coming from a pointer,
      // so the tooltip doesn't pop up when the target is clicked;
      // guard the call for engines that don't support :focus-visible
      try {
        if (el.matches(':focus-visible') === false) return
      } catch {}

      delayShow(evt)
    }

    // trigger only if it doesn't have external model
    // or else only if the model can be updated (otherwise respect the external model)
    function onEscapeKey(evt) {
      hide(evt)
    }

    function configureAnchorEl() {
      if (props.noParentEvent || anchorEl.value === null) return

      // pointer events cover mouse hover, pen hover AND the touch
      // press (where "enter" is finger-down and "leave" is finger-up),
      // so the same wiring serves every platform, hybrids included;
      // no synthetic mouse event dedup needed since we never listen to them
      const evts = [
        [anchorEl.value, 'pointerenter', 'delayShow', 'passive'],
        [anchorEl.value, 'pointerdown', 'onPointerdown', 'passive'],
        [anchorEl.value, 'pointerleave', 'delayHide', 'passive'],
        [anchorEl.value, 'focusin', 'onFocusin', 'passive'],
        [anchorEl.value, 'focusout', 'delayHide', 'passive']
      ]

      addEvt(anchorEvents, 'anchor', evts)
    }

    function setNonSelectable(state) {
      if (hasNonSelectable === state) return

      hasNonSelectable = state
      nonSelectableCount += state ? 1 : -1
      document.body.classList.toggle('non-selectable', nonSelectableCount > 0)

      if (!state && removeNonSelectableTimer !== void 0) {
        clearTimeout(removeNonSelectableTimer)
        removeNonSelectableTimer = void 0
      }
    }

    function addAriaDescription() {
      const el = anchorEl.value,
        id = getTooltipId()

      if (el === null || id === void 0) return

      const ids = (el.getAttribute('aria-describedby') || '')
        .split(/\s+/)
        .filter(Boolean)

      describedBy = { el, id, added: !ids.includes(id) }

      if (describedBy.added) {
        ids.push(id)
        el.setAttribute('aria-describedby', ids.join(' '))
      }
    }

    function removeAriaDescription() {
      if (describedBy?.added === true) {
        const { el, id } = describedBy,
          value = (el.getAttribute('aria-describedby') || '')
            .split(/\s+/)
            .filter(entry => entry !== '' && entry !== id)

        if (value.length === 0) el.removeAttribute('aria-describedby')
        else el.setAttribute('aria-describedby', value.join(' '))
      }

      describedBy = void 0
    }

    function configureScrollTarget() {
      if (anchorEl.value !== null || props.scrollTarget !== void 0) {
        localScrollTarget.value = getScrollTarget(
          anchorEl.value,
          props.scrollTarget
        )
        const fn = props.noParentEvent ? updatePosition : hide

        changeScrollEvent(localScrollTarget.value, fn)
      }
    }

    function getTooltipContent() {
      return showing.value
        ? h(
            'div',
            {
              ...attrs,
              id: getTooltipId(),
              ref: innerRef,
              class: [
                'q-tooltip q-tooltip--style q-position-engine no-pointer-events',
                attrs.class
              ],
              style: [attrs.style, transitionStyle()],
              role: 'tooltip'
            },
            hSlot(slots.default)
          )
        : null
    }

    function renderPortalContent() {
      return h(Transition, transitionProps(), getTooltipContent)
    }

    onBeforeUnmount(anchorCleanup)

    // expose public methods
    Object.assign(vm.proxy, { updatePosition })

    return renderPortal
  }
})
