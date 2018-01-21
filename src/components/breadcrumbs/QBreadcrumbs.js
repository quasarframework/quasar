import AlignMixin from '../../mixins/align'

export default {
  name: 'q-breadcrumbs',
  mixins: [AlignMixin],
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
      default: 'left'
    }
  },
  computed: {
    classes () {
      return [`text-${this.color}`, this.alignClass]
    }
  },
  render (h) {
    const
      child = [],
      length = this.$slots.default.length - 1,
      separator = this.$scopedSlots.separator || (() => this.separator),
      color = `text-${this.color}`,
      active = `text-${this.activeColor}`

    this.$slots.default.forEach((comp, i) => {
      if (comp.componentOptions && comp.componentOptions.tag === 'q-breadcrumbs-el') {
        const middle = i < length

        child.push(h('div', {
          'class': [ middle ? active : color, middle ? 'text-weight-bold' : 'q-breadcrumbs-last' ]
        }, [ comp ]))

        if (middle) {
          child.push(h('div', { staticClass: `q-breadcrumbs-separator`, 'class': color }, [ separator() ]))
        }
      }
      else {
        child.push(comp)
      }
    })

    return h('div', {
      staticClass: 'q-breadcrumbs flex gutter-xs items-center overflow-hidden',
      'class': this.classes
    }, child)
  }
}
