const alignMap = {
  left: 'start',
  center: 'center',
  right: 'end',
  justify: 'between'
}

export default {
  name: 'q-breadcrumbs',
  props: {
    color: {
      type: String,
      default: 'faded'
    },
    activeColor: {
      type: String,
      default: 'primary'
    },
    separator: {
      type: String,
      default: '/'
    },
    align: {
      type: String,
      default: 'left',
      validator: v => ['left', 'center', 'right', 'justify'].includes(v)
    }
  },
  computed: {
    computedAlign () {
      return alignMap[this.align]
    }
  },
  render (h) {
    const
      child = [],
      length = this.$slots.default.length - 1,
      separator = this.$slots.separator
        ? this.$slots.separator
        : this.separator,
      color = `text-${this.color}`,
      active = `text-${this.activeColor}`

    this.$slots.default.forEach((comp, i) => {
      if (comp.componentOptions && comp.componentOptions.tag === 'q-breadcrumb-el') {
        const middle = i < length

        child.push(h('div', { staticClass: `${middle ? active : color} ${middle ? 'text-weight-bold' : 'q-breadcrumb-last'}` }, [ comp ]))
        if (middle) {
          child.push(h('div', { staticClass: `q-breadcrumb-separator ${color}` }, [ separator ]))
        }
      }
      else {
        child.push(comp)
      }
    })

    return h('div', {
      staticClass: 'q-breadcrumbs flex xs-gutter items-center overflow-hidden',
      'class': [`text-${this.color}`, `justify-${this.computedAlign}`]
    }, child)
  }
}
