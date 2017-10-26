import { textStyle } from './list-utils'

function text (h, name, val, n) {
  n = parseInt(n, 10)
  return h('div', {
    staticClass: `q-item-${name}${n === 1 ? ' ellipsis' : ''}`,
    style: textStyle(n),
    domProps: { innerHTML: val }
  })
}

export default {
  name: 'q-item-main',
  functional: true,
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
  render (h, ctx) {
    const
      data = ctx.data,
      classes = data.staticClass,
      prop = ctx.props,
      child = []

    if (prop.label) {
      child.push(text(h, 'label', prop.label, prop.labelLines))
    }
    if (prop.sublabel) {
      child.push(text(h, 'sublabel', prop.sublabel, prop.sublabelLines))
    }

    child.push(ctx.children)
    data.staticClass = `q-item-main q-item-section${prop.inset ? ' q-item-main-inset' : ''}${classes ? ` ${classes}` : ''}`

    return h(prop.tag, data, child)
  }
}
