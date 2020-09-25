import { h, defineComponent } from 'vue'

import TagMixin from '../../mixins/tag.js'

import { slot } from '../../utils/slot.js'

export default defineComponent({
  name: 'QCardSection',

  mixins: [ TagMixin ],

  props: {
    horizontal: Boolean
  },

  computed: {
    classes () {
      return 'q-card__section' +
        ` q-card__section--${this.horizontal === true ? 'horiz row no-wrap' : 'vert'}`
    }
  },

  render () {
    return h(this.tag, { class: this.classes }, slot(this, 'default'))
  }
})
