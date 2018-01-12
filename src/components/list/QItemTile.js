import { QIcon } from '../icon'
import { textStyle, getType } from './list-utils'

export default {
  name: 'q-item-tile',
  props: {
    icon: String,
    inverted: Boolean,

    image: Boolean,
    avatar: Boolean,
    letter: Boolean,
    stamp: Boolean,

    label: Boolean,
    sublabel: Boolean,
    lines: [Number, String],

    color: String,
    tag: {
      type: String,
      default: 'div'
    }
  },
  render (h) {
    const
      textColor = this.color ? ` text-${this.color}` : '',
      bgColor = this.color ? ` bg-${this.color}` : '',
      data = {
        'class': ['q-item-' + getType(this.$props)]
      }

    if (this.icon) {
      data.props = { name: this.icon }
      data['class'].push(
        this.inverted
          ? `q-item-icon-inverted${bgColor}`
          : textColor
      )

      return h(QIcon, data, [ this.$slots.default ])
    }

    data['class'].push(
      this.letter && this.inverted
        ? `q-item-letter-inverted${bgColor}`
        : textColor
    )

    if ((this.label || this.sublabel) && this.lines) {
      if (this.lines === '1' || this.lines === 1) {
        data['class'].push('ellipsis')
      }
      data.style = textStyle(this.lines)
    }

    return h(this.tag, data, [ this.$slots.default ])
  }
}
