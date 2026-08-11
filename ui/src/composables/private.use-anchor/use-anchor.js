import {
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

import { clearSelection } from '../../utils/private.selection/selection.js'
import { addEvt, cleanEvt, prevent } from '../../utils/event/event.js'
import { isKeyCode } from '../../utils/private.keyboard/key-composition.js'

export const useAnchorStaticProps = {
  /* SSR/SSG does not know about Element */
  target: __QUASAR_SSR_SERVER__
    ? { default: true }
    : {
        type: [Boolean, String, Element],
        default: true
      },

  noParentEvent: Boolean
}

export const useAnchorProps = {
  ...useAnchorStaticProps,
  contextMenu: Boolean
}

export default function useAnchor({
  showing,
  avoidEmit, // required for QPopupProxy (true)
  configureAnchorEl // optional
}) {
  const { props, proxy, emit } = getCurrentInstance()

  const anchorEl = ref(null)

  let touchTimer = null

  function canShow(evt) {
    // abort with no parent configured or on multi-touch
    return anchorEl.value === null
      ? false
      : evt === void 0 || evt.touches === void 0 || evt.touches.length <= 1
  }

  const anchorEvents = {}

  if (configureAnchorEl === void 0) {
    // default configureAnchorEl is designed for
    // QMenu & QPopupProxy (which is why it's handled here)

    Object.assign(anchorEvents, {
      hide(evt) {
        proxy.hide(evt)
      },

      toggle(evt) {
        proxy.toggle(evt)
        evt.qAnchorHandled = true
      },

      toggleKey(evt) {
        if (isKeyCode(evt, 13)) anchorEvents.toggle(evt)
      },

      contextClick(evt) {
        proxy.hide(evt)
        prevent(evt)
        nextTick(() => {
          proxy.show(evt)
          evt.qAnchorHandled = true
        })
      },

      prevent,

      mobileTouch(evt) {
        anchorEvents.mobileCleanup(evt)

        if (!canShow(evt)) return

        proxy.hide(evt)
        anchorEl.value.classList.add('non-selectable')

        const target = evt.target
        addEvt(anchorEvents, 'anchor', [
          [target, 'touchmove', 'mobileCleanup', 'passive'],
          [target, 'touchend', 'mobileCleanup', 'passive'],
          [target, 'touchcancel', 'mobileCleanup', 'passive'],
          [anchorEl.value, 'contextmenu', 'prevent', 'notPassive']
        ])

        touchTimer = setTimeout(() => {
          touchTimer = null
          proxy.show(evt)
          evt.qAnchorHandled = true
        }, 300)
      },

      mobileCleanup(evt) {
        anchorEl.value.classList.remove('non-selectable')

        if (touchTimer !== null) {
          clearTimeout(touchTimer)
          touchTimer = null
        }

        if (showing.value && evt !== void 0) {
          clearSelection()
        }
      }
    })

    // oxlint-disable-next-line func-name-matching
    configureAnchorEl = function configureAnchorElFn(
      context = props.contextMenu
    ) {
      if (props.noParentEvent || anchorEl.value === null) return

      const evts = context
        ? proxy.$q.platform.is.mobile
          ? [[anchorEl.value, 'touchstart', 'mobileTouch', 'passive']]
          : [
              [anchorEl.value, 'mousedown', 'hide', 'passive'],
              [anchorEl.value, 'contextmenu', 'contextClick', 'notPassive']
            ]
        : [
            [anchorEl.value, 'click', 'toggle', 'passive'],
            [anchorEl.value, 'keyup', 'toggleKey', 'passive']
          ]

      addEvt(anchorEvents, 'anchor', evts)
    }
  }

  function unconfigureAnchorEl() {
    cleanEvt(anchorEvents, 'anchor')
  }

  function setAnchorEl(el) {
    anchorEl.value = el
    while (anchorEl.value.classList.contains('q-anchor--skip')) {
      anchorEl.value = anchorEl.value.parentNode
    }
    configureAnchorEl()
  }

  function pickAnchorEl() {
    if (
      props.target === false ||
      props.target === '' ||
      proxy.$el.parentNode === null
    ) {
      anchorEl.value = null
    } else if (props.target === true) {
      setAnchorEl(proxy.$el.parentNode)
    } else {
      let el = props.target

      if (typeof props.target === 'string') {
        try {
          el = document.querySelector(props.target)
        } catch {
          el = void 0
        }
      }

      if (el !== void 0 && el !== null) {
        anchorEl.value = el.$el || el
        configureAnchorEl()
      } else {
        anchorEl.value = null
        console.error(`Anchor: target "${props.target}" not found`)
      }
    }
  }

  watch(
    () => props.contextMenu,
    val => {
      if (anchorEl.value !== null) {
        unconfigureAnchorEl()
        configureAnchorEl(val)
      }
    }
  )

  watch(
    () => props.target,
    () => {
      if (anchorEl.value !== null) {
        unconfigureAnchorEl()
      }

      pickAnchorEl()
    }
  )

  watch(
    () => props.noParentEvent,
    val => {
      if (anchorEl.value !== null) {
        if (val) {
          unconfigureAnchorEl()
        } else {
          configureAnchorEl()
        }
      }
    }
  )

  onMounted(() => {
    pickAnchorEl()

    if (!avoidEmit && props.modelValue && anchorEl.value === null) {
      emit('update:modelValue', false)
    }
  })

  onBeforeUnmount(() => {
    if (touchTimer !== null) clearTimeout(touchTimer)
    unconfigureAnchorEl()
  })

  return {
    anchorEl,
    canShow,
    anchorEvents
  }
}
