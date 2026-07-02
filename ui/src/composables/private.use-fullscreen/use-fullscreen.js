import {
  getCurrentInstance,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

import History from '../../plugins/private.history/History.js'
import { vmHasRouter } from '../../utils/private.vm/vm.js'

let counter = 0

export const useFullscreenProps = {
  /**
   * Fullscreen mode
   *
   * @api prop fullscreen
   * @type {Boolean}
   * @category behavior
   * @syncable
   */
  fullscreen: Boolean,

  /**
   * Changing route app won't exit fullscreen
   *
   * @api prop no-route-fullscreen-exit
   * @type {Boolean}
   * @category behavior
   */
  noRouteFullscreenExit: Boolean
}

export const useFullscreenEmits = [
  /**
   * Emitted when fullscreen state changes
   *
   * @api event update:fullscreen
   * @param {Boolean} fullscreen Fullscreen state
   */
  'update:fullscreen',

  /**
   * Emitted when fullscreen state changes
   *
   * @api event fullscreen
   * @param {Boolean} fullscreen Fullscreen state
   */
  'fullscreen'
]

export default function useFullscreen() {
  const vm = getCurrentInstance()
  const { props, emit, proxy } = vm

  let historyEntry, fullscreenFillerNode
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

  /**
   * Toggle fullscreen mode
   *
   * @api method toggleFullscreen
   */
  function toggleFullscreen() {
    if (inFullscreen.value) {
      exitFullscreen()
    } else {
      setFullscreen()
    }
  }

  /**
   * Enter fullscreen mode
   *
   * @api method setFullscreen
   */
  function setFullscreen() {
    if (inFullscreen.value) return

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

  /**
   * Leave fullscreen mode
   *
   * @api method exitFullscreen
   */
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

      if (proxy.$el.scrollIntoView !== void 0) {
        setTimeout(() => {
          proxy.$el.scrollIntoView()
        })
      }
    }
  }

  onBeforeMount(() => {
    fullscreenFillerNode = document.createElement('span')
  })

  onMounted(() => {
    if (props.fullscreen) setFullscreen()
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
