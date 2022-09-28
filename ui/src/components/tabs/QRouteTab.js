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
    }
  },

  render (h) {
    return this.__renderTab(h, this.linkTag)
  }
})
