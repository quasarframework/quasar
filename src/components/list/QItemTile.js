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
      icon = prop.icon,
      textColor = prop.color ? ` text-${prop.color}` : ''

    data.staticClass = `q-item-${type}${cls ? ` ${cls}` : ''}`

    if (icon) {
      data.props = { name: icon }
      if (prop.inverted) {
        data.staticClass += ' q-item-icon-inverted'
        if (prop.color) {
          data.staticClass += ` bg-${prop.color}`
        }
      }
      else {
        data.staticClass += textColor
      }
      return h(QIcon, data, ctx.children)
    }
    else if (prop.letter && prop.inverted) {
      data.staticClass += ' q-item-letter-inverted'
      if (prop.color) {
        data.staticClass += ` bg-${prop.color}`
      }
    }
    else {
      data.staticClass += textColor
    }
    if ((prop.label || prop.sublabel) && prop.lines) {
      if (prop.lines === '1' || prop.lines === 1) {
        data.staticClass += ' ellipsis'
      }
      data.style = [data.style, textStyle(prop.lines)]
    }

    return h(prop.tag, data, ctx.children)
  }
}
