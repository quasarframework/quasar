import QItem from './QItem'
import QItemMain from './QItemMain'
import QItemSide from './QItemSide'

function push (child, h, name, slot, replace, conf) {
  const defaultProps = { props: { right: conf.right } }

  if (slot && replace) {
    child.push(h(name, defaultProps, slot))
    return
  }

  let v = false
  for (let p in conf) {
    if (conf.hasOwnProperty(p)) {
      v = conf[p]
      if (v !== void 0 && v !== true) {
        child.push(h(name, { props: conf }))
        break
      }
    }
  }

  slot && child.push(h(name, defaultProps, slot))
}

export default {
  name: 'q-item-wrapper',
  functional: true,
  props: {
    cfg: {
      type: Object,
      default: () => ({})
    },
    slotReplace: Boolean
  },
  render (h, ctx) {
    const
      cfg = ctx.props.cfg,
      replace = ctx.props.slotReplace,
      slot = ctx.slots(),
      child = []

    push(child, h, QItemSide, slot.left, replace, {
      icon: cfg.icon,
      color: cfg.leftColor,
      avatar: cfg.avatar,
      letter: cfg.letter,
      image: cfg.image
    })

    push(child, h, QItemMain, slot.main, replace, {
      label: cfg.label,
      sublabel: cfg.sublabel,
      labelLines: cfg.labelLines,
      sublabelLines: cfg.sublabelLines,
      inset: cfg.inset
    })

    push(child, h, QItemSide, slot.right, replace, {
      right: true,
      icon: cfg.rightIcon,
      color: cfg.rightColor,
      avatar: cfg.rightAvatar,
      letter: cfg.rightLetter,
      image: cfg.rightImage,
      stamp: cfg.stamp
    })

    if (slot.default) {
      child.push(slot.default)
    }

    ctx.data.props = cfg
    return h(QItem, ctx.data, child)
  }
}
