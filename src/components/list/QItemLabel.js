import Vue from 'vue'

export default Vue.extend({
  name: 'QItemLabel',

  props: {
    overline: Boolean,
    caption: Boolean,
    header: Boolean,
    inset: Boolean,
    lines: [Number, String]
  },

  computed: {
    classes () {
      const title = !this.overline && !this.caption

      return {
        'q-item__label--overline text-overline': this.overline,
        'q-item__label--title': title,
        'q-item__label--caption text-caption': this.caption,
        'q-item__label--header': this.header,
        'q-item__label--inset': this.inset,
        'ellipsis': parseInt(this.lines, 10) === 1
      }
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

  render (h) {
    return h('div', {
      staticClass: 'q-item__label',
      style: this.style,
      class: this.classes
    }, this.$slots.default)
  }
})
