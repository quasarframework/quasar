import { QIcon } from '../icon'
import { QCheckbox } from '../checkbox'
import { QSlideTransition } from '../slide-transition'
import { QSpinner } from '../spinner'
import Ripple from '../../directives/ripple'

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
  computed: {
    model () {
      const mapNode = (node, parentNode) => {
        node.__key = node[this.nodeKey]
        node.__isExpandable = node.lazyLoad || (node.children && node.children.length > 0)
        node.__parent = parentNode

        if (node.__isExpandable) {
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

      return this.value.map(n => mapNode(n, null))
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
    },
    __getSlotScope (node) {
      const scope = { node }

      node.__isExpandable && Object.defineProperty(scope, 'expanded', {
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
            'q-tree-node-content-with-children': scope.node.__isExpandable
          }
        }, [ slot(scope) ])
      }
    },
    __getNode (h, node) {
      const
        header = node.header
          ? this.$scopedSlots[`header-${node.header}`]
          : null,
        slotScope = header || node.body
          ? this.__getSlotScope(node)
          : null,
        body = node.body
          ? this.__getNodeContent(h, this.$scopedSlots[`content-${node.body}`], slotScope)
          : null

      return h('div', { staticClass: 'q-tree-node' }, [
        h('div', {
          'class': { 'q-tree-link': node.__isExpandable }
        }, [
          h('div', {
            staticClass: 'q-tree-node-label relative-position row items-center',
            on: {
              click: () => {
                node.handler && node.handler(node)

                if (node.lazyLoad) {
                  const res = node.lazyLoad(node)
                  if (res) {
                    this.$set(node, 'loading', true)
                    res.then(() => {
                      node.loading = false
                      this.__toggle('expand', node)
                      delete node.lazyLoad
                    })
                  }
                  else {
                    this.__toggle('expand', node)
                    delete node.lazyLoad
                  }
                }
                else if (node.__isExpandable) {
                  this.__toggle('expand', node)
                }
              }
            },
            directives: this.hasRipple && node.__isExpandable
              ? [{ name: 'ripple' }]
              : null
          },
          header
            ? header(slotScope)
            : [
              node.loading
                ? h(QSpinner, { staticClass: 'q-mr-xs', props: { color: this.color } })
                : (
                  node.__isExpandable
                    ? h(QIcon, {
                      staticClass: 'q-mr-xs transition-generic text-faded',
                      'class': {
                        'rotate-90': node.expanded
                      },
                      props: { name: 'play_arrow' }
                    })
                    : null
                ),
              this.hasSelection
                ? h(QCheckbox, {
                  staticClass: 'q-mr-xs',
                  props: {
                    value: node.selected,
                    color: node.color || this.color
                  },
                  on: {
                    input: () => { this.__toggle('select', node) }
                  }
                })
                : null,
              node.label,
              node.icon
                ? h(QIcon, { staticClass: 'q-ml-xs', props: { name: node.icon } })
                : null
            ])
        ]),

        node.__isExpandable
          ? h(QSlideTransition, [
            h('div', {
              directives: [{ name: 'show', value: node.expanded }]
            }, [
              body,
              h('div', { staticClass: 'q-tree-children' }, this.__getChildren(h, node.children))
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
    return h('div', { staticClass: 'q-tree relative-position' }, this.__getChildren(h, this.model))
  }
}
