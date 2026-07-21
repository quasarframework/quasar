import {
  getCurrentInstance,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

import History from '../../plugins/private.history/History.js'
import { vmHasRouter } from '../../utils/private.vm/vm.js'
import {
  getHorizontalScrollPosition,
  getVerticalScrollPosition
} from '../../utils/scroll/scroll.js'

let counter = 0
let bodyScrollPosition = null

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
    isUnmounting = false,
    restoreFrame = null,
    restoreToken = 0
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

  function cancelScrollRestore() {
    restoreToken++
    if (restoreFrame !== null) {
      cancelAnimationFrame(restoreFrame)
      restoreFrame = null
    }
  }

  function setFullscreen() {
    if (inFullscreen.value) return

    cancelScrollRestore()

    if (counter === 0) {
      bodyScrollPosition = {
        left: getHorizontalScrollPosition(window),
        top: getVerticalScrollPosition(window)
      }
    }

    inFullscreen.value = true
    proxy.$el.replaceWith(fullscreenFillerNode)
    document.body.append(proxy.$el)

    counter++
    if (counter === 1) {
      document.body.classList.add('q-body--fullscreen-mixin')
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
      document.body.classList.remove('q-body--fullscreen-mixin')

      if (isUnmounting === false && bodyScrollPosition !== null) {
        const { left, top } = bodyScrollPosition
        const token = ++restoreToken
        nextTick(() => {
          if (token !== restoreToken || counter !== 0) return
          restoreFrame = requestAnimationFrame(() => {
            restoreFrame = null
            if (token !== restoreToken || counter !== 0) return
            window.scrollTo(left, top)
          })
        })
      }

      bodyScrollPosition = null
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
    cancelScrollRestore()
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
