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
  name: 'QItemWrapper',
  props: {
    cfg: {
      type: Object,
      default: () => ({})
    },
    slotReplace: Boolean
  },
  render (h) {
    const
      cfg = this.cfg,
      replace = this.slotReplace,
      child = []

    push(child, h, QItemSide, this.$slots.left, replace, {
      icon: cfg.icon,
      color: cfg.leftColor,
      avatar: cfg.avatar,
      letter: cfg.letter,
      image: cfg.image,
      inverted: cfg.leftInverted,
      textColor: cfg.leftTextColor
    })

    push(child, h, QItemMain, this.$slots.main, replace, {
      label: cfg.label,
      sublabel: cfg.sublabel,
      labelLines: cfg.labelLines,
      sublabelLines: cfg.sublabelLines,
      inset: cfg.inset
    })

    push(child, h, QItemSide, this.$slots.right, replace, {
      right: true,
      icon: cfg.rightIcon,
      color: cfg.rightColor,
      avatar: cfg.rightAvatar,
      letter: cfg.rightLetter,
      image: cfg.rightImage,
      stamp: cfg.stamp,
      inverted: cfg.rightInverted,
      textColor: cfg.rightTextColor
    })

    child.push(this.$slots.default)

    return h(QItem, {
      attrs: this.$attrs,
      on: this.$listeners,
      props: cfg
    }, child)
  }
}
