import QTreeNode from './QTreeNode'

export default {
  name: 'q-tree',
  provide () {
    return {
      __tree: this
    }
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

    selection: {
      type: String,
      validation: v => ['none', 'single', 'multiple'].includes(v)
    },
    selected: Array,
    expanded: Array,

    defaultExpandAll: Boolean,
    accordion: Boolean,

    filter: String,
    filterMethod: (node, filter) => {
      return node.label && node.label.indexOf(filter) > -1
    }
  },
  computed: {
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
    },
    classes () {
      return [`text-${this.color}`, {
        'q-tree-no-selection': this.selection === 'none',
        'q-tree-single-selection': this.singleSelection,
        'q-tree-multiple-selection': this.multipleSelection,
        'q-tree-dark': this.dark
      }]
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
        const key = node[this.nodeKey]
        const m = {
          key,
          indeterminate: false,
          selected: this.innerSelected.includes(key),
          isParent: node.children && node.children.length,
          parent
        }

        m.isLeaf = !m.isParent
        meta[key] = m

        if (m.isLeaf) {
          m.expanded = false
          return m
        }

        m.expanded = this.innerExpanded.includes(key)
        m.children = node.children.map(n => travel(n, m))

        const
          sel = m.children.reduce((acc, node) => node.selected ? acc + 1 : acc, 0),
          len = m.children.length

        if (sel === 0) {
          m.selected = false
        }
        else if (sel > 0 && sel < len) {
          m.selected = false
          m.indeterminate = true
        }
        else {
          m.selected = true
        }

        if (m.selected === false && m.indeterminate === false) {
          m.indeterminate = m.children.some(n => n.indeterminate)
        }

        return m
      }

      this.nodes.forEach(node => travel(node, null))
      return meta
    }
  },
  data () {
    return {
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
    getNodeByKey (key, keyProp = this.nodeKey) {
      const reduce = [].reduce

      function find (result, node) {
        if (result || !node) {
          return result
        }
        if (Array.isArray(node)) {
          return reduce.call(Object(node), find, result)
        }
        if (node[keyProp] === key) {
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
    select (keys, val) {
      this.__setState(
        this.innerSelected,
        keys,
        'selected',
        val
      )
    },
    expand (keys, val) {
      this.__setState(
        this.innerExpanded,
        keys,
        'expanded',
        val
      )
    },
    __setState (target, keys, name, add) {
      const emit = this[name] !== void 0

      if (emit) {
        target = target.slice()
      }

      if (add) {
        target = target.concat(keys)
          .filter((key, index, self) => self.indexOf(key) === index)
      }
      else {
        target = target.filter(key => !keys.includes(key))
      }

      if (emit) {
        this.$emit(`update:${name}`, target)
      }
      else {
        this[name] = target
      }
    },
    __getSlotScope (component, node, key) {
      const scope = { node, key, color: this.color, dark: this.dark }

      Object.defineProperty(scope, 'expanded', {
        get: () => { return component.expanded },
        set: val => { val !== component.expanded && component.expand() }
      })
      Object.defineProperty(scope, 'selected', {
        get: () => { return component.selected },
        set: val => { val !== component.selected && component.select() }
      })

      return scope
    }
  },
  render (h) {
    console.log('RENDER')
    return h(
      'div', {
        staticClass: 'q-tree relative-position',
        'class': this.classes
      },
      this.nodes.map(node => h(QTreeNode, {
        props: { node }
      }))
    )
  },
  created () {
    if (!this.defaultExpandAll) {
      return
    }

    const
      expanded = [],
      travel = node => {
        if (!node.lazyLoad && node.children && node.children.length > 0) {
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
