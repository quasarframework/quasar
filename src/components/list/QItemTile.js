import { QIcon } from '../icon'
import { textStyle } from './list-utils'

export default {
  name: 'q-item-tile',
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

      if (this.inverted) {
        this.icon && cls.push('q-item-icon-inverted')
        this.letter && cls.push('q-item-letter-inverted')
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
      data.props = { name: this.icon }
    }

    return h(this.icon ? QIcon : 'div', data, [ this.$slots.default ])
  }
}
