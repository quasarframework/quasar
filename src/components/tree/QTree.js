import QTreeNode from './QTreeNode'
import Ripple from '../../directives/ripple'

export default {
  name: 'q-tree',
  provide () {
    return {
      __tree: this
    }
  },
  directives: {
    Ripple
  },
  props: {
    nodes: Array,

    color: {
      type: String,
      default: 'primary'
    },
    dark: Boolean,
    nodeKey: {
      type: String,
      default: 'id'
    },

    selection: {
      type: String,
      validation: v => ['none', 'single', 'multiple'].includes(v)
    },
    selected: Array,
    expanded: Array,
    defaultExpand: Boolean, // TODO

    accordion: Boolean,
    noRipple: Boolean,

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
      return {
        'q-tree-no-selection': this.selection === 'none',
        'q-tree-single-selection': this.singleSelection,
        'q-tree-multiple-selection': this.multipleSelection,
        'q-tree-dark': this.dark
      }
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
    select (key) {
      this.__toggle(
        this.innerSelected,
        key,
        'selected'
      )
    },
    expand (key) {
      this.__toggle(
        this.innerExpanded,
        key,
        'expanded'
      )
    },
    __toggle (target, key, name) {
      const
        index = target.indexOf(key),
        emit = this[name] !== void 0,
        add = index === -1

      if (emit) {
        target = target.slice()
      }

      if (this.singleSelection && name === 'selected') {
        target = add ? [ key ] : []
      }
      else {
        if (add) {
          target.push(key)
        }
        else {
          target.splice(index, 1)
        }
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
    return h('div', {
      staticClass: 'q-tree relative-position',
      'class': this.classes
    }, this.nodes.map(node => h(QTreeNode, {
      props: { node }
    })))
  }
}
