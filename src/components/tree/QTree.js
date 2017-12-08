import { QIcon } from '../icon'
import { QCheckbox } from '../checkbox'
import { QSlideTransition } from '../slide-transition'
import { QSpinner } from '../spinner'
import Ripple from '../../directives/ripple'
import clone from '../../utils/clone'

export default {
  name: 'q-tree',
  directives: {
    Ripple
  },
  props: {
    value: Array,
    color: {
      type: String,
      default: 'primary'
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    selection: {
      type: String,
      validation: v => ['none', 'single', 'multiple'].includes(v)
    },
    accordion: Boolean,
    defaultExpand: Boolean, // TODO
    noRipple: Boolean,

    filter: String,
    filterMethod: (node, filter) => {
      return node.label && node.label.indexOf(filter) > -1
    }
  },
  data () {
    return {
      loading: {}
    }
  },
  computed: {
    meta () {
      const meta = {}

      const mapNode = (node, parentNode) => {
        const key = node[this.nodeKey]

        meta[key] = {
          key,
          expandable: node.lazyLoad || (node.children && node.children.length > 0),
          disabled: node.disable === true
        }

        if (node.children) {
          node.children.forEach(n => mapNode(n, node))
        }
      }

      this.value.forEach(node => mapNode(node, null))

      return meta
    },
    model () {
      const mapNode = node => {
        const meta = this.meta[node[this.nodeKey]]

        if (meta.expandable) {
          if (node.expanded === void 0) {
            this.$set(node, 'expanded', false)
          }
          if (node.children) {
            node.children = node.children.map(n => mapNode(n, node))
          }
          else {
            this.$set(node, 'children', [])
          }
        }

        if (this.hasSelection && node.selected === void 0) {
          this.$set(node, 'selected', false)
        }

        return node
      }

      return clone(this.value).map(n => mapNode(n))
    },
    hasRipple () {
      return __THEME__ === 'mat' && !this.noRipple
    },
    hasSelection () {
      return this.selection !== 'none'
    },
    singleSelection () {
      return this.selection === 'single'
    },
    multipleSelection () {
      return this.selection === 'multiple'
    }
  },
  methods: {
    __toggle (type, node) {
      const prop = `${type}ed`
      node[prop] = !node[prop]

      this.$emit(type, node, node[prop])
      this.$emit('input', this.model)
      this.$emit('change', this.model)
    },
    __getSlotScope (node, key) {
      const scope = { node, key }

      this.meta[key].expandable && Object.defineProperty(scope, 'expanded', {
        get: () => { return node.expanded },
        set: val => { val !== node.expanded && this.__toggle('expand', node) }
      })
      this.hasSelection && Object.defineProperty(scope, 'selected', {
        get: () => { return node.selected },
        set: val => { val !== node.selected && this.__toggle('select', node) }
      })

      return scope
    },
    __getNodeContent (h, slot, scope) {
      if (slot) {
        return h('div', {
          staticClass: 'q-tree-node-content relative-position',
          'class': {
            'q-tree-node-content-with-children': this.meta[scope.key].expandable
          }
        }, [ slot(scope) ])
      }
    },
    __getNodeIcon (h, node, side) {
      return node.icon
        ? h(QIcon, { staticClass: `q-m${side}-xs`, props: { name: node.icon } })
        : null
    },
    __getNode (h, node) {
      const
        key = node[this.nodeKey],
        meta = this.meta[key],
        link = node.expandable !== false && (meta.expandable || node.singleSelection),
        header = node.header
          ? this.$scopedSlots[`header-${node.header}`]
          : null,
        slotScope = header || node.body
          ? this.__getSlotScope(node, key)
          : null,
        body = node.body
          ? this.__getNodeContent(h, this.$scopedSlots[`content-${node.body}`], slotScope)
          : null

      return h('div', { staticClass: 'q-tree-node' }, [
        h('div', {
          staticClass: 'q-tree-node-label relative-position row inline items-center',
          'class': {
            'q-tree-link': link,
            'q-tree-node-label-selected': node.selected,
            disabled: node.disabled
          },
          on: {
            click: () => {
              console.log('click')
              node.handler && node.handler(node)

              if (this.singleSelection) {
                node.selected = !node.selected
              }
              if (node.expandable === false) {
                return
              }

              if (node.lazyLoad) {
                const res = node.lazyLoad(node)
                if (res) {
                  this.$set(this.loading, key, true)
                  res.then(() => {
                    delete this.loading[key]
                    this.__toggle('expand', node)
                    delete node.lazyLoad
                  })
                }
                else {
                  this.__toggle('expand', node)
                  delete node.lazyLoad
                }
              }
              else if (meta.expandable) {
                this.__toggle('expand', node)
              }
            }
          },
          directives: link && this.hasRipple && meta.expandable
            ? [{ name: 'ripple' }]
            : null
        }, [
          header
            ? header(slotScope)
            : [
              this.loading[key]
                ? h(QSpinner, { staticClass: 'q-mr-xs', props: { color: this.color } })
                : (
                  meta.expandable
                    ? h(QIcon, {
                      staticClass: 'q-mr-xs transition-generic text-faded',
                      'class': {
                        'rotate-90': node.expanded
                      },
                      props: { name: 'play_arrow' }
                    })
                    : null
                ),
              this.multipleSelection
                ? h(QCheckbox, {
                  staticClass: 'q-mr-xs',
                  props: {
                    value: node.selected,
                    color: node.color || this.color,
                    disable: node.selectable === false
                  },
                  on: {
                    input: () => { this.__toggle('select', node) }
                  }
                })
                : this.__getNodeIcon(h, node, 'r'),
              node.label,
              this.multipleSelection
                ? this.__getNodeIcon(h, node, 'l')
                : null
            ]
        ]),

        meta.expandable
          ? h(QSlideTransition, [
            h('div', {
              directives: [{ name: 'show', value: node.expanded }]
            }, [
              body,
              h('div', {
                staticClass: 'q-tree-children',
                'class': { disabled: node.disabled }
              }, this.__getChildren(h, node.children))
            ])
          ])
          : body
      ])
    },
    __getChildren (h, nodes) {
      if (nodes && nodes.length > 0) {
        return nodes.map(node => this.__getNode(h, node))
      }
    }
  },
  render (h) {
    console.log('RENDER')
    return h('div', {
      staticClass: 'q-tree relative-position',
      'class': {
        'q-tree-no-selection': this.selection === 'none',
        'q-tree-single-selection': this.singleSelection,
        'q-tree-multiple-selection': this.multipleSelection
      }
    }, this.__getChildren(h, this.model))
  }
}
