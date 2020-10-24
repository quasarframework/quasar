import Vue from 'vue'

import TagMixin from '../../mixins/tag.js'
import ListenersMixin from '../../mixins/listeners.js'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QCardSection',

  mixins: [ ListenersMixin, TagMixin ],

  props: {
    horizontal: Boolean
  },

  computed: {
    classes () {
      return 'q-card__section ' +
        `q-card__section--${this.horizontal === true ? 'horiz row no-wrap' : 'vert'}`
    }
  },

  render (h) {
    return h(this.tag, {
      class: this.classes,
      on: { ...this.qListeners }
    }, slot(this, 'default'))
  }
})
