import { isSSR } from '../plugins/platform'

export const routerLinkEventName = 'qrouterlinkclick'

let evt = null

if (!isSSR) {
  try {
    evt = new Event(routerLinkEventName)
  }
  catch (e) {
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
    replace: Boolean,
    event: [String, Array],
    activeClass: String,
    exactActiveClass: String
  },
  data () {
    return {
      routerLinkEventName
    }
  }
}
