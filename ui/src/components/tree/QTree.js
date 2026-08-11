import {
  computed,
  getCurrentInstance,
  h,
  inject,
  nextTick,
  provide,
  ref,
  vShow,
  watch,
  withDirectives
} from 'vue'

import QIcon from '../icon/QIcon.js'
import QCheckbox from '../checkbox/QCheckbox.js'
import QSlideTransition from '../slide-transition/QSlideTransition.js'
import QSpinner from '../spinner/QSpinner.js'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import { shouldIgnoreKey } from '../../utils/private.keyboard/key-composition.js'
import { injectProp } from '../../utils/private.inject-obj-prop/inject-obj-prop.js'

const tickStrategyOptions = ['none', 'strict', 'leaf', 'leaf-filtered']

const treeCtxKey = Symbol('QTree')

// one instance per node so that a state change re-renders only the
// affected nodes; all of the logic lives in QTree's setup and comes
// in through the injected context
const QTreeNode = createComponent({
  name: 'QTreeNode',

  props: {
    node: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const ctx = inject(treeCtxKey)
    return () => ctx.renderNode(props.node)
  }
})

// per-key membership flags kept in sync through a diff: a change
// triggers only the refs of the keys that actually flipped, so
// invalidation reaches only the affected nodes instead of sweeping
// the whole computed graph
function useKeyedFlags(read) {
  const flags = new Map()
  let current = new Set(read())

  watch(
    read,
    val => {
      const next = new Set(val)

      current.forEach(key => {
        if (!next.has(key)) {
          const target = flags.get(key)
          if (target !== void 0) target.value = false
        }
      })
      next.forEach(key => {
        if (!current.has(key)) {
          const target = flags.get(key)
          if (target !== void 0) target.value = true
        }
      })

      current = next
    },
    { flush: 'sync' }
  )

  return {
    // reactive per-key read
    has(key) {
      let target = flags.get(key)

      if (target === void 0) {
        target = ref(current.has(key))
        flags.set(key, target)
      }

      return target.value
    },

    prune(keep) {
      flags.forEach((_, key) => {
        if (!keep.has(key)) flags.delete(key)
      })
    }
  }
}

function getNodeMedia(node) {
  if (node.icon !== void 0) {
    return h(QIcon, {
      class: 'q-tree__icon q-mr-sm',
      name: node.icon,
      color: node.iconColor
    })
  }
  const src = node.img || node.avatar
  if (src) {
    return h('img', {
      class: `q-tree__${node.img ? 'img' : 'avatar'} q-mr-sm`,
      src
    })
  }
}

