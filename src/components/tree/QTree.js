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

    tickStrategy: {
      type: String,
      validation: v => ['none', 'strict', 'leaf'].includes(v)
    },
    ticked: Array, // sync
    expanded: Array, // sync
    selected: {}, // sync

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
      return [
        `text-${this.color}`,
        { 'q-tree-dark': this.dark }
      ]
    },
    hasSelection () {
      return this.selected !== void 0
    },
    hasTicking () {
      return this.tickStrategy !== 'none'
    },
    strictTicking () {
      return this.tickStrategy === 'strict'
    },
    leafTicking () {
      return this.tickStrategy === 'leaf'
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
          isLeaf = !isParent,
          selectable = !node.disabled && this.hasSelection && node.selectable !== false,
          expandable = !node.disabled && node.expandable !== false

        let lazy = node.lazy
        if (lazy && this.lazy[key]) {
          lazy = this.lazy[key]
        }

        const m = {
          key,
          parent,
          isParent,
          isLeaf,
          lazy,
          disabled: node.disabled,
          link: selectable || (expandable && (isParent || lazy === true)),
          children: [],
          matchesFilter: this.filter ? this.filterMethod(node, this.filter) : true,

          selected: key === this.selected && selectable,
          selectable,
          expanded: isParent ? this.innerExpanded.includes(key) : false,
          expandable,
          noTick: node.noTick || (!this.strictTicking && lazy && lazy !== 'loaded'),
          tickable: node.disabled || node.tickable || (this.leafTicking && parent && parent.tickable),
          ticked: this.strictTicking
            ? this.innerTicked.includes(key)
            : (isLeaf ? this.innerTicked.includes(key) : false)
        }

        meta[key] = m

        if (isParent) {
          m.children = node.children.map(n => travel(n, m))

          if (this.filter && !m.matchesFilter) {
            m.matchesFilter = m.children.some(n => n.matchesFilter)
          }

          if (m.matchesFilter) {
            if (!this.strictTicking && m.children.every(n => n.noTick)) {
              m.noTick = true
            }

            if (this.leafTicking) {
              m.ticked = false
              m.indeterminate = m.children.some(node => node.indeterminate)

              if (!m.indeterminate) {
                const sel = m.children
                  .reduce((acc, meta) => meta.ticked ? acc + 1 : acc, 0)

                if (sel === m.children.length) {
                  m.ticked = true
                }
                else if (sel > 0) {
                  m.indeterminate = true
                }
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
      innerTicked: this.ticked || [],
      innerExpanded: this.expanded || []
    }
  },
  watch: {
    ticked (val) {
      this.innerTicked = val
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
    getTickedNodes () {
      return this.innerTicked.map(key => this.getNodeByKey(key))
    },
    getExpandedNodes () {
      return this.innerExpanded.map(key => this.getNodeByKey(key))
    },
    isTicked (key) {
      return key && this.meta[key]
        ? this.meta[key].ticked
        : false
    },
    isExpanded (key) {
      return key && this.meta[key]
        ? this.meta[key].expanded
        : false
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
                if (m.key !== key && m.expandable) {
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
    setTicked (keys, state) {
      let target = this.innerTicked
      const emit = this.ticked !== void 0

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
        this.$emit(`update:ticked`, target)
      }
    },
    __getSlotScope (node, meta, key) {
      const scope = { node, key, color: this.color, dark: this.dark }

      Object.defineProperty(scope, 'expanded', {
        get: () => { return meta.expanded },
        set: val => { val !== meta.expanded && this.setExpanded(key, val) }
      })
      Object.defineProperty(scope, 'ticked', {
        get: () => { return meta.ticked },
        set: val => { val !== meta.ticked && this.setTicked([ key ], val) }
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
          on: { click: () => { this.__onClick(node, meta) } },
          directives: __THEME__ === 'mat' && meta.selectable
            ? [{ name: 'ripple' }]
            : null
        }, [
          meta.lazy === 'loading'
            ? h(QSpinner, {
              staticClass: 'q-tree-node-header-media q-mr-xs',
              props: { color: this.computedControlColor }
            })
            : (
              isParent || (meta.lazy && meta.lazy !== 'loaded')
                ? h(QIcon, {
                  staticClass: 'q-tree-node-header-media q-mr-xs transition-generic',
                  'class': { 'rotate-90': meta.expanded },
                  props: { name: this.computedIcon },
                  on: this.hasSelection
                    ? { click: e => { this.__onExpandClick(node, meta, e) } }
                    : undefined
                })
                : null
            ),

          h('span', { 'class': this.contentClass }, [
            header
              ? header(slotScope)
              : [
                this.hasTicking && !meta.noTick
                  ? h(QCheckbox, {
                    staticClass: 'q-mr-xs',
                    props: {
                      value: meta.ticked,
                      color: this.computedControlColor,
                      dark: this.dark,
                      indeterminate: meta.indeterminate,
                      disable: meta.tickable
                    },
                    on: {
                      input: v => {
                        this.__onTickedClick(node, meta, v)
                      }
                    }
                  })
                  : this.__getNodeIcon(h, node, 'r'),
                h('span', node.label),
                this.hasTicking
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
    __onClick (node, meta) {
      console.log('__onClick', meta.key)
      if (this.hasSelection) {
        meta.selectable && this.$emit('update:selected', meta.key)
      }
      else {
        this.__onExpandClick(node, meta)
      }

      if (typeof node.handler === 'function') {
        node.handler(node)
      }
    },
    __onExpandClick (node, meta, e) {
      console.log('__onExpandClick', meta.key)
      if (e !== void 0) {
        e.stopPropagation()
      }
      if (meta.lazy && meta.lazy !== 'loaded') {
        if (meta.lazy === 'loading') {
          return
        }

        const key = meta.key

        this.$set(this.lazy, key, 'loading')
        this.$emit('lazy-load', {
          node,
          key,
          done: children => {
            this.lazy[key] = 'loaded'
            if (children) {
              node.children = children
            }
            this.$nextTick(() => {
              const m = this.meta[key]
              if (m && m.isParent) {
                this.setExpanded(key, true)
              }
            })
          },
          fail: () => {
            this.$delete(this.lazy, key)
          }
        })
      }
      else if (meta.isParent && meta.expandable) {
        this.setExpanded(meta.key, !meta.expanded)
      }
    },
    __onTickedClick (node, meta, state) {
      if (meta.indeterminate && state) {
        state = false
      }
      console.log('__onTickedClick', meta.key, state)
      if (this.strictTicking) {
        this.setTicked([ meta.key ], state)
      }
      else if (this.leafTicking) {
        const keys = []
        const travel = meta => {
          if (meta.isParent) {
            meta.children.forEach(travel)
          }
          else if (!meta.noTick || !meta.tickable) {
            keys.push(meta.key)
          }
        }
        travel(meta)
        this.setTicked(keys, state)
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
        ? (
          this.filter
            ? this.noResultsLabel || this.$q.i18n.tree.noResults
            : this.noNodesLabel || this.$q.i18n.tree.noNodes
        )
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
          if (node.expandable !== false) {
            expanded.push(node[this.nodeKey])
            node.children.forEach(travel)
          }
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
