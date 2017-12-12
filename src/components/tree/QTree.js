import { QIcon } from '../icon'
import { QCheckbox } from '../checkbox'
import { QSlideTransition } from '../slide-transition'
import { QSpinner } from '../spinner'

export default {
  name: 'q-tree',
  props: {
    nodes: Array,
    nodeKey: {
      type: String,
      default: 'id'
    },

    color: {
      type: String,
      default: 'grey'
    },
    controlColor: String,
    textColor: String,
    dark: Boolean,

    icon: String,

    selection: {
      type: String,
      validation: v => ['none', 'strict', 'leaf'].includes(v)
    },
    selected: Array, // sync
    expanded: Array, // sync

    defaultExpandAll: Boolean,
    accordion: Boolean,

    filter: String,
    filterMethod: {
      type: Function,
      default (node, filter) {
        return node.label && node.label.indexOf(filter) > -1
      }
    },

    noNodesLabel: String,
    noResultsLabel: String
  },
  computed: {
    hasRipple () {
      return __THEME__ === 'mat' && !this.noRipple
    },
    classes () {
      return [`text-${this.color}`, {
        'q-tree-dark': this.dark
      }]
    },
    hasSelection () {
      return this.selection !== 'none'
    },
    strictSelection () {
      return this.selection === 'strict'
    },
    leafSelection () {
      return this.selection === 'leaf'
    },
    computedIcon () {
      return this.icon || this.$q.icon.tree.icon
    },
    computedControlColor () {
      return this.controlColor || this.color
    },
    contentClass () {
      return `text-${this.textColor || (this.dark ? 'white' : 'black')}`
    },
    meta () {
      const meta = {}

      const travel = (node, parent) => {
        const
          key = node[this.nodeKey],
          isParent = node.children && node.children.length > 0,
          isLeaf = !isParent

        const m = {
          key,
          parent,
          isParent,
          isLeaf,
          disabled: node.disabled,
          freezeExpand: node.disabled || node.freezeExpand,
          freezeSelect: node.disabled || node.freezeSelect || (this.leafSelection && parent && parent.freezeSelect),
          link: !node.freezeExpand && isParent,
          expanded: isParent ? this.innerExpanded.includes(key) : false,
          selected: this.strictSelection
            ? this.innerSelected.includes(key)
            : (isLeaf ? this.innerSelected.includes(key) : false),
          children: [],
          matchesFilter: this.filter ? this.filterMethod(node, this.filter) : true
        }

        meta[key] = m

        if (isParent) {
          m.children = node.children.map(n => travel(n, m))

          if (this.filter && !m.matchesFilter) {
            m.matchesFilter = m.children.some(n => n.matchesFilter)
          }

          if (this.leafSelection) {
            m.selected = false
            m.indeterminate = m.children.some(node => node.indeterminate)

            if (!m.indeterminate) {
              const sel = m.children
                .reduce((acc, node) => node.selected ? acc + 1 : acc, 0)

              if (sel === m.children.length) {
                m.selected = true
              }
              else if (sel > 0) {
                m.indeterminate = true
              }
            }
          }
        }

        return m
      }

      this.nodes.forEach(node => travel(node, null))
      return meta
    }
  },
  data () {
    return {
      lazy: {},
      innerSelected: this.selected || [],
      innerExpanded: this.expanded || []
    }
  },
  watch: {
    selected (val) {
      this.innerSelected = val
    },
    expanded (val) {
      this.innerExpanded = val
    }
  },
  methods: {
    getNodeByKey (key) {
      const reduce = [].reduce

      const find = (result, node) => {
        if (result || !node) {
          return result
        }
        if (Array.isArray(node)) {
          return reduce.call(Object(node), find, result)
        }
        if (node[this.nodeProp] === key) {
          return node
        }
        if (node.children) {
          return find(null, node.children)
        }
      }

      return find(null, this.nodes)
    },
    getSelectedNodes () {
      return this.innerSelected.map(key => this.getNodeByKey(key))
    },
    getExpandedNodes () {
      return this.innerExpanded.map(key => this.getNodeByKey(key))
    },
    setExpanded (key, state) {
      let target = this.innerExpanded
      const emit = this.expanded !== void 0

      if (emit) {
        target = target.slice()
      }

      if (state) {
        if (this.accordion) {
          if (this.meta[key]) {
            const collapse = []
            if (this.meta[key].parent) {
              this.meta[key].parent.children.forEach(m => {
                if (m.key !== key && !m.freezeExpand) {
                  collapse.push(m.key)
                }
              })
            }
            else {
              this.nodes.forEach(node => {
                const k = node[this.nodeKey]
                if (k !== key) {
                  collapse.push(k)
                }
              })
            }
            if (collapse.length > 0) {
              target = target.filter(k => !collapse.includes(k))
            }
          }
        }

        target = target.concat([ key ])
          .filter((key, index, self) => self.indexOf(key) === index)
      }
      else {
        target = target.filter(k => k !== key)
      }

      if (emit) {
        this.$emit(`update:expanded`, target)
      }
    },
    setSelected (keys, state) {
      let target = this.innerSelected
      const emit = this.selected !== void 0

      if (emit) {
        target = target.slice()
      }

      if (state) {
        target = target.concat(keys)
          .filter((key, index, self) => self.indexOf(key) === index)
      }
      else {
        target = target.filter(k => !keys.includes(k))
      }

      if (emit) {
        this.$emit(`update:selected`, target)
      }
    },
    __getSlotScope (node, meta, key) {
      const scope = { node, key, color: this.color, dark: this.dark }

      Object.defineProperty(scope, 'expanded', {
        get: () => { return meta.expanded },
        set: val => { val !== meta.expanded && this.setExpanded(key, val) }
      })
      Object.defineProperty(scope, 'selected', {
        get: () => { return meta.selected },
        set: val => { val !== meta.selected && this.setSelected([ key ], val) }
      })

      return scope
    },
    __getChildren (h, nodes) {
      return (
        this.filter
          ? nodes.filter(n => this.meta[n[this.nodeKey]].matchesFilter)
          : nodes
      ).map(child => this.__getNode(h, child))
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
        header = node.header
          ? this.$scopedSlots[`header-${node.header}`]
          : null

      const children = meta.isParent
        ? this.__getChildren(h, node.children)
        : []

      const isParent = children.length > 0

      let
        body = node.body
          ? this.$scopedSlots[`body-${node.body}`]
          : null,
        slotScope = header || body
          ? this.__getSlotScope(node, this.key)
          : null

      if (body) {
        body = h('div', {
          staticClass: 'q-tree-node-body relative-position',
          'class': { 'q-tree-node-body-with-children': isParent }
        }, [
          h('div', { 'class': this.contentClass }, [
            body(slotScope)
          ])
        ])
      }

      return h('div', {
        key,
        staticClass: 'q-tree-node'
      }, [
        h('div', {
          staticClass: 'q-tree-node-header relative-position row inline items-center',
          'class': {
            'q-tree-node-link': meta.link,
            'q-tree-node-selected': meta.selected,
            disabled: meta.disabled
          },
          on: { click: () => { this.onNodeClick(node, meta) } }
        }, [
          meta.lazyLoading
            ? h(QSpinner, {
              staticClass: 'q-tree-node-header-media q-mr-xs',
              props: { color: this.computedControlColor }
            })
            : (
              isParent || (node.lazy && !meta.lazyLoaded)
                ? h(QIcon, {
                  staticClass: 'q-tree-node-header-media q-mr-xs transition-generic',
                  'class': { 'rotate-90': meta.expanded },
                  props: { name: this.computedIcon }
                })
                : null
            ),

          h('span', { 'class': this.contentClass }, [
            header
              ? header(slotScope)
              : [
                this.hasSelection
                  ? h(QCheckbox, {
                    staticClass: 'q-mr-xs',
                    props: {
                      value: meta.selected,
                      color: this.computedControlColor,
                      dark: this.dark,
                      indeterminate: meta.indeterminate,
                      disable: meta.freezeSelect
                    },
                    on: {
                      input: v => {
                        this.onNodeSelect(node, meta, v)
                      }
                    }
                  })
                  : this.__getNodeIcon(h, node, 'r'),
                h('span', node.label),
                this.hasSelection
                  ? this.__getNodeIcon(h, node, 'l')
                  : null
              ]
          ])
        ]),

        isParent
          ? h(QSlideTransition, [
            h('div', {
              directives: [{ name: 'show', value: meta.expanded }],
              staticClass: 'q-tree-node-collapsible',
              'class': `text-${this.color}`
            }, [
              body,
              h('div', {
                staticClass: 'q-tree-children',
                'class': { disabled: meta.disabled }
              }, children)
            ])
          ])
          : body
      ])
    },
    onNodeClick (node, meta) {
      console.log('onNodeClick', meta.key)
      if (typeof node.handler === 'function') {
        this.node.handler(node)
      }

      if (meta.isParent && !node.freezeExpand) {
        this.setExpanded(meta.key, !meta.expanded)
      }
    },
    onNodeSelect (node, meta, state) {
      if (meta.indeterminate && state) {
        state = false
      }
      console.log('onNodeSelect', meta.key, state)
      if (this.strictSelection) {
        this.setSelected([ meta.key ], state)
      }
      else if (this.leafSelection) {
        const keys = []
        const travel = meta => {
          if (meta.isParent) {
            meta.children.forEach(travel)
          }
          else if (!meta.freezeSelect) {
            keys.push(meta.key)
          }
        }
        travel(meta)
        this.setSelected(keys, state)
      }
    }
  },
  render (h) {
    console.log('RENDER')
    const children = this.__getChildren(h, this.nodes)

    return h(
      'div', {
        staticClass: 'q-tree relative-position',
        'class': this.classes
      },
      children.length === 0
        ? (this.filter ? this.noResultsLabel || this.$q.i18n.tree.noResults : this.noNodesLabel || this.$q.i18n.tree.noNodes)
        : children
    )
  },
  created () {
    if (!this.defaultExpandAll) {
      return
    }

    const
      expanded = [],
      travel = node => {
        if (node.children && node.children.length > 0) {
          expanded.push(node[this.nodeKey])
          node.children.forEach(travel)
        }
      }

    this.nodes.forEach(travel)

    if (this.expanded !== void 0) {
      this.$emit('update:expanded', expanded)
    }
    else {
      this.innerExpanded = expanded
    }
  }
}
