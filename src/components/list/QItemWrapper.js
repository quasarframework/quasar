import QItem from './QItem'
import QItemMain from './QItemMain'
import QItemSide from './QItemSide'

function push (child, h, name, slot, replace, conf) {
  if (slot && replace) {
    child.push(h(name, slot))
    return
  }
  const props = Object.values(conf).some(p => p !== void 0 && p !== true)
  if (props || slot) {
    child.push(h(name, props ? {props: conf} : {}, slot))
  }
}

export default {
  name: 'q-item-wrapper',
  functional: true,
  props: {
    cfg: {
      type: Object,
      default () {
        return {}
      }
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
