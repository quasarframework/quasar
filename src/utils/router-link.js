import { isServer } from '../features/platform'

export const routerLinkEventName = 'qrouterlinkclick'

let evt

try {
  evt = new Event(routerLinkEventName)
}
catch (e) {
  if (!isServer) {
    // IE doesn't support `new Event()`, so...`
    evt = document.createEvent('Event')
    evt.initEvent(routerLinkEventName, true, false)
  }
}

export { evt as routerLinkEvent }

export const RouterLinkMixin = {
  props: {
    to: [String, Object],
    exact: Boolean,
    append: Boolean,
    replace: Boolean
  },
  data () {
    return {
      routerLinkEventName
    }
  }
}
