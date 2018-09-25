import AlignMixin from '../../mixins/align.js'

import Vue from 'vue'
export default Vue.extend({
  name: 'QBreadcrumbs',

  mixins: [ AlignMixin ],

  props: {
    separator: {
      type: String,
      default: '/'
    },
    color: {
      type: String,
      default: 'grey'
    },
    activeColor: {
      type: String,
      default: 'primary'
    },
    separatorColor: String,
    align: {
      default: 'left'
    }
  },

  computed: {
    classes () {
      return `text-${this.color} ${this.alignClass}`
    },

    sepClass () {
      if (this.separatorColor) {
        return `text-${this.separatorColor}`
      }
    },

    activeClass () {
      return `text-${this.activeColor}`
    }
  },

  render (h) {
    if (!this.$slots.default) { return }

    let els = 1

    const
      child = [],
      len = this.$slots.default.filter(c => c.tag !== void 0 && c.tag.endsWith('-QBreadcrumbsEl')).length,
      separator = this.$scopedSlots.separator || (() => this.separator)

    for (const i in this.$slots.default) {
      const comp = this.$slots.default[i]
      if (comp.tag !== void 0 && comp.tag.endsWith('-QBreadcrumbsEl')) {
        const middle = els < len
        els++

        child.push(h('div', {
          staticClass: 'flex items-center',
          'class': middle ? this.activeClass : 'q-breadcrumbs__last'
        }, [ comp ]))

        if (middle) {
          child.push(h('div', {
            staticClass: 'q-breadcrumbs__separator', 'class': this.sepClass
          }, [ separator() ]))
        }
      }
      else {
        child.push(comp)
      }
    }

    return h('div', {
      staticClass: 'q-breadcrumbs flex gutter-xs items-center overflow-hidden',
      'class': this.classes
    }, child)
  }
})
