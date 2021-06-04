import { ref, watch, onMounted, onBeforeUnmount, nextTick, getCurrentInstance } from 'vue'

import { clearSelection } from '../../utils/private/selection.js'
import { addEvt, cleanEvt, prevent } from '../../utils/event.js'
import { isKeyCode } from '../../utils/private/key-composition.js'

export const useAnchorProps = {
  target: {
    default: true
  },
  noParentEvent: Boolean,
  contextMenu: Boolean
}

export default function ({
  showing,
  avoidEmit, // required for QPopupProxy (true)
  configureAnchorEl // optional
}) {
  const { props, proxy, emit } = getCurrentInstance()

  const anchorEl = ref(null)

  let touchTimer

  function canShow (evt) {
    // abort with no parent configured or on multi-touch
    return anchorEl.value === null
      ? false
      : (evt === void 0 || evt.touches === void 0 || evt.touches.length <= 1)
  }

  const anchorEvents = {}

  if (configureAnchorEl === void 0) {
    // default configureAnchorEl is designed for
    // QMenu & QPopupProxy (which is why it's handled here)

    Object.assign(anchorEvents, {
      hide (evt) {
        proxy.hide(evt)
      },

      toggle (evt) {
        proxy.toggle(evt)
      },

      toggleKey (evt) {
        isKeyCode(evt, 13) === true && proxy.toggle(evt)
      },

      contextClick (evt) {
        proxy.hide(evt)
        nextTick(() => { proxy.show(evt) })
        prevent(evt)
      },

      mobilePrevent: prevent,

      mobileTouch (evt) {
        anchorEvents.mobileCleanup(evt)

        if (canShow(evt) !== true) {
          return
        }

        proxy.hide(evt)
        anchorEl.value.classList.add('non-selectable')

        const target = evt.target
        addEvt(anchorEvents, 'anchor', [
          [ target, 'touchmove', 'mobileCleanup', 'passive' ],
          [ target, 'touchend', 'mobileCleanup', 'passive' ],
          [ target, 'touchcancel', 'mobileCleanup', 'passive' ],
          [ anchorEl.value, 'contextmenu', 'mobilePrevent', 'notPassive' ]
        ])

        touchTimer = setTimeout(() => {
          proxy.show(evt)
        }, 300)
      },

      mobileCleanup (evt) {
        anchorEl.value.classList.remove('non-selectable')
        clearTimeout(touchTimer)

        if (showing.value === true && evt !== void 0) {
          clearSelection()
        }
      }
    })

    configureAnchorEl = function (context = props.contextMenu) {
      if (props.noParentEvent === true || anchorEl.value === null) { return }

      let evts

      if (context === true) {
        if (proxy.$q.platform.is.mobile === true) {
          evts = [
            [ anchorEl.value, 'touchstart', 'mobileTouch', 'passive' ]
          ]
        }
        else {
          evts = [
            [ anchorEl.value, 'click', 'hide', 'passive' ],
            [ anchorEl.value, 'contextmenu', 'contextClick', 'notPassive' ]
          ]
        }
      }
      else {
        evts = [
          [ anchorEl.value, 'click', 'toggle', 'passive' ],
          [ anchorEl.value, 'keyup', 'toggleKey', 'passive' ]
        ]
      }

      addEvt(anchorEvents, 'anchor', evts)
    }
  }

  function unconfigureAnchorEl () {
    cleanEvt(anchorEvents, 'anchor')
  }

  function setAnchorEl (el) {
    anchorEl.value = el
    while (anchorEl.value.classList.contains('q-anchor--skip')) {
      anchorEl.value = anchorEl.value.parentNode
    }
    configureAnchorEl()
  }

  function pickAnchorEl () {
    if (props.target === false || props.target === '') {
      anchorEl.value = null
    }
    else if (props.target === true) {
      setAnchorEl(proxy.$el.parentNode)
    }
    else {
      let el = props.target

      if (typeof props.target === 'string') {
        try {
          el = document.querySelector(props.target)
        }
        catch (err) {
          el = void 0
        }
      }

      if (el !== void 0 && el !== null) {
        anchorEl.value = el.$el || el
        configureAnchorEl()
      }
      else {
        anchorEl.value = null
        console.error(`Anchor: target "${ props.target }" not found`)
      }
    }
  }

  watch(() => props.contextMenu, val => {
    if (anchorEl.value !== null) {
      unconfigureAnchorEl()
      configureAnchorEl(val)
    }
  })

  watch(() => props.target, () => {
    if (anchorEl.value !== null) {
      unconfigureAnchorEl()
    }

    pickAnchorEl()
  })

  watch(() => props.noParentEvent, val => {
    if (anchorEl.value !== null) {
      if (val === true) {
        unconfigureAnchorEl()
      }
      else {
        configureAnchorEl()
      }
    }
  })

  onMounted(() => {
    pickAnchorEl()

    if (avoidEmit !== true && props.modelValue === true && anchorEl.value === null) {
      emit('update:modelValue', false)
    }
  })

  onBeforeUnmount(() => {
    clearTimeout(touchTimer)
    unconfigureAnchorEl()
  })

  return {
    anchorEl,
    canShow,
    anchorEvents
  }
}
