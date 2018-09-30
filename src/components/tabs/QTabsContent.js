import Vue from 'vue'

import { PanelParentMixin } from '../../mixins/panel.js'

export default Vue.extend({
  name: 'QTabsContent',

  mixins: [ PanelParentMixin ],

  props: {
    swipeable: Boolean
  },

  methods: {
    __swipe (evt) {
      this.__go(evt.direction === 'left' ? 1 : -1)
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-tabs-content relative-position',
      directives: this.swipeable ? [{
        name: 'touch-swipe',
        value: this.__swipe
      }] : null
    }, this.__getPanelContent(h))
  }
})
