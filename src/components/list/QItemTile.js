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
      icon = prop.icon || prop.invertedIcon

    data.staticClass = `q-item-${type}${prop.color ? ` text-${prop.color}` : ''}${cls ? ` ${cls}` : ''}`

    if (icon) {
      data.props = { name: icon }
      if (prop.inverted) {
        data.staticClass += ' q-item-icon-inverted'
      }
      return h(QIcon, data, ctx.children)
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
