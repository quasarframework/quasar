import { getCurrentInstance, watch } from 'vue'

import useSoftFullscreen from '../use-soft-fullscreen/use-soft-fullscreen.js'

export const useFullscreenProps = {
  fullscreen: Boolean,
  noRouteFullscreenExit: Boolean
}

export const useFullscreenEmits = ['update:fullscreen', 'fullscreen']

/*
 * The prop/emit face of the public useSoftFullscreen() composable for the
 * components carrying the `fullscreen` prop (QTable, QCarousel, QEditor):
 * the component's root element follows the prop, and the state gets
 * emitted as `fullscreen` and `update:fullscreen`
 */
export default function useInternalFullscreen() {
  const { props, emit, proxy } = getCurrentInstance()

  const { inFullscreen, toggleFullscreen, setFullscreen, exitFullscreen } =
    useSoftFullscreen(() => ({
      fullscreen: props.fullscreen,
      noRouteExit: props.noRouteFullscreenExit
    }))

  watch(inFullscreen, v => {
    emit('update:fullscreen', v)
    emit('fullscreen', v)
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
