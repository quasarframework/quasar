import { getEventPath } from '../utils/event'
import { hasScrollbar } from '../utils/scroll'

let registered = 0

function onWheel (e) {
  if (shouldPreventScroll(e)) {
    e.preventDefault()
  }
}

function shouldPreventScroll (e) {
  if (e.target === document.body) {
    return true
  }

  const
    path = getEventPath(e),
    delta = e.deltaY || -e.wheelDelta

  for (let index = 0; index < path.length; index++) {
    const el = path[index]

    if (hasScrollbar(el)) {
      return delta < 0 && el.scrollTop === 0
        ? true
        : delta > 0 && el.scrollTop + el.clientHeight === el.scrollHeight
    }
  }

  return true
}

export default {
  methods: {
    __preventScroll (register) {
      if (!this.$q.platform.is.desktop) {
        return
      }

      registered += register ? 1 : -1
      if (registered > 1) { return }

      const action = `${register ? 'add' : 'remove'}EventListener`
      window[action]('wheel', onWheel)
    }
  }
}
