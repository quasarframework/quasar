import Vue from 'vue'

import QTab from './QTab.js'
import { RouterLinkMixin } from '../../mixins/router-link.js'
import { isSameRoute, isIncludedRoute } from '../../utils/router.js'

export default Vue.extend({
  name: 'QRouteTab',

  mixins: [ QTab, RouterLinkMixin ],

  props: {
    to: { required: true }
  },

  inject: {
    __activateRoute: {},
    __recalculateScroll: {}
  },

  watch: {
    $route () {
      this.__checkActivation()
    }
  },

  methods: {
    __activate (e, keyboard) {
      if (this.disable !== true) {
        this.__checkActivation(true)
      }

      if (keyboard === true) {
        this.$el.focus(e)
      }
      else {
        this.$refs.blurTarget !== void 0 && this.$refs.blurTarget.focus(e)
      }
    },

    __checkActivation (selected = false) {
      const
        current = this.$route,
        { href, location, route } = this.$router.resolve(this.to, current, this.append),
        redirected = route.redirectedFrom !== void 0,
        checkFunction = this.exact === true ? isSameRoute : isIncludedRoute,
        params = {
          name: this.name,
          selected,
          exact: this.exact,
          priorityMatched: route.matched.length,
          priorityHref: href.length
        }

      checkFunction(current, route) && this.__activateRoute({ ...params, redirected })
      redirected === true && checkFunction(current, {
        path: route.redirectedFrom,
        ...location
      }) && this.__activateRoute(params)
      this.isActive && this.__activateRoute()
    }
  },

  mounted () {
    this.__recalculateScroll()
    this.$router !== void 0 && this.__checkActivation()
  },

  beforeDestroy () {
    this.__recalculateScroll()
    this.__activateRoute({ remove: true, name: this.name })
  },

  render (h) {
    return this.__renderTab(h, 'router-link', this.routerLinkProps)
  }
})
