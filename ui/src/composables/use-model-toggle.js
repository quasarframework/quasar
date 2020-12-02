import { ref, watch, nextTick } from 'vue'

export const useModelToggleProps = {
  modelValue: {
    type: Boolean,
    default: null
  }
}

export const useModelToggleEmits = [
  'update:modelValue', 'before-show', 'show', 'before-hide', 'hide'
]

// handleShow/handleHide -> removetTick(), self (& emit show), planTick()

export default function (props, {
  emit,
  showing = ref(false),
  showCondition,
  hideOnRouteChange,
  emitListeners,
  handleShow, // __show
  handleHide // __hide
}) {
  let payload

  function toggle (evt) {
    if (showing.value === true) {
      show()
    }
    else {
      hide()
    }
  }

  function show (evt) {
    if (props.disable === true || (showCondition !== void 0 && showCondition(evt) !== true)) {
      return
    }

    const listener = emitListeners.value[ 'onUpdate:modelValue' ] === true

    if (listener === true && __QUASAR_SSR_SERVER__ !== true) {
      emit('update:modelValue', true)
      payload = evt
      nextTick(() => {
        if (payload === evt) {
          payload = void 0
        }
      })
    }

    if (props.modelValue === null || listener === false || __QUASAR_SSR_SERVER__) {
      processShow(evt)
    }
  }

  function processShow (evt) {
    if (showing.value === true) {
      return
    }

    showing.value = true

    emit('before-show', evt)

    if (handleShow !== void 0) {
      handleShow(evt)
    }
    else {
      emit('show', evt)
    }
  }

  function hide (evt) {
    if (__QUASAR_SSR_SERVER__ || props.disable === true) {
      return
    }

    const listener = emitListeners.value[ 'onUpdate:modelValue' ] === true

    if (listener === true && __QUASAR_SSR_SERVER__ !== true) {
      emit('update:modelValue', false)
      payload = evt
      nextTick(() => {
        if (payload === evt) {
          payload = void 0
        }
      })
    }

    if (props.modelValue === null || listener === false || __QUASAR_SSR_SERVER__) {
      processHide(evt)
    }
  }

  function processHide (evt) {
    if (showing.value === false) {
      return
    }

    showing.value = false

    emit('before-hide', evt)

    if (handleHide !== void 0) {
      handleHide(evt)
    }
    else {
      emit('hide', evt)
    }
  }

  function processModelChange (val) {
    if (props.disable === true && val === true) {
      if (emitListeners.value[ 'onUpdate:modelValue' ] === true) {
        emit('update:modelValue', false)
      }
    }
    else if ((val === true) !== showing.value) {
      const fn = val === true ? processShow : processHide
      fn(payload)
    }
  }

  watch(() => props.modelValue, processModelChange)
  // TODO vue3 - handle router for UMD as well
  // watch('$route', () => {
  //   if (hideOnRouteChange.value === true && showing.value === true) {
  //     hide()
  //   }
  // })

  return {
    show,
    hide,
    toggle,

    showing
  }
}
