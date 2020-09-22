import { h, defineComponent } from 'vue'

import { slot } from '../../utils/slot.js'

export default defineComponent({
  name: 'QItemLabel',

  props: {
    overline: Boolean,
    caption: Boolean,
    header: Boolean,
    lines: [ Number, String ]
  },

  computed: {
    classes () {
      return 'q-item__label' +
        (this.overline === true ? ' q-item__label--overline text-overline' : '') +
        (this.caption === true ? ' q-item__label--caption text-caption' : '') +
        (this.header === true ? ' q-item__label--header' : '') +
        (parseInt(this.lines, 10) === 1 ? ' ellipsis' : '')
    },

    style () {
      if (this.lines !== void 0 && parseInt(this.lines, 10) > 1) {
        return {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': this.lines
        }
      }
    }
  },

  render () {
    return h('div', {
      style: this.style,
      class: this.classes
    }, slot(this, 'default'))
  }
})
