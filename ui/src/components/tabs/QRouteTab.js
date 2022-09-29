import Vue from 'vue'

import QTab from './QTab.js'
import RouterLinkMixin from '../../mixins/router-link.js'

export default Vue.extend({
  name: 'QRouteTab',

  mixins: [ QTab, RouterLinkMixin ],

  watch: {
    routeModel () {
      this.$tabs.__verifyRouteModel()
    }
  },

  computed: {
    routeModel () {
      return `${this.name} | ${this.exact} | ${(this.resolvedLink || {}).href}`
    },

    // overwritten from RouterLinkMixin
    // because we want to discard the "disable" state
    hasRouterLinkProps () {
      return this.$router !== void 0 &&
        this.hasHrefLink !== true &&
        this.to !== void 0 && this.to !== null && this.to !== ''
    }
  },

  render (h) {
    return this.__renderTab(h, this.linkTag)
  }
})
