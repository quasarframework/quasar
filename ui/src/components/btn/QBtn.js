import {
  Transition,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  ref,
  withDirectives
} from 'vue'

import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'

import Ripple from '../../directives/ripple/Ripple.js'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useBtn, { useBtnProps } from './use-btn.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hMergeSlot } from '../../utils/private.render/render.js'
import {
  listenOpts,
  prevent,
  stop,
  stopAndPrevent
} from '../../utils/event/event.js'
import { isKeyCode } from '../../utils/private.keyboard/key-composition.js'

const { passiveCapture } = listenOpts

let touchTarget = null,
  keyboardTarget = null,
  mouseTarget = null

const centeredRipple = { center: true }
const uncenteredRipple = { center: false }

function onLoadingEvt(evt) {
  stopAndPrevent(evt)
  evt.qSkipRipple = true
}

export default /*#__PURE__*/ createComponent({
  name: 'QBtn',

  props: {
    ...useBtnProps,

    percentage: Number,
    darkPercentage: Boolean,

    onTouchstart: [Function, Array]
  },

  emits: ['click', 'keydown', 'mousedown', 'keyup'],

  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const $q = useQuasar()

    const {
      getClasses,
      getStyle,
      getInnerClasses,
      getAttributes,
      hasLink,
      linkTag,
      navigateOnClick,
      isActionable
    } = useBtn(props)

    const rootRef = ref(null)
    const blurTargetRef = ref(null)

    let localTouchTargetEl = null,
      avoidMouseRipple,
      mouseTimer = null,
      clickCleanup = null

    function getRipple() {
      return props.disable || props.ripple === false
        ? false
        : {
            keyCodes: hasLink.value ? [13, 32] : [13],
            ...(props.ripple === true ? {} : props.ripple)
          }
    }

    function getOnEvents() {
      if (props.loading) {
        return {
          onMousedown: onLoadingEvt,
          onTouchstart: onLoadingEvt,
          onClick: onLoadingEvt,
          onKeydown: onLoadingEvt,
          onKeyup: onLoadingEvt
        }
      }

      if (isActionable()) {
        const acc = {
          onClick,
          onKeydown,
          onMousedown
        }

        if ($q.platform.has.touch) {
          const suffix = props.onTouchstart !== void 0 ? '' : 'Passive'

          acc[`onTouchstart${suffix}`] = onTouchstart
        }

        return acc
      }

      return {
        // needed; especially for disabled <a> tags
        onClick: stopAndPrevent
      }
    }

    function onClick(e) {
      // is it already destroyed?
      if (rootRef.value === null) return

      if (e !== void 0) {
        if (e.defaultPrevented) return

        const el = document.activeElement
        // focus button if it came from ENTER on form
        // prevent the new submit (already done)
        if (
          props.type === 'submit' &&
          el !== document.body &&
          !rootRef.value.contains(el) &&
          // required for iOS and desktop Safari
          !el.contains(rootRef.value)
        ) {
          if (!e.qAvoidFocus) rootRef.value.focus()

          const onClickCleanup = () => {
            clickCleanup = null
            document.removeEventListener('keydown', stopAndPrevent, true)
            document.removeEventListener(
              'keyup',
              onClickCleanup,
              passiveCapture
            )
            rootRef.value?.removeEventListener(
              'blur',
              onClickCleanup,
              passiveCapture
            )
          }

          clickCleanup = onClickCleanup
          document.addEventListener('keydown', stopAndPrevent, true)
          document.addEventListener('keyup', onClickCleanup, passiveCapture)
          rootRef.value.addEventListener('blur', onClickCleanup, passiveCapture)
        }
      }

      navigateOnClick(e)
    }

    function onKeydown(e) {
      // is it already destroyed?
      if (rootRef.value === null) return

      emit('keydown', e)

      if (isKeyCode(e, [13, 32]) && keyboardTarget !== rootRef.value) {
        if (keyboardTarget !== null) cleanup()

        if (!e.defaultPrevented) {
          // focus external button if the focus helper was focused before
          if (!e.qAvoidFocus) rootRef.value.focus()

          keyboardTarget = rootRef.value
          rootRef.value.classList.add('q-btn--active')
          document.addEventListener('keyup', onPressEnd, true)
          rootRef.value.addEventListener('blur', onPressEnd, passiveCapture)
        }

        stopAndPrevent(e)
      }
    }

    function onTouchstart(e) {
      // is it already destroyed?
      if (rootRef.value === null) return

      emit('touchstart', e)

      if (e.defaultPrevented) return

      if (touchTarget !== rootRef.value) {
        if (touchTarget !== null) cleanup()
        touchTarget = rootRef.value

        localTouchTargetEl = e.target
        localTouchTargetEl.addEventListener(
          'touchcancel',
          onPressEnd,
          passiveCapture
        )
        localTouchTargetEl.addEventListener(
          'touchend',
          onPressEnd,
          passiveCapture
        )
      }

      // avoid duplicated mousedown event
      // triggering another early ripple
      avoidMouseRipple = true
      if (mouseTimer !== null) clearTimeout(mouseTimer)
      mouseTimer = setTimeout(() => {
        mouseTimer = null
        avoidMouseRipple = false
      }, 200)
    }

    function onMousedown(e) {
      // is it already destroyed?
      if (rootRef.value === null) return

      e.qSkipRipple = avoidMouseRipple === true
      emit('mousedown', e)

      if (!e.defaultPrevented && mouseTarget !== rootRef.value) {
        if (mouseTarget !== null) cleanup()
        mouseTarget = rootRef.value
        rootRef.value.classList.add('q-btn--active')
        document.addEventListener('mouseup', onPressEnd, passiveCapture)
      }
    }

    function onPressEnd(e) {
      // is it already destroyed?
      if (rootRef.value === null) return

      // needed for IE (because it emits blur when focusing button from focus helper)
      if (e?.type === 'blur' && document.activeElement === rootRef.value) return

      if (e?.type === 'keyup') {
        if (keyboardTarget === rootRef.value && isKeyCode(e, [13, 32])) {
          // for click trigger
          const evt = new MouseEvent('click', e)
          evt.qKeyEvent = true
          if (e.defaultPrevented) prevent(evt)
          if (e.cancelBubble) stop(evt)
          rootRef.value.dispatchEvent(evt)

          stopAndPrevent(e)

          // for ripple
          e.qKeyEvent = true
        }

        emit('keyup', e)
      }

      cleanup()
    }

    function cleanup(destroying) {
      clickCleanup?.()

      const blurTarget = blurTargetRef.value

      if (
        !destroying &&
        (touchTarget === rootRef.value || mouseTarget === rootRef.value) &&
        blurTarget !== null &&
        blurTarget !== document.activeElement
      ) {
        blurTarget.setAttribute('tabindex', -1)
        blurTarget.focus({ preventScroll: true })
      }

      if (touchTarget === rootRef.value) {
        if (localTouchTargetEl !== null) {
          localTouchTargetEl.removeEventListener(
            'touchcancel',
            onPressEnd,
            passiveCapture
          )
          localTouchTargetEl.removeEventListener(
            'touchend',
            onPressEnd,
            passiveCapture
          )
        }
        touchTarget = localTouchTargetEl = null
      }

      if (mouseTarget === rootRef.value) {
        document.removeEventListener('mouseup', onPressEnd, passiveCapture)
        mouseTarget = null
      }

      if (keyboardTarget === rootRef.value) {
        document.removeEventListener('keyup', onPressEnd, true)
        rootRef.value?.removeEventListener('blur', onPressEnd, passiveCapture)
        keyboardTarget = null
      }

      rootRef.value?.classList.remove('q-btn--active')
    }

    onBeforeUnmount(() => {
      cleanup(true)
    })

    // expose public methods
    Object.assign(proxy, {
      click: e => {
        if (isActionable()) onClick(e)
      }
    })

    return () => {
      const hasLabel =
        props.label !== void 0 && props.label !== null && props.label !== ''

      let inner = []

      if (props.icon !== void 0) {
        inner.push(
          h(QIcon, {
            name: props.icon,
            left: !props.stack && hasLabel,
            role: 'img'
          })
        )
      }

      if (hasLabel) {
        inner.push(h('span', { class: 'block' }, [props.label]))
      }

      inner = hMergeSlot(slots.default, inner)

      if (props.iconRight !== void 0 && !props.round) {
        inner.push(
          h(QIcon, {
            name: props.iconRight,
            right: !props.stack && hasLabel,
            role: 'img'
          })
        )
      }

      const child = [
        h('span', {
          class: 'q-focus-helper',
          ref: blurTargetRef
        })
      ]

      if (props.loading && props.percentage !== void 0) {
        const val = Math.max(0, Math.min(100, props.percentage))

        child.push(
          h(
            'span',
            {
              class:
                'q-btn__progress absolute-full overflow-hidden' +
                (props.darkPercentage ? ' q-btn__progress--dark' : '')
            },
            [
              h('span', {
                class: 'q-btn__progress-indicator fit block',
                style:
                  val > 0
                    ? {
                        transition: 'transform 0.6s',
                        transform: `translateX(${val - 100}%)`
                      }
                    : null
              })
            ]
          )
        )
      }

      child.push(
        h(
          'span',
          {
            class:
              'q-btn__content text-center col items-center q-anchor--skip ' +
              getInnerClasses()
          },
          inner
        )
      )

      if (props.loading !== null) {
        child.push(
          h(
            Transition,
            {
              name: 'q-transition--fade'
            },
            () =>
              props.loading
                ? [
                    h(
                      'span',
                      {
                        key: 'loading',
                        class: 'absolute-full flex flex-center'
                      },
                      slots.loading !== void 0 ? slots.loading() : [h(QSpinner)]
                    )
                  ]
                : null
          )
        )
      }

      const data = {
        ref: rootRef,
        class: 'q-btn q-btn-item non-selectable no-outline ' + getClasses(),
        style: getStyle(),
        ...getAttributes(),
        ...getOnEvents()
      }

      return withDirectives(h(linkTag.value, data, child), [
        [
          Ripple,
          getRipple(),
          void 0,
          props.round ? centeredRipple : uncenteredRipple
        ]
      ])
    }
  }
})
