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
    __activateRoute: {}
  },

  watch: {
    $route () {
      this.__checkActivation()
    }
  },

  methods: {
    activate (e) {
      if (this.disable !== true) {
        this.__checkActivation(true)
      }

      this.$el.blur()
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
      redirected === true && checkFunction(current, location) && this.__activateRoute(params)
      this.isActive && this.__activateRoute()
    }
  },

  mounted () {
    this.$router !== void 0 && this.__checkActivation()
  },

  beforeDestroy () {
    this.__activateRoute({ remove: true, name: this.name })
  },

  render (h) {
    return this.__render(h, 'router-link', this.routerLinkProps)
  }
})
