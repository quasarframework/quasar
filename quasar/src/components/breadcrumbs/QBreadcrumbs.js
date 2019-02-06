import Vue from 'vue'

import AlignMixin from '../../mixins/align.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
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
      return `${this.alignClass}${this.gutter === 'none' ? '' : ` q-gutter-${this.gutter}`}`
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
    const node = slot(this, 'default')
    if (node === void 0) { return }

    let els = 1

    const
      child = [],
      len = node.filter(c => c.tag !== void 0 && c.tag.endsWith('-QBreadcrumbsEl')).length,
      separator = this.$scopedSlots.separator || (() => this.separator)

    for (const i in node) {
      const comp = node[i]
      if (comp.tag !== void 0 && comp.tag.endsWith('-QBreadcrumbsEl')) {
        const middle = els < len
        els++

        child.push(h('div', {
          staticClass: 'flex items-center',
          class: middle ? this.activeClass : 'q-breadcrumbs--last'
        }, [ comp ]))

        if (middle) {
          child.push(h('div', {
            staticClass: 'q-breadcrumbs__separator', class: this.sepClass
          }, separator()))
        }
      }
      else {
        child.push(comp)
      }
    }

    return h('div', { staticClass: 'q-breadcrumbs' }, [
      h('div', {
        staticClass: ' flex items-center',
        class: this.classes
      }, child)
    ])
  }
})
