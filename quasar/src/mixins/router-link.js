import { isSSR } from '../plugins/Platform.js'

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

export const routerLinkProps = {
  to: [String, Object],
  exact: Boolean,
  append: Boolean,
  replace: Boolean,
  activeClass: String,
  exactActiveClass: String
}

export { evt as routerLinkEvent }

export const RouterLinkMixin = {
  props: routerLinkProps,

  computed: {
    hasRouterLink () {
      return this.to !== void 0
    },

    routerLinkProps () {
      return {
        to: this.to,
        exact: this.exact,
        append: this.append,
        replace: this.replace,
        activeClass: this.activeClass || 'q-router-link--active',
        exactActiveClass: this.exactActiveClass || 'q-router-link--exact-active'
      }
    }
  },

  methods: {
    isExactActiveRoute (el) {
      return el.classList.contains(this.exactActiveClass || 'q-router-link--exact-active')
    },

    isActiveRoute (el) {
      return el.classList.contains(this.activeClass || 'q-router-link--active')
    }
  }
}
