import { QIcon } from '../icon'
import { QCheckbox } from '../checkbox'
import { QSlideTransition } from '../slide-transition'
import { QSpinner } from '../spinner'

export default {
  name: 'q-tree-node',
  inject: ['__tree'],
  props: {
    node: Object
  },
  computed: {
    key () {
      return this.node[this.__tree.nodeKey]
    },
    link () {
      return !this.node.freezeExpand && (
        this.hasChildren ||
        this.__tree.singleSelection ||
        this.node.lazyLoad
      )
    },
    disabled () {
      return this.node.disabled
    },
    hasChildren () {
      return this.node.children && this.node.children.length > 0
    }
  },
  data () {
    const key = this.node[this.__tree.nodeKey]
    return {
      selected: this.__tree.innerSelected.includes(key),
      expanded: this.__tree.innerExpanded.includes(key),
      lazyLoaded: false,
      lazyLoading: false
    }
  },
  watch: {
    '__tree.innerSelected' (val) {
      const state = val.includes(this.key)
      if (this.selected !== state) {
        this.selected = state
      }
    },
    '__tree.innerExpanded' (val) {
      const state = val.includes(this.key)
      if (this.expanded !== state) {
        this.expanded = state
      }
    }
  },
  render (h) {
    const header = this.node.header
      ? this.__tree.$scopedSlots[`header-${this.node.header}`]
      : null
    let body = this.node.body
      ? this.__tree.$scopedSlots[`body-${this.node.body}`]
      : null

    let slotScope = header || body
      ? this.__tree.__getSlotScope(this, this.node, this.key)
      : null

    if (body) {
      body = h('div', {
        staticClass: 'q-tree-node-body relative-position',
        'class': { 'q-tree-node-body-with-children': this.hasChildren }
      }, [
        body(slotScope)
      ])
    }

    return h('div', { staticClass: 'q-tree-node' }, [
      h('div', {
        staticClass: 'q-tree-node-header relative-position row inline items-center',
        'class': {
          'q-tree-node-link': this.link,
          'q-tree-node-selected': this.selected,
          disabled: this.disabled
        },
        on: {
          click: this.onClick
        },
        directives: this.link && this.__tree.hasRipple
          ? [{ name: 'ripple' }]
          : null
      }, [
        this.lazyLoading
          ? h(QSpinner, { staticClass: 'q-tree-node-header-media q-mr-xs', props: { color: this.__tree.color } })
          : (
            this.hasChildren || (this.node.lazyLoad && !this.lazyLoaded)
              ? h(QIcon, {
                staticClass: 'q-tree-node-header-media q-mr-xs transition-generic',
                'class': {
                  'rotate-90': this.expanded
                },
                props: { name: 'play_arrow' }
              })
              : null
          ),

        header
          ? header(slotScope)
          : [
            this.__tree.multipleSelection
              ? h(QCheckbox, {
                staticClass: 'q-mr-xs',
                props: {
                  value: this.selected,
                  color: this.__tree.color,
                  dark: this.__tree.dark,
                  disable: this.node.freezeSelect
                },
                on: {
                  input: this.select
                }
              })
              : this.__getNodeIcon(h, 'r'),
            h('span', this.node.label),
            this.__tree.multipleSelection
              ? this.__getNodeIcon(h, 'l')
              : null
          ]
      ]),

      this.hasChildren
        ? h(QSlideTransition, [
          h('div', {
            directives: [{ name: 'show', value: this.expanded }]
          }, [
            body,
            h('div', {
              staticClass: 'q-tree-children',
              'class': { disabled: this.disabled }
            },
            this.hasChildren
              ? this.node.children.map(node => {
                return h('q-tree-node', {
                  key: node[this.__tree.nodeKey],
                  props: { node }
                })
              })
              : null
            )
          ])
        ])
        : body
    ])
  },
  methods: {
    onClick () {
      if (typeof this.node.handler === 'function') {
        this.node.handler(this.node)
      }

      if (this.__tree.singleSelection && !this.node.freezeSelect) {
        this.select()
      }

      if (this.node.freezeExpand || this.lazyLoading) {
        return
      }

      if (this.node.children && this.node.children.length > 0) {
        this.expand()
      }
      else if (this.node.lazyLoad && !this.lazyLoaded) {
        this.lazyLoading = true
        this.__tree.$emit('lazy-load', {
          node: this.node,
          key: this.key,
          done: children => {
            this.lazyLoading = false
            this.lazyLoaded = true
            if (children !== void 0) {
              this.$set(this.node, 'children', children)
            }
            this.$nextTick(() => {
              if (this.hasChildren) {
                this.expand()
              }
            })
          }
        })
      }
    },
    expand () {
      if (this.hasChildren && !this.node.freezeExpand) {
        this.__tree.expand(this.key)
      }
    },
    select () {
      if (this.__tree.hasSelection && !this.node.freezeSelect) {
        this.__tree.select(this.key)
      }
    },
    __getNodeIcon (h, side) {
      return this.node.icon
        ? h(QIcon, { staticClass: `q-m${side}-xs`, props: { name: this.node.icon } })
        : null
    }
  }
}
