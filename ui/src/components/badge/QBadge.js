import { h, defineComponent } from 'vue'

import { hSlot } from '../../utils/render.js'

const alignValues = [ 'top', 'middle', 'bottom' ]

export default defineComponent({
  name: 'QBadge',

  props: {
    color: String,
    textColor: String,

    floating: Boolean,
    transparent: Boolean,
    multiLine: Boolean,
    outline: Boolean,

    label: [ Number, String ],

    align: {
      type: String,
      validator: v => alignValues.includes(v)
    }
  },

  computed: {
    style () {
      if (this.align !== void 0) {
        return { verticalAlign: this.align }
      }
    },

    classes () {
      const text = this.outline === true
        ? this.color || this.textColor
        : this.textColor

      return 'q-badge flex inline items-center no-wrap' +
        ` q-badge--${this.multiLine === true ? 'multi' : 'single'}-line` +
        (this.outline === true
          ? ' q-badge--outline'
          : (this.color !== void 0 ? ` bg-${this.color}` : '')
        ) +
        (text !== void 0 ? ` text-${text}` : '') +
        (this.floating === true ? ' q-badge--floating' : '') +
        (this.transparent === true ? ' q-badge--transparent' : '')
    }
  },

  render () {
    return h('div', {
      class: this.classes,
      style: this.style,
      role: 'alert',
      'aria-label': this.label
    }, this.label !== void 0 ? [this.label] : hSlot(this, 'default'))
  }
})
