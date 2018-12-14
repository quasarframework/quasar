import Vue from 'vue'

import QTab from './QTab.js'
import { RouterLinkMixin } from '../../mixins/router-link.js'

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
      this.$nextTick(() => {
        this.__checkActivation()
      })
    }
  },

  methods: {
    activate (e) {
      this.$emit('click', e)
      !this.disable && this.__activateRoute({ name: this.name, selected: true })
      this.$el.blur()
    },

    __checkActivation () {
      if (this.isExactActiveRoute(this.$el)) {
        this.__activateRoute({ name: this.name, selectable: true, exact: true })
      }
      else if (this.isActiveRoute(this.$el)) {
        const priority = this.$router.resolve(this.to, undefined, this.append).href.length
        this.__activateRoute({ name: this.name, selectable: true, priority })
      }
      else if (this.isActive) {
        this.__activateRoute({ name: null })
      }
    }
  },

  mounted () {
    this.__checkActivation()
  },

  render (h) {
    return this.__render(h, 'router-link', this.routerLinkProps)
  }
})
