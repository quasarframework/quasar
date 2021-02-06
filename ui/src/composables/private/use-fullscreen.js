import { ref, watch, onBeforeMount, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'

import History from '../../history.js'
import { vmHasRouter } from '../../utils/private/vm.js'

export const useFullscreenProps = {
  fullscreen: Boolean,
  noRouteFullscreenExit: Boolean
}

export const useFullscreenEmits = [ 'update:fullscreen', 'fullscreen' ]

export default function () {
  const vm = getCurrentInstance()
  const { props, emit, proxy } = vm

  let historyEntry, fullscreenFillerNode, container
  const inFullscreen = ref(false)

  vmHasRouter(vm) === true && watch(() => proxy.$route, () => {
    props.noRouteFullscreenExit !== true && exitFullscreen()
  })

  watch(() => props.fullscreen, v => {
    if (inFullscreen.value !== v) {
      toggleFullscreen()
    }
  })

  watch(inFullscreen, v => {
    emit('update:fullscreen', v)
    emit('fullscreen', v)
  })

  function toggleFullscreen () {
    if (inFullscreen.value === true) {
      exitFullscreen()
    }
    else {
      setFullscreen()
    }
  }

  function setFullscreen () {
    if (inFullscreen.value === true) {
      return
    }

    inFullscreen.value = true
    container = proxy.$el.parentNode
    container.replaceChild(fullscreenFillerNode, proxy.$el)
    document.body.appendChild(proxy.$el)
    document.body.classList.add('q-body--fullscreen-mixin')

    historyEntry = {
      handler: exitFullscreen
    }
    History.add(historyEntry)
  }

  function exitFullscreen () {
    if (inFullscreen.value !== true) {
      return
    }

    if (historyEntry !== void 0) {
      History.remove(historyEntry)
      historyEntry = void 0
    }

    container.replaceChild(proxy.$el, fullscreenFillerNode)
    document.body.classList.remove('q-body--fullscreen-mixin')
    inFullscreen.value = false

    if (proxy.$el.scrollIntoView !== void 0) {
      setTimeout(() => { proxy.$el.scrollIntoView() })
    }
  }

  onBeforeMount(() => {
    fullscreenFillerNode = document.createElement('span')
  })

  onMounted(() => {
    props.fullscreen === true && setFullscreen()
  })

  onBeforeUnmount(exitFullscreen)

  // expose public methods
  Object.assign(proxy, {
    toggleFullscreen,
    setFullscreen,
    exitFullscreen
  })

  return {
    inFullscreen,
    toggleFullscreen
  }
}
