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
    meta () {
      return this.__tree.meta[this.key]
    },
    link () {
      return !this.node.freezeExpand && (
        this.isParent ||
        this.__tree.singleSelection ||
        (this.node.lazyLoad && !this.lazyLoaded)
      )
    },
    selected () {
      return this.meta.selected
    },
    expanded () {
      return this.meta.expanded
    },
    indeterminate () {
      return this.meta.indeterminate
    },
    disabled () {
      return this.node.disabled
    },
    isParent () {
      return this.meta.isParent
    }
  },
  data () {
    return {
      lazyLoaded: false,
      lazyLoading: false
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
        'class': { 'q-tree-node-body-with-children': this.isParent }
      }, [
        h('div', { 'class': this.__tree.contentClass }, [
          body(slotScope)
        ])
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
        on: { click: this.onClick }
      }, [
        this.lazyLoading
          ? h(QSpinner, {
            staticClass: 'q-tree-node-header-media q-mr-xs',
            props: { color: this.__tree.computedControlColor }
          })
          : (
            this.isParent || (this.node.lazyLoad && !this.lazyLoaded)
              ? h(QIcon, {
                staticClass: 'q-tree-node-header-media q-mr-xs transition-generic',
                'class': { 'rotate-90': this.expanded },
                props: { name: this.__tree.computedIcon }
              })
              : null
          ),

        h('span', { 'class': this.__tree.contentClass }, [
          header
            ? header(slotScope)
            : [
              this.__tree.multipleSelection
                ? h(QCheckbox, {
                  staticClass: 'q-mr-xs',
                  props: {
                    value: this.selected,
                    color: this.__tree.computedControlColor,
                    dark: this.__tree.dark,
                    indeterminate: this.indeterminate,
                    disable: this.node.freezeSelect
                  },
                  on: {
                    input: v => this.select(v)
                  }
                })
                : this.__getNodeIcon(h, 'r'),
              h('span', this.node.label),
              this.__tree.multipleSelection
                ? this.__getNodeIcon(h, 'l')
                : null
            ]
        ])
      ]),

      this.isParent
        ? h(QSlideTransition, [
          h('div', {
            directives: [{ name: 'show', value: this.expanded }],
            staticClass: 'q-tree-node-collapsible',
            'class': `text-${this.__tree.color}`
          }, [
            body,
            h('div', {
              staticClass: 'q-tree-children',
              'class': { disabled: this.disabled }
            },
            this.isParent
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
              if (this.isParent) {
                this.expand()
              }
            })
          },
          fail: () => {
            this.lazyLoading = false
          }
        })
      }
    },
    expand () {
      if (this.isParent && !this.node.freezeExpand) {
        this.__tree.expand([this.key], !this.expanded)
      }
    },
    select (selected) {
      if (!this.__tree.hasSelection || this.node.freezeSelect) {
        return
      }

      const keys = []

      if (this.meta.isParent) {
        const travel = node => {
          keys.push(node.key)
          if (node.isParent) {
            node.children.forEach(travel)
          }
        }
        travel(this.meta)
      }
      else {
        keys.push(this.key)
      }

      if (!selected) {
        const travel = node => {
          if (node && node.selected) {
            keys.push(node.key)
            travel(node.parent)
          }
        }
        travel(this.meta.parent)
      }

      this.__tree.select(keys, selected)
    },
    __getNodeIcon (h, side) {
      return this.node.icon
        ? h(QIcon, { staticClass: `q-m${side}-xs`, props: { name: this.node.icon } })
        : null
    }
  }
}
