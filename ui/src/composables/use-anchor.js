import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

import { clearSelection } from '../utils/selection.js'
import { addEvt, cleanEvt, prevent } from '../utils/event.js'
import { getTouchTarget } from '../utils/touch.js'
import { isKeyCode } from '../utils/key-composition.js'

export const useAnchorProps = {
  target: {
    default: true
  },
  noParentEvent: Boolean,
  contextMenu: Boolean
}

export default function (props, {
  emit,
  vm,
  showing,
  configureAnchorEl
}) {
  const anchorEl = ref(null)
  const vmProxy = vm.proxy

  let touchTimer

  function showCondition (evt) {
    // abort with no parent configured or on multi-touch
    if (anchorEl.value === null) {
      return false
    }
    if (evt === void 0) {
      return true
    }
    return evt.touches === void 0 || evt.touches.length <= 1
  }

  const anchorEvents = {
    contextClick (evt) {
      vmProxy.hide(evt)
      nextTick(() => { vmProxy.show(evt) })
      prevent(evt)
    },

    toggleKey (evt) {
      isKeyCode(evt, 13) === true && vmProxy.toggle(evt)
    },

    mobilePrevent: prevent,

    mobileTouch (evt) {
      anchorEvents.mobileCleanup(evt)

      if (showCondition(evt) !== true) {
        return
      }

      vmProxy.hide(evt)
      anchorEl.value.classList.add('non-selectable')

      const target = getTouchTarget(evt.target)
      addEvt(anchorEvents, 'anchor', [
        [ target, 'touchmove', 'mobileCleanup', 'passive' ],
        [ target, 'touchend', 'mobileCleanup', 'passive' ],
        [ target, 'touchcancel', 'mobileCleanup', 'passive' ],
        [ anchorEl.value, 'contextmenu', 'mobilePrevent', 'notPassive' ]
      ])

      touchTimer = setTimeout(() => {
        vmProxy.show(evt)
      }, 300)
    },

    mobileCleanup (evt) {
      anchorEl.value.classList.remove('non-selectable')
      clearTimeout(touchTimer)

      if (showing.value === true && evt !== void 0) {
        clearSelection()
      }
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
      setAnchorEl(vmProxy.$el.parentNode)
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
        // TODO vue3 - correctly handle el._isVue
        anchorEl.value = el._isVue === true && el.$el !== void 0 ? el.$el : el
        configureAnchorEl()
      }
      else {
        anchorEl.value = null
        console.error(`Anchor: target "${props.target}" not found`)
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

    if (props.modelValue === true && anchorEl.value === null) {
      emit('update:modelValue', false)
    }
  })

  onBeforeUnmount(() => {
    clearTimeout(touchTimer)
    unconfigureAnchorEl()
  })

  return {
    anchorEl,
    showCondition,
    anchorEvents
  }
}
