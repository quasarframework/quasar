import {
  getCurrentInstance,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

import History from '../../plugins/private.history/History.js'
import {
  getTeleportTarget,
  getTeleportTargetElement
} from '../../utils/private.dom/teleport-target.js'
import { vmHasRouter } from '../../utils/private.vm/vm.js'

let counter = 0

export const useFullscreenProps = {
  fullscreen: Boolean,
  noRouteFullscreenExit: Boolean
}

export const useFullscreenEmits = ['update:fullscreen', 'fullscreen']

export default function useFullscreen() {
  const vm = getCurrentInstance()
  const { props, emit, proxy } = vm

  let historyEntry,
    fullscreenFillerNode,
    fullscreenTarget,
    fullscreenTargetElement,
    isUnmounting = false
  const inFullscreen = ref(false)

  if (vmHasRouter(vm)) {
    watch(
      () => proxy.$route.fullPath,
      () => {
        if (!props.noRouteFullscreenExit) exitFullscreen()
      }
    )
  }

  watch(
    () => props.fullscreen,
    v => {
      if (inFullscreen.value !== v) toggleFullscreen()
    }
  )

  watch(inFullscreen, v => {
    emit('update:fullscreen', v)
    emit('fullscreen', v)
  })

  function toggleFullscreen() {
    if (inFullscreen.value) {
      exitFullscreen()
    } else {
      setFullscreen()
    }
  }

  function setFullscreen() {
    if (inFullscreen.value) return

    inFullscreen.value = true
    proxy.$el.replaceWith(fullscreenFillerNode)
    fullscreenTarget = getTeleportTarget()
    fullscreenTargetElement = getTeleportTargetElement()
    fullscreenTarget.append(proxy.$el)

    counter++
    if (counter === 1) {
      fullscreenTargetElement.classList.add('q-body--fullscreen-mixin')
    }

    historyEntry = {
      handler: exitFullscreen
    }
    History.add(historyEntry)
  }

  function exitFullscreen() {
    if (!inFullscreen.value) return

    if (historyEntry !== void 0) {
      History.remove(historyEntry)
      historyEntry = void 0
    }

    fullscreenFillerNode.replaceWith(proxy.$el)
    inFullscreen.value = false

    counter = Math.max(0, counter - 1)

    if (counter === 0) {
      fullscreenTargetElement.classList.remove('q-body--fullscreen-mixin')

      if (!isUnmounting && proxy.$el.scrollIntoView !== void 0) {
        setTimeout(() => {
          proxy.$el.scrollIntoView()
        }, 0)
      }
    }
  }

  onBeforeMount(() => {
    fullscreenFillerNode = document.createElement('span')
  })

  onMounted(() => {
    if (props.fullscreen) setFullscreen()
  })

  onBeforeUnmount(() => {
    isUnmounting = true
    exitFullscreen()
  })

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
