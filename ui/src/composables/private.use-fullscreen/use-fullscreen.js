import {
  getCurrentInstance,
  onBeforeMount,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  watch
} from 'vue'

import History from '../../plugins/private.history/History.js'
import { vmHasRouter, vmIsDestroyed } from '../../utils/private.vm/vm.js'
import useTick from '../use-tick/use-tick.js'
import useAnimationFrame from '../use-animation-frame/use-animation-frame.js'
import {
  getHorizontalScrollPosition,
  getVerticalScrollPosition
} from '../../utils/scroll/scroll.js'

let counter = 0
let restoreState = null

export const useFullscreenProps = {
  fullscreen: Boolean,
  noRouteFullscreenExit: Boolean
}

export const useFullscreenEmits = ['update:fullscreen', 'fullscreen']

export default function useFullscreen() {
  const vm = getCurrentInstance()
  const { props, emit, proxy } = vm

  let historyEntry, fullscreenFillerNode

  const inFullscreen = ref(false)
  const { registerTick, removeTick } = useTick()
  const { registerAnimationFrame, removeAnimationFrame } = useAnimationFrame()

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
    if (vmIsDestroyed(vm) || inFullscreen.value) return

    removeAnimationFrame()
    removeTick()

    if (counter === 0) {
      restoreState = {
        left: getHorizontalScrollPosition(window),
        top: getVerticalScrollPosition(window),
        width: window.innerWidth,
        height: window.innerHeight
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
    if (counter !== 0) return

    document.body.classList.remove('q-body--fullscreen-mixin')

    if (restoreState === null) return

    const { left, top, width, height } = restoreState
    restoreState = null

    if (vmIsDestroyed(vm)) return

    registerTick(() => {
      if (counter !== 0) return
      registerAnimationFrame(() => {
        if (counter !== 0) return

        if (window.innerWidth !== width || window.innerHeight !== height) {
          /**
           * If user has resized the window while in fullscreen mode,
           * we cannot restore the scroll position because it will be wrong.
           * So we just scroll the element into view instead,
           * which is the best we can do.
           */
          proxy.$el.scrollIntoView()
        } else {
          window.scrollTo(left, top)
        }
      })
    })
  }

  onBeforeMount(() => {
    fullscreenFillerNode = document.createElement('span')
  })

  onMounted(() => {
    if (props.fullscreen) setFullscreen()
  })

  onDeactivated(exitFullscreen)
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
