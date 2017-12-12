import { QIcon } from '../icon'
import { textStyle, getType } from './list-utils'

export default {
  name: 'q-item-tile',
  functional: true,
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
  render (h, ctx) {
    const
      data = ctx.data,
      prop = ctx.props,
      cls = data.staticClass,
      type = getType(prop),
      textColor = prop.color ? ` text-${prop.color}` : '',
      bgColor = prop.color ? ` bg-${prop.color}` : ''

    data.staticClass = `q-item-${type}${cls ? ` ${cls}` : ''}`

    if (prop.icon) {
      data.props = { name: prop.icon }
      data.staticClass += prop.inverted
        ? ` q-item-icon-inverted${bgColor}`
        : textColor

      return h(QIcon, data, ctx.children)
    }

    data.staticClass += prop.letter && prop.inverted
      ? ` q-item-letter-inverted${bgColor}`
      : textColor

    if ((prop.label || prop.sublabel) && prop.lines) {
      if (prop.lines === '1' || prop.lines === 1) {
        data.staticClass += ' ellipsis'
      }
      data.style = [data.style, textStyle(prop.lines)]
    }

    return h(prop.tag, data, ctx.children)
  }
}
