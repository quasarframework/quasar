import { getEventPath } from '../utils/event.js'
import { hasScrollbar } from '../utils/scroll.js'

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
      registered += register ? 1 : -1
      if (registered > 1) { return }

      const action = register ? 'add' : 'remove'

      if (this.$q.platform.is.mobile) {
        document.body.classList[action]('q-body-prevent-scroll')
      }
      else if (this.$q.platform.is.desktop) {
        window[`${action}EventListener`]('wheel', onWheel)
      }
    }
  }
}
