import Vue from 'vue'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QBadge',

  props: {
    color: String,
    textColor: String,

    floating: Boolean,
    transparent: Boolean,

    label: [Number, String],

    align: {
      type: String,
      validator: v => ['top', 'middle', 'bottom'].includes(v)
    }
  },

  computed: {
    style () {
      if (this.align !== void 0) {
        return { verticalAlign: this.align }
      }
    },

    classes () {
      return 'q-badge flex inline items-center no-wrap' +
        (this.color ? ` bg-${this.color}` : '') +
        (this.textColor !== void 0 ? ` text-${this.textColor}` : '') +
        (this.floating === true ? ' q-badge--floating' : '') +
        (this.transparent === true ? ' q-badge--transparent' : '')
    }
  },

  render (h) {
    return h('div', {
      style: this.style,
      class: this.classes
    }, this.label !== void 0 ? [ this.label ] : slot(this, 'default'))
  }
})
