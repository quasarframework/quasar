import { defineComponent } from 'vue'

import QTab from './QTab.js'
import RouterLinkMixin from '../../mixins/router-link.js'

export default defineComponent({
  name: 'QRouteTab',

  mixins: [ QTab, RouterLinkMixin ],

  props: {
    to: { required: true }
  },

  watch: {
    name: '__pingQTabs',
    'linkRoute.href': '__pingQTabs',
    exact: '__pingQTabs'
  },

  methods: {
    __onClick (e, keyboard) {
      keyboard !== true && this.$refs.blurTarget && this.$refs.blurTarget.focus()

      if (this.disable !== true) {
        const go = () => {
          this.navigateToLink(e)
        }

        this.$emit('click', e, go)
        this.hasLink === true && e.navigate !== false && go()
      }
    },

    __pingQTabs () {
      this.__qTabs.__verifyRouteModel()
    }
  },

  render () {
    return this.__renderTab(
      this.linkTag,
      this.linkProps,
      this.__getContent()
    )
  }
})
