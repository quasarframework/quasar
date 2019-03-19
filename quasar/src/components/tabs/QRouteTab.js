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
        const
          current = this.$route,
          { route } = this.$router.resolve(this.to, current, this.append)

        this.$listeners.click !== void 0 && this.$emit('click', e)
        this.__activateRoute({ name: this.name, selected: true, selectable: isSameRoute(current, route) })
      }

      this.$el.blur()
    },

    __checkActivation () {
      const
        current = this.$route,
        { href, route } = this.$router.resolve(this.to, current, this.append)

      if (isSameRoute(current, route)) {
        this.__activateRoute({ name: this.name, selectable: true, exact: true })
      }
      else if (this.exact !== true && isIncludedRoute(current, route)) {
        const priority = href.length
        this.__activateRoute({ name: this.name, selectable: true, priority })
      }
      else if (this.isActive) {
        this.__activateRoute({ name: null })
      }
    }
  },

  mounted () {
    this.$router !== void 0 && this.__checkActivation()
  },

  render (h) {
    return this.__render(h, 'router-link', this.routerLinkProps)
  }
})
