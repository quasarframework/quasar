import QIcon from '../icon/QIcon.js'
import { textStyle } from '../../mixins/item.js'

export default {
  name: 'QItemTile',
  props: {
    icon: String,
    letter: Boolean,
    inverted: Boolean, // for icon and letter only

    image: Boolean,
    avatar: Boolean,
    stamp: Boolean,

    label: Boolean,
    sublabel: Boolean,
    lines: [Number, String],

    tag: {
      type: String,
      default: 'div'
    },

    color: String,
    textColor: String // only for inverted icon/letter
  },
  computed: {
    hasLines () {
      return (this.label || this.sublabel) && this.lines
    },
    type () {
      return ['icon', 'label', 'sublabel', 'image', 'avatar', 'letter', 'stamp'].find(type => this[type])
    },
    classes () {
      const cls = []

      if (this.color) {
        if (this.inverted) {
          cls.push(`bg-${this.color}`)
        }
        else if (!this.textColor) {
          cls.push(`text-${this.color}`)
        }
      }
      this.textColor && cls.push(`text-${this.textColor}`)
      this.type && cls.push(`q-item-${this.type}`)

      if (this.inverted && (this.icon || this.letter)) {
        cls.push('q-item-inverted')
        cls.push('flex')
        cls.push('flex-center')
      }

      if (this.hasLines && (this.lines === '1' || this.lines === 1)) {
        cls.push('ellipsis')
      }

      return cls
    },
    style () {
      if (this.hasLines) {
        return textStyle(this.lines)
      }
    }
  },
  render (h) {
    const data = {
      'class': this.classes,
      style: this.style
    }

    if (this.icon) {
      if (this.inverted) {
        return h(this.tag, data, [
          h(QIcon, { props: { name: this.icon } }, this.$slots.default)
        ])
      }
      data.props = { name: this.icon }
    }

    return h(this.icon ? QIcon : this.tag, data, this.$slots.default)
  }
}
