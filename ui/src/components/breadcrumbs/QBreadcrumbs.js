import { h, defineComponent } from 'vue'

import AlignMixin from '../../mixins/align.js'

import { hSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QBreadcrumbs',

  mixins: [ AlignMixin ],

  props: {
    separator: {
      type: String,
      default: '/'
    },
    separatorColor: String,

    activeColor: {
      type: String,
      default: 'primary'
    },

    gutter: {
      type: String,
      validator: v => ['none', 'xs', 'sm', 'md', 'lg', 'xl'].includes(v),
      default: 'sm'
    }
  },

  computed: {
    classes () {
      return `flex items-center ${this.alignClass}${this.gutter === 'none' ? '' : ` q-gutter-${this.gutter}`}`
    },

    sepClass () {
      return this.separatorColor
        ? ` text-${this.separatorColor}`
        : ''
    },

    activeClass () {
      return `text-${this.activeColor}`
    }
  },

  render () {
    const nodes = hSlot(this, 'default')
    if (nodes === void 0) { return }

    let els = 1

    const
      child = [],
      len = nodes.filter(c => c.type !== void 0 && c.type.name === 'QBreadcrumbsEl').length,
      separator = this.$slots.separator !== void 0
        ? this.$slots.separator
        : () => this.separator

    nodes.forEach(comp => {
      if (comp.type !== void 0 && comp.type.name === 'QBreadcrumbsEl') {
        const middle = els < len
        els++

        child.push(
          h('div', {
            class: 'flex items-center ' +
              (middle === true ? this.activeClass : 'q-breadcrumbs--last')
          }, [ comp ])
        )

        if (middle === true) {
          child.push(
            h('div', {
              class: 'q-breadcrumbs__separator' + this.sepClass
            }, separator())
          )
        }
      }
      else {
        child.push(comp)
      }
    })

    return h('div', {
      class: 'q-breadcrumbs'
    }, [
      h('div', { class: this.classes }, child)
    ])
  }
})