export default /*#__PURE__*/ createComponent({
  name: 'QTree',

  props: {
    ...useDarkProps,

    nodes: {
      type: Array,
      required: true
    },
    nodeKey: {
      type: String,
      required: true
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    childrenKey: {
      type: String,
      default: 'children'
    },

    dense: Boolean,

    color: String,
    controlColor: String,
    textColor: String,
    selectedColor: String,

    icon: String,

    tickStrategy: {
      type: String,
      default: 'none',
      validator: v => tickStrategyOptions.includes(v)
    },
    ticked: Array, // v-model:ticked
    expanded: Array, // v-model:expanded
    selected: {}, // v-model:selected

    noSelectionUnset: Boolean,

    defaultExpandAll: Boolean,
    accordion: Boolean,

    filter: String,
    filterMethod: Function,

    duration: {},
    noConnectors: Boolean,
    noTransition: Boolean,

    noNodesLabel: String,
    noResultsLabel: String
  },

  emits: [
    'update:expanded',
    'update:ticked',
    'update:selected',
    'lazyLoad',
    'afterShow',
    'afterHide'
  ],

  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const isDark = useDark(props, $q)

    const lazy = ref({})
    const innerTicked = ref(props.ticked || [])
    const innerExpanded = ref(props.expanded || [])

    const expandedKeys = computed(() => new Set(innerExpanded.value))

    // the roving Tab stop is tracked outside of reactivity and applied
    // to the DOM directly, so moving focus around does not re-render
    // the whole tree; renders re-derive it through getTabKey()
    let focusedKey = null,
      tabStopKey = null

    // nodes whose children have been rendered at least once; a collapsed
    // subtree stays unmounted until its first expansion, then it is kept
    // alive (v-show) so collapsing/expanding it again can still animate
    const revealedKeys = new Set()

    // populated/cleaned through the per-node ref callbacks
    const blurTargets = {},
      headerTargets = {}

    const classes = computed(
      () =>
        `q-tree q-tree--${props.dense ? 'dense' : 'standard'}` +
        (props.noConnectors ? ' q-tree--no-connectors' : '') +
        (isDark.value ? ' q-tree--dark' : '') +
        (props.color !== void 0 ? ` text-${props.color}` : '')
    )

    // a manual ref instead of a computed: its value only changes when
    // selection gets bound/unbound, so the per-node computeds reading it
    // are not flagged for re-validation on every selection change (the
    // watch below only fires when the boolean actually flips)
    const hasSelection = ref(props.selected !== void 0)
    watch(
      () => props.selected !== void 0,
      val => {
        hasSelection.value = val
      },
      { flush: 'sync' }
    )

    const computedIcon = computed(() => props.icon || $q.iconSet.tree.icon)
    const computedControlColor = computed(
      () => props.controlColor || props.color
    )

    const textColorClass = computed(() =>
      props.textColor !== void 0 ? ` text-${props.textColor}` : ''
    )

    const selectedColorClass = computed(() => {
      const color = props.selectedColor || props.color
      return color ? ` text-${color}` : ''
    })

    const computedFilterMethod = computed(() =>
      props.filterMethod !== void 0
        ? props.filterMethod
        : (node, filter) => {
            const filt = filter.toLowerCase()
            return (
              node[props.labelKey] &&
              node[props.labelKey].toLowerCase().includes(filt)
            )
          }
    )

    // ---- incremental node state ---------------------------------------
    // instead of one monolithic O(N) meta rebuild on every state change,
    // node state is layered so each layer recomputes only on its own
    // triggers:
    //   structure     -- per-node facts read from the nodes model; rebuilds
    //                    only when the model (or lazy status) changes
    //   filterMatches -- own/bubbled filter matches; rebuilds per filter
    //                    change, untouched by ticking/expansion/selection
    //   per-key computeds -- the top-down tickable gate, the bottom-up tick
    //                    aggregation and the render snapshot, each keeping
    //                    its previous value's identity when nothing changed
    //                    so invalidation waves die out at unchanged nodes

    const structure = computed(() => {
      const map = new Map(),
        rootKeys = []

      const travel = (node, parentKey, parentRec) => {
        const tickStrategy =
          node.tickStrategy ||
          (parentRec !== null ? parentRec.tickStrategy : props.tickStrategy)
        const key = node[props.nodeKey],
          children = node[props.childrenKey],
          isParent = Array.isArray(children) && children.length !== 0,
          strictTicking = tickStrategy === 'strict'

        let localLazy = node.lazy
        if (
          localLazy === true &&
          lazy.value[key] !== void 0 &&
          Array.isArray(children)
        ) {
          localLazy = lazy.value[key]
        }

        const rec = {
          key,
          node,
          parentKey,
          childKeys: [],
          isParent,
          lazy: localLazy,
          disabled: node.disabled,
          expandable: !node.disabled && node.expandable !== false,
          selectableBase: node.selectable !== false,
          tickableBase: !node.disabled && node.tickable !== false,
          noTickBase:
            node.noTick === true ||
            (!strictTicking && localLazy && localLazy !== 'loaded'),
          tickStrategy,
          hasTicking: tickStrategy !== 'none',
          strictTicking,
          leafFilteredTicking: tickStrategy === 'leaf-filtered',
          leafTicking:
            tickStrategy === 'leaf' || tickStrategy === 'leaf-filtered'
        }

        map.set(key, rec)

        if (isParent) {
          children.forEach(child => {
            rec.childKeys.push(travel(child, key, rec).key)
          })
        }

        return rec
      }

      props.nodes.forEach(node => {
        rootKeys.push(travel(node, null, null).key)
      })

      return { map, rootKeys }
    })

    // own = the node's own label matched; visible = own or any descendant
    const filterMatches = computed(() => {
      if (!props.filter) return null

      const own = new Set(),
        visible = new Set()

      const travel = node => {
        const key = node[props.nodeKey]
        // the user-supplied filterMethod may return any truthy value
        let matches = Boolean(computedFilterMethod.value(node, props.filter))

        if (matches) own.add(key)

        if (Array.isArray(node[props.childrenKey])) {
          node[props.childrenKey].forEach(child => {
            if (travel(child)) matches = true
          })
        }

        if (matches) visible.add(key)
        return matches
      }

      props.nodes.forEach(travel)
      return { own, visible }
    })

    function isNodeVisible(key) {
      const matches = filterMatches.value
      return matches === null || matches.visible.has(key)
    }

    function linkOf(rec) {
      const selectable =
        !rec.disabled && hasSelection.value && rec.selectableBase
      return (
        !rec.disabled &&
        (selectable || (rec.expandable && (rec.isParent || rec.lazy === true)))
      )
    }

    const gatedTickableRefs = new Map(),
      tickAggRefs = new Map(),
      metaRefs = new Map(),
      visibilityRefs = new Map()

    const tickedFlags = useKeyedFlags(() => innerTicked.value)
    const expandedFlags = useKeyedFlags(() => innerExpanded.value)
    const selectedFlags = useKeyedFlags(() =>
      props.selected !== void 0 && props.selected !== null
        ? [props.selected]
        : []
    )

    // the "pre-aggregation" tickable state: in leaf modes an untickable
    // parent locks its whole subtree (top-down recursion)
    function getGatedTickableRef(key) {
      let target = gatedTickableRefs.get(key)

      if (target === void 0) {
        target = computed(() => {
          const rec = structure.value.map.get(key)

          if (rec === void 0 || !rec.tickableBase) return false

          return (
            !rec.leafTicking ||
            rec.parentKey === null ||
            getGatedTickableRef(rec.parentKey).value
          )
        })
        gatedTickableRefs.set(key, target)
      }

      return target
    }

    // bottom-up ticking aggregation (leaf strategies derive a parent's
    // ticked/indeterminate/tickable/noTick state from its children)
    function getTickAggRef(key) {
      let target = tickAggRefs.get(key)

      if (target === void 0) {
        let prev
        target = computed(() => {
          const rec = structure.value.map.get(key)
          if (rec === void 0) {
            prev = void 0
            return void 0
          }

          let noTick = rec.noTickBase,
            tickable = getGatedTickableRef(key).value,
            ticked =
              rec.strictTicking || !rec.isParent ? tickedFlags.has(key) : false,
            indeterminate,
            indeterminateNextState

          if (rec.isParent) {
            const childAggs = rec.childKeys.map(k => getTickAggRef(k).value)
            const matches = filterMatches.value
            const visible = matches === null || matches.visible.has(key)

            if (
              matches !== null &&
              matches.own.has(key) &&
              noTick !== true &&
              rec.disabled !== true &&
              tickable &&
              rec.leafFilteredTicking &&
              rec.childKeys.every(
                (k, i) =>
                  !matches.visible.has(k) ||
                  childAggs[i].noTick === true ||
                  !childAggs[i].tickable
              )
            ) {
              tickable = false
            }

            if (visible) {
              if (
                noTick !== true &&
                !rec.strictTicking &&
                childAggs.every(a => a.noTick)
              ) {
                noTick = true
              }

              if (rec.leafTicking) {
                ticked = false
                indeterminate = childAggs.some(a => a.indeterminate === true)
                tickable &&= childAggs.some(a => a.tickable)

                if (!indeterminate) {
                  const sel = childAggs.reduce(
                    (localAcc, a) => (a.ticked ? localAcc + 1 : localAcc),
                    0
                  )

                  if (sel === childAggs.length) {
                    ticked = true
                  } else if (sel > 0) {
                    indeterminate = true
                  }
                }

                if (indeterminate) {
                  indeterminateNextState = childAggs.every(
                    a => !a.tickable || !a.ticked
                  )
                }
              }
            }
          }

          if (
            prev !== void 0 &&
            prev.noTick === noTick &&
            prev.tickable === tickable &&
            prev.ticked === ticked &&
            prev.indeterminate === indeterminate &&
            prev.indeterminateNextState === indeterminateNextState
          ) {
            return prev
          }

          prev = {
            noTick,
            tickable,
            ticked,
            indeterminate,
            indeterminateNextState
          }
          return prev
        })
        tickAggRefs.set(key, target)
      }

      return target
    }

    // a per-node snapshot (flat scalars only, no graph pointers -- graph
    // walks go through structure.value) that keeps its object identity
    // while nothing render-relevant changed, so only the affected
    // QTreeNode instances re-render; the static fields are covered by the
    // rec/agg identity checks and the dynamic ones are compared BEFORE
    // allocating, so a sweeping recompute (e.g. a selection change)
    // allocates nothing on the unchanged nodes
    function getMetaRef(key) {
      let target = metaRefs.get(key)

      if (target === void 0) {
        let prev, prevRec, prevAgg
        target = computed(() => {
          const rec = structure.value.map.get(key)
          if (rec === void 0) {
            prev = prevRec = prevAgg = void 0
            return void 0
          }

          const agg = getTickAggRef(key).value,
            matches = filterMatches.value,
            selectable =
              !rec.disabled && hasSelection.value && rec.selectableBase,
            link =
              !rec.disabled &&
              (selectable ||
                (rec.expandable && (rec.isParent || rec.lazy === true))),
            matchesFilter = matches === null || matches.visible.has(key),
            selected = selectedFlags.has(key) && selectable,
            expanded = rec.isParent ? expandedFlags.has(key) : false,
            hasVisibleChildren =
              rec.isParent &&
              (matches === null ||
                rec.childKeys.some(k => matches.visible.has(k)))

          if (
            prev !== void 0 &&
            prevRec === rec &&
            prevAgg === agg &&
            prev.link === link &&
            prev.matchesFilter === matchesFilter &&
            prev.selected === selected &&
            prev.selectable === selectable &&
            prev.expanded === expanded &&
            prev.hasVisibleChildren === hasVisibleChildren
          ) {
            return prev
          }

          prevRec = rec
          prevAgg = agg
          prev = {
            key,
            isParent: rec.isParent,
            lazy: rec.lazy,
            disabled: rec.disabled,
            link,
            matchesFilter,
            selected,
            selectable,
            expanded,
            expandable: rec.expandable,
            noTick: agg.noTick,
            tickable: agg.tickable,
            tickStrategy: rec.tickStrategy,
            hasTicking: rec.hasTicking,
            strictTicking: rec.strictTicking,
            leafFilteredTicking: rec.leafFilteredTicking,
            leafTicking: rec.leafTicking,
            ticked: agg.ticked,
            indeterminate: agg.indeterminate,
            indeterminateNextState: agg.indeterminateNextState,
            hasVisibleChildren
          }
          return prev
        })
        metaRefs.set(key, target)
      }

      return target
    }

    // the always-current equivalent of the old meta.value[key] lookup
    function getMeta(key) {
      return getMetaRef(key).value
    }

    // boolean-level indirection so that a parent filtering its children
    // list does not re-render when something else about a child changes
    function getVisibilityRef(key) {
      let target = visibilityRefs.get(key)

      if (target === void 0) {
        target = computed(() => isNodeVisible(key))
        visibilityRefs.set(key, target)
      }

      return target
    }

    // drop the per-key artifacts of keys that left the nodes model, so a
    // long-lived tree swapping datasets does not accumulate stale entries;
    // post flush -- by then the obsolete QTreeNode instances have unmounted
    // and everything here is recreated on demand if a key ever returns
    watch(
      structure,
      ({ map }) => {
        const prune = target => {
          target.forEach((_, key) => {
            if (!map.has(key)) target.delete(key)
          })
        }

        prune(gatedTickableRefs)
        prune(tickAggRefs)
        prune(metaRefs)
        prune(visibilityRefs)

        tickedFlags.prune(map)
        expandedFlags.prune(map)
        selectedFlags.prune(map)

        revealedKeys.forEach(key => {
          if (!map.has(key)) revealedKeys.delete(key)
        })
      },
      { flush: 'post' }
    )

    const focusableKeys = computed(() => {
      const acc = [],
        { map, rootKeys } = structure.value,
        matches = filterMatches.value

      const travel = key => {
        if (matches !== null && !matches.visible.has(key)) return

        const rec = map.get(key)

        if (linkOf(rec)) acc.push(key)

        if (rec.isParent && expandedKeys.value.has(key)) {
          rec.childKeys.forEach(travel)
        }
      }

      rootKeys.forEach(travel)
      return acc
    })

    function getTabKey() {
      const keys = focusableKeys.value

      if (focusedKey !== null && keys.includes(focusedKey)) return focusedKey

      if (
        props.selected !== void 0 &&
        props.selected !== null &&
        keys.includes(props.selected) &&
        getMeta(props.selected)?.selected === true
      ) {
        return props.selected
      }

      return keys[0]
    }

    function moveTabStop(key) {
      if (key === tabStopKey) return

      if (tabStopKey !== null && tabStopKey !== void 0) {
        headerTargets[tabStopKey]?.setAttribute('tabindex', -1)
      }
      headerTargets[key]?.setAttribute('tabindex', 0)
      tabStopKey = key
    }

    watch(
      () => props.ticked,
      val => {
        innerTicked.value = val
      }
    )

    watch(
      () => props.expanded,
      val => {
        innerExpanded.value = val
      }
    )

    function getNodeByKey(key) {
      const find = (result, node) => {
        if (result || !node) {
          return result
        }
        if (Array.isArray(node)) {
          return node.reduce(find, result)
        }
        if (node[props.nodeKey] === key) {
          return node
        }
        if (node[props.childrenKey]) {
          return find(null, node[props.childrenKey])
        }
      }

      return find(null, props.nodes)
    }

    function getTickedNodes() {
      return innerTicked.value.map(key => getNodeByKey(key))
    }

    function getExpandedNodes() {
      return innerExpanded.value.map(key => getNodeByKey(key))
    }

    function isExpanded(key) {
      return key ? getMeta(key)?.expanded === true : false
    }

    function collapseAll() {
      if (props.expanded !== void 0) {
        emit('update:expanded', [])
      } else {
        innerExpanded.value = []
      }
    }

    function expandAll() {
      const expanded = []
      const travel = node => {
        if (
          node[props.childrenKey] &&
          node[props.childrenKey].length !== 0 &&
          node.expandable !== false &&
          node.disabled !== true
        ) {
          expanded.push(node[props.nodeKey])
          node[props.childrenKey].forEach(travel)
        }
      }

      props.nodes.forEach(travel)

      if (props.expanded !== void 0) {
        emit('update:expanded', expanded)
      } else {
        innerExpanded.value = expanded
      }
    }

    function setExpanded(
      key,
      state,
      node = getNodeByKey(key),
      m = getMeta(key)
    ) {
      if (m.lazy && m.lazy !== 'loaded') {
        if (m.lazy === 'loading') return

        lazy.value[key] = 'loading'
        if (!Array.isArray(node[props.childrenKey])) {
          node[props.childrenKey] = []
        }
        emit('lazyLoad', {
          node,
          key,
          done: children => {
            lazy.value[key] = 'loaded'
            node[props.childrenKey] = Array.isArray(children) ? children : []
            nextTick(() => {
              if (getMeta(key)?.isParent === true) {
                localSetExpanded(key, true)
              }
            })
          },
          fail: () => {
            delete lazy.value[key]
            if (node[props.childrenKey].length === 0) {
              delete node[props.childrenKey]
            }
          }
        })
      } else if (m.isParent && m.expandable) {
        localSetExpanded(key, state)
      }
    }

    function localSetExpanded(key, state) {
      let target = innerExpanded.value
      const shouldEmit = props.expanded !== void 0

      if (shouldEmit) target = [...target]

      if (state) {
        const rec = props.accordion ? structure.value.map.get(key) : void 0

        if (rec !== void 0) {
          const { map } = structure.value
          const collapse = []

          if (rec.parentKey !== null) {
            map.get(rec.parentKey).childKeys.forEach(k => {
              if (k !== key && map.get(k).expandable) {
                collapse.push(k)
              }
            })
          } else {
            structure.value.rootKeys.forEach(k => {
              if (k !== key) {
                collapse.push(k)
              }
            })
          }

          if (collapse.length !== 0) {
            target = target.filter(k => !collapse.includes(k))
          }
        }

        target = [...target, key].filter(
          (entryKey, index, self) => self.indexOf(entryKey) === index
        )
      } else {
        target = target.filter(k => k !== key)
      }

      if (shouldEmit) {
        emit('update:expanded', target)
      } else {
        innerExpanded.value = target
      }
    }

    function isTicked(key) {
      return key ? getMeta(key)?.ticked === true : false
    }

    function setTicked(keys, state) {
      let target = innerTicked.value
      const shouldEmit = props.ticked !== void 0

      if (shouldEmit) target = [...target]

      target = state
        ? [...target, ...keys].filter(
            (key, index, self) => self.indexOf(key) === index
          )
        : target.filter(k => !keys.includes(k))

      if (shouldEmit) {
        emit('update:ticked', target)
      } else {
        innerTicked.value = target
      }
    }

    function getSlotScope(node, localMeta, key) {
      const scope = {
        tree: proxy,
        node,
        key,
        color: props.color,
        dark: isDark.value
      }

      injectProp(
        scope,
        'expanded',
        () => localMeta.expanded,
        val => {
          if (val !== localMeta.expanded) {
            setExpanded(key, val)
          }
        }
      )

      injectProp(
        scope,
        'ticked',
        () => localMeta.ticked,
        val => {
          if (val !== localMeta.ticked) {
            setTicked([key], val)
          }
        }
      )

      return scope
    }

    function getChildren(nodes) {
      return (
        props.filter
          ? nodes.filter(n => getVisibilityRef(n[props.nodeKey]).value)
          : nodes
      ).map(child => h(QTreeNode, { key: child[props.nodeKey], node: child }))
    }

    function onShow() {
      emit('afterShow')
    }

    function onHide() {
      emit('afterHide')
    }

    function renderNode(node) {
      const key = node[props.nodeKey],
        m = getMetaRef(key).value,
        header = node.header
          ? slots[`header-${node.header}`] || slots['default-header']
          : slots['default-header']

      if (m === void 0) return null

      if (m.expanded) {
        revealedKeys.add(key)
      }

      // an expanded node needs its collapsible rendered; a revealed one
      // keeps it (hidden through v-show) so it can still animate -- unless
      // transitions are off, where collapsed content renders as null
      const showCollapsible =
        m.expanded || (props.noTransition !== true && revealedKeys.has(key))

      const children =
        m.isParent && showCollapsible
          ? getChildren(node[props.childrenKey])
          : []

      const isParent = m.hasVisibleChildren || (m.lazy && m.lazy !== 'loaded')

      let body = node.body
        ? slots[`body-${node.body}`] || slots['default-body']
        : slots['default-body']

      const slotScope =
        header !== void 0 || body !== void 0 ? getSlotScope(node, m, key) : null

      if (body !== void 0) {
        body = h('div', { class: 'q-tree__node-body relative-position' }, [
          h('div', { class: textColorClass.value }, [body(slotScope)])
        ])
      }

      return h(
        'div',
        {
          key,
          class:
            'q-tree__node relative-position' +
            ` q-tree__node--${isParent ? 'parent' : 'child'}`
        },
        [
          h(
            'div',
            {
              class:
                'q-tree__node-header relative-position row no-wrap items-center' +
                (m.link ? ' q-tree__node--link q-hoverable q-focusable' : '') +
                (m.selected ? ' q-tree__node--selected' : '') +
                (m.disabled === true ? ' q-tree__node--disabled' : ''),
              ref: el => {
                if (el !== null) headerTargets[key] = el
                else delete headerTargets[key]
              },
              tabindex: m.link && m.key === tabStopKey ? 0 : -1,
              'aria-expanded': isParent
                ? m.expanded
                  ? 'true'
                  : 'false'
                : null,
              'aria-selected': m.selectable
                ? m.selected
                  ? 'true'
                  : 'false'
                : null,
              'aria-checked':
                m.hasTicking && m.noTick !== true
                  ? m.indeterminate === true
                    ? 'mixed'
                    : m.ticked
                      ? 'true'
                      : 'false'
                  : null,
              'aria-disabled': m.disabled === true ? 'true' : null,
              role: 'treeitem',
              onFocus() {
                if (m.link) {
                  focusedKey = key
                  moveTabStop(key)
                }
              },
              onClick: e => {
                onClick(node, key, e)
              },
              onKeydown(e) {
                if (shouldIgnoreKey(e) !== true) {
                  if (e.keyCode === 13) {
                    onClick(node, key, e, true)
                  } else if (e.keyCode === 32) {
                    if (m.hasTicking && m.noTick !== true && m.tickable) {
                      stopAndPrevent(e)
                      onTickedClick(key, !m.ticked)
                    } else {
                      onExpandClick(node, key, e, true)
                    }
                  } else if (onNavigationKey(key, e.keyCode)) {
                    stopAndPrevent(e)
                  }
                }
              }
            },
            [
              h('div', {
                class: 'q-focus-helper',
                tabindex: -1,
                ref: el => {
                  if (el !== null) blurTargets[key] = el
                  else delete blurTargets[key]
                }
              }),

              m.lazy === 'loading'
                ? h(QSpinner, {
                    class: 'q-tree__spinner',
                    color: computedControlColor.value
                  })
                : isParent
                  ? h(QIcon, {
                      class:
                        'q-tree__arrow' +
                        (m.expanded ? ' q-tree__arrow--rotate' : ''),
                      name: computedIcon.value,
                      onClick(e) {
                        onExpandClick(node, key, e)
                      }
                    })
                  : null,

              m.hasTicking && m.noTick !== true
                ? h(QCheckbox, {
                    class: 'q-tree__tickbox',
                    modelValue: m.indeterminate === true ? null : m.ticked,
                    color: computedControlColor.value,
                    dark: isDark.value,
                    dense: true,
                    keepColor: true,
                    disable: !m.tickable,
                    // a pointer affordance only -- keyboard ticking goes
                    // through the header (Space), which carries aria-checked
                    tabindex: -1,
                    'aria-hidden': 'true',
                    'onUpdate:modelValue': v => {
                      onTickedClick(key, v)
                    }
                  })
                : null,

              h(
                'div',
                {
                  class:
                    'q-tree__node-header-content col row no-wrap items-center' +
                    (m.selected
                      ? selectedColorClass.value
                      : textColorClass.value)
                },
                [
                  header
                    ? header(slotScope)
                    : [getNodeMedia(node), h('div', node[props.labelKey])]
                ]
              )
            ]
          ),

          isParent
            ? props.noTransition
              ? m.expanded
                ? h(
                    'div',
                    {
                      class: 'q-tree__node-collapsible' + textColorClass.value,
                      key: `${key}__q`
                    },
                    [
                      body,
                      h(
                        'div',
                        {
                          class:
                            'q-tree__children' +
                            (m.disabled === true
                              ? ' q-tree__node--disabled'
                              : ''),
                          role: 'group'
                        },
                        children
                      )
                    ]
                  )
                : null
              : h(
                  QSlideTransition,
                  {
                    duration: props.duration,
                    onShow,
                    onHide
                  },
                  () =>
                    showCollapsible
                      ? withDirectives(
                          h(
                            'div',
                            {
                              class:
                                'q-tree__node-collapsible' +
                                textColorClass.value,
                              key: `${key}__q`
                            },
                            [
                              body,
                              h(
                                'div',
                                {
                                  class:
                                    'q-tree__children' +
                                    (m.disabled === true
                                      ? ' q-tree__node--disabled'
                                      : ''),
                                  role: 'group'
                                },
                                children
                              )
                            ]
                          ),
                          [[vShow, m.expanded]]
                        )
                      : null
                )
            : body
        ]
      )
    }

    function blur(key) {
      blurTargets[key]?.focus({ preventScroll: true })
    }

    function focusNode(key) {
      if (key !== void 0) {
        focusedKey = key
        moveTabStop(key)
        headerTargets[key]?.focus()
      }
    }

    function getFirstFocusableChild(childKeys) {
      const { map } = structure.value

      for (const childKey of childKeys) {
        if (!isNodeVisible(childKey)) continue

        const rec = map.get(childKey)

        if (linkOf(rec)) return childKey

        if (rec.isParent && expandedKeys.value.has(childKey)) {
          const key = getFirstFocusableChild(rec.childKeys)
          if (key !== void 0) return key
        }
      }
    }

    // handlers receive keys and resolve current state at event time:
    // render-time meta snapshots carry no graph pointers, so graph walks
    // go through structure.value
    function onNavigationKey(key, keyCode) {
      const localMeta = getMeta(key)
      if (localMeta === void 0) return false

      const keys = focusableKeys.value,
        index = keys.indexOf(key)

      if (keyCode === 36) {
        focusNode(keys[0])
        return true
      }
      if (keyCode === 35) {
        focusNode(keys.at(-1))
        return true
      }
      if (keyCode === 38) {
        focusNode(keys[index - 1])
        return true
      }
      if (keyCode === 40) {
        focusNode(keys[index + 1])
        return true
      }
      if (keyCode === 39) {
        if (!localMeta.isParent && !localMeta.lazy) return true

        if (!localMeta.expanded) {
          setExpanded(key, true)
        } else {
          focusNode(
            getFirstFocusableChild(structure.value.map.get(key).childKeys)
          )
        }
        return true
      }
      if (keyCode === 37) {
        if (localMeta.expanded) {
          setExpanded(key, false)
        } else {
          const { map } = structure.value
          let parentKey = map.get(key).parentKey

          while (parentKey !== null && !linkOf(map.get(parentKey))) {
            parentKey = map.get(parentKey).parentKey
          }

          focusNode(parentKey === null ? void 0 : parentKey)
        }
        return true
      }

      return false
    }

    function onClick(node, key, e, keyboard) {
      const localMeta = getMeta(key)
      if (localMeta === void 0) return

      if (localMeta.link) {
        focusedKey = key
        moveTabStop(key)
      }

      if (keyboard !== true && localMeta.selectable) {
        blur(key)
      }

      if (hasSelection.value && localMeta.selectable) {
        if (!props.noSelectionUnset) {
          emit('update:selected', key !== props.selected ? key : null)
        } else if (key !== props.selected) {
          emit('update:selected', key === void 0 ? null : key)
        }
      } else {
        onExpandClick(node, key, e, keyboard)
      }

      if (typeof node.handler === 'function') {
        node.handler(node)
      }
    }

    function onExpandClick(node, key, e, keyboard) {
      const localMeta = getMeta(key)
      if (localMeta === void 0) return

      if (localMeta.link) {
        focusedKey = key
        moveTabStop(key)
      }

      if (e !== void 0) {
        stopAndPrevent(e)
      }
      if (keyboard !== true && localMeta.selectable) {
        blur(key)
      }
      setExpanded(key, !localMeta.expanded, node, localMeta)
    }

    function onTickedClick(key, state) {
      const localMeta = getMeta(key)
      if (localMeta === void 0) return

      if (localMeta.indeterminate === true) {
        state = localMeta.indeterminateNextState
      }
      if (localMeta.strictTicking) {
        setTicked([key], state)
      } else if (localMeta.leafTicking) {
        const keys = []
        const { map } = structure.value

        const travel = travelKey => {
          const nodeMeta = getMeta(travelKey)

          if (nodeMeta.isParent) {
            if (
              state !== true &&
              nodeMeta.noTick !== true &&
              nodeMeta.tickable
            ) {
              keys.push(travelKey)
            }
            if (nodeMeta.leafTicking) {
              map.get(travelKey).childKeys.forEach(travel)
            }
          } else if (
            nodeMeta.noTick !== true &&
            nodeMeta.tickable &&
            (!nodeMeta.leafFilteredTicking || nodeMeta.matchesFilter)
          ) {
            keys.push(travelKey)
          }
        }

        travel(key)
        setTicked(keys, state)
      }
    }

    if (props.defaultExpandAll) expandAll()

    provide(treeCtxKey, { renderNode })

    // expose public methods
    Object.assign(proxy, {
      getNodeByKey,
      getTickedNodes,
      getExpandedNodes,
      isExpanded,
      collapseAll,
      expandAll,
      setExpanded,
      isTicked,
      setTicked
    })

    return () => {
      // through moveTabStop() so that when the Tab stop moves to/from a
      // node that does not re-render in this pass, its DOM attribute is
      // still corrected -- a stale one would leave two Tab stops behind
      moveTabStop(getTabKey())

      const children = getChildren(props.nodes)

      return h(
        'div',
        {
          class: classes.value,
          role: 'tree'
        },
        children.length === 0
          ? props.filter
            ? props.noResultsLabel || $q.lang.tree.noResults
            : props.noNodesLabel || $q.lang.tree.noNodes
          : children
      )
    }
  }
})
