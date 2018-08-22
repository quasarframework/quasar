import { textStyle } from '../../mixins/item.js'

function text (h, name, val, n) {
  n = parseInt(n, 10)
  return h('div', {
    staticClass: `q-item-${name}${n === 1 ? ' ellipsis' : ''}`,
    style: textStyle(n)
  }, [ val ])
}

export default {
  name: 'QItemMain',
  props: {
    label: String,
    labelLines: [String, Number],
    sublabel: String,
    sublabelLines: [String, Number],
    inset: Boolean,
    tag: {
      type: String,
      default: 'div'
    }
  },
  render (h) {
    return h(this.tag, {
      staticClass: 'q-item-main q-item-section',
      'class': {
        'q-item-main-inset': this.inset
      }
    }, [
      this.label ? text(h, 'label', this.label, this.labelLines) : null,
      this.sublabel ? text(h, 'sublabel', this.sublabel, this.sublabelLines) : null,
      this.$slots.default
    ])
  }
}
