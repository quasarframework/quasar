import {
  h, ref, computed, watch,
  withDirectives, vShow, nextTick, getCurrentInstance, onBeforeUpdate,
  withMemo
} from 'vue'

import QIcon from '../icon/QIcon.js'
import QCheckbox from '../checkbox/QCheckbox.js'
import QSlideTransition from '../slide-transition/QSlideTransition.js'
import QSpinner from '../spinner/QSpinner.js'
import QIntersection from '../intersection/QIntersection.js'

import useDark, { useDarkProps } from '../../composables/private.use-dark/use-dark.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import { shouldIgnoreKey } from '../../utils/private.keyboard/key-composition.js'
import { injectProp } from '../../utils/private.inject-obj-prop/inject-obj-prop.js'
import QVirtualScroll from '../virtual-scroll/QVirtualScroll.js'

const tickStrategyOptions = [ 'none', 'strict', 'leaf', 'leaf-filtered' ]

export default createComponent({
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
    virtualScroll: Boolean,

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

  setup (props, { slots, emit, attrs }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const isDark = useDark(props, $q)

    const nodesCache = []

    const lazy = ref({})
    const innerTicked = ref(new Set(props.ticked || []))
    const innerExpanded = ref(new Set(props.expanded || []))
    const innerNodes = ref(new Map(getNodesPairs(props.nodes)))

    const blurTargets = {}

    const classes = computed(() =>
      `q-tree q-tree--${ props.dense === true ? 'dense' : 'standard' }`
      + (props.noConnectors === true ? ' q-tree--no-connectors' : '')
      + (isDark.value === true ? ' q-tree--dark' : '')
      + (props.color !== void 0 ? ` text-${ props.color }` : '')
    )

    const hasSelection = computed(() => props.selected !== void 0)

    const computedIcon = computed(() => props.icon || $q.iconSet.tree.icon)

    const computedControlColor = computed(() => props.controlColor || props.color)

    const textColorClass = computed(() => (
      props.textColor !== void 0
        ? ` text-${ props.textColor }`
        : ''
    ))

    const selectedColorClass = computed(() => {
      const color = props.selectedColor || props.color
      return color ? ` text-${ color }` : ''
    })

    const computedFilterMethod = computed(() => (
      props.filterMethod !== void 0
        ? props.filterMethod
        : (node, filter) => {
            const filt = filter.toLowerCase()
            return node[ props.labelKey ]
            && node[ props.labelKey ].toLowerCase().indexOf(filt) !== -1
          }
    ))
        const virtSlots = {
          default: props => {
            return getNode(props.item)
          }
        }

    const meta = computed(() => {
      const meta = {}

      const travel = (node, parent) => {
        const tickStrategy = node.tickStrategy || (parent ? parent.tickStrategy : props.tickStrategy)
        const
          key = getNodeKey(node),
          isParent = node[ props.childrenKey ] && Array.isArray(node[ props.childrenKey ]) && node[ props.childrenKey ].length !== 0,
          selectable = node.disabled !== true && hasSelection.value === true && node.selectable !== false,
          expandable = node.disabled !== true && node.expandable !== false,
          hasTicking = tickStrategy !== 'none',
          strictTicking = tickStrategy === 'strict',
          leafFilteredTicking = tickStrategy === 'leaf-filtered',
          leafTicking = tickStrategy === 'leaf' || tickStrategy === 'leaf-filtered'

        let tickable = node.disabled !== true && node.tickable !== false
        if (leafTicking === true && tickable === true && parent && parent.tickable !== true) {
          tickable = false
        }

        let localLazy = node.lazy
        if (
          localLazy === true
          && lazy.value[ key ] !== void 0
          && Array.isArray(node[ props.childrenKey ]) === true
        ) {
          localLazy = lazy.value[ key ]
        }

        const m = {
          key,
          parent,
          isParent,
          lazy: localLazy,
          disabled: node.disabled,
          link: node.disabled !== true && (selectable === true || (expandable === true && (isParent === true || localLazy === true))),
          children: [],
          matchesFilter: props.filter ? computedFilterMethod.value(node, props.filter) : true,

          selected: key === props.selected && selectable === true,
          selectable,
          expanded: isParent === true ? innerExpanded.value.has(key) : false,
          expandable,
          noTick: node.noTick === true || (strictTicking !== true && localLazy && localLazy !== 'loaded'),
          tickable,
          tickStrategy,
          hasTicking,
          strictTicking,
          leafFilteredTicking,
          leafTicking,
          ticked: strictTicking === true
            ? innerTicked.value.has(key)
            : (isParent === true ? false : innerTicked.value.has(key))
        }

        meta[ key ] = m

        if (isParent === true) {
          m.children = node[ props.childrenKey ].map(n => travel(n, m))

          if (props.filter) {
            if (m.matchesFilter !== true) {
              m.matchesFilter = m.children.some(n => n.matchesFilter)
            }
            else if (
              m.noTick !== true
              && m.disabled !== true
              && m.tickable === true
              && leafFilteredTicking === true
              && m.children.every(n => n.matchesFilter !== true || n.noTick === true || n.tickable !== true) === true
            ) {
              m.tickable = false
            }
          }

          if (m.matchesFilter === true) {
            if (m.noTick !== true && strictTicking !== true && m.children.every(n => n.noTick) === true) {
              m.noTick = true
            }

            if (leafTicking) {
              m.ticked = false
              m.indeterminate = m.children.some(node => node.indeterminate === true)
              m.tickable = m.tickable === true && m.children.some(node => node.tickable)

              if (m.indeterminate !== true) {
                const sel = m.children
                  .reduce((acc, meta) => (meta.ticked === true ? acc + 1 : acc), 0)

                if (sel === m.children.length) {
                  m.ticked = true
                }
                else if (sel > 0) {
                  m.indeterminate = true
                }
              }

              if (m.indeterminate === true) {
                m.indeterminateNextState = m.children
                  .every(meta => meta.tickable !== true || meta.ticked !== true)
              }
            }
          }
        }

        return m
      }

      props.nodes.forEach(node => travel(node, null))

      return meta
    })

    watch(() => props.ticked, val => {
      innerTicked.value = new Set(val)
    })

    watch(() => props.expanded, val => {
      innerExpanded.value = new Set(val)
    })

    watch(() => props.nodes, val => {
      innerNodes.value = new Map(getNodesPairs(val))
    })

    function getNodesPairs (nodes) {
      const nodePairs = []

      const travel = (node) => {
        if (Array.isArray(node[ props.childrenKey ])) {
          node[ props.childrenKey ].forEach(travel)
        }

        nodePairs.push([ getNodeKey(node), node ])
      }

      nodes.forEach(travel)

      return nodePairs
    }

    function getNodeKey (node) {
      return node[ props.nodeKey ]
    }

    function getNodeByKey (key) {
      return innerNodes.value.get(key) ?? null
    }

    function getTickedNodes () {
      return innerTicked.value.map(key => getNodeByKey(key))
    }

    function getExpandedNodes () {
      return innerExpanded.value.map(key => getNodeByKey(key))
    }

    function isExpanded (key) {
      return key && meta.value[ key ]
        ? meta.value[ key ].expanded
        : false
    }

    function collapseAll () {
      if (props.expanded !== void 0) {
        emit('update:expanded', [])
      }
      else {
        innerExpanded.value = new Set([])
      }
    }

    function expandAll () {
      const expanded = [ ...innerNodes.value.keys() ]

      const shouldEmit = props.expanded !== void 0

      if (shouldEmit) {
        emit('update:expanded', expanded)
      }
      else {
        innerExpanded.value = new Set(expanded)
      }
    }

    function setExpanded (key, state, node = getNodeByKey(key), m = meta.value[ key ]) {
      if (m.lazy && m.lazy !== 'loaded') {
        if (m.lazy === 'loading') return

        lazy.value[ key ] = 'loading'
        if (Array.isArray(node[ props.childrenKey ]) !== true) {
          node[ props.childrenKey ] = []
        }
        emit('lazyLoad', {
          node,
          key,
          done: children => {
            lazy.value[ key ] = 'loaded'
            node[ props.childrenKey ] = Array.isArray(children) === true ? children : []
            nextTick(() => {
              const localMeta = meta.value[ key ]
              if (localMeta?.isParent === true) {
                localSetExpanded(key, true)
              }
            })
          },
          fail: () => {
            delete lazy.value[ key ]
            if (node[ props.childrenKey ].length === 0) {
              delete node[ props.childrenKey ]
            }
          }
        })
      }
      else if (m.isParent === true && m.expandable === true) {
        localSetExpanded(key, state)
      }
    }

    function localSetExpanded (key, state) {
      const shouldEmit = props.expanded !== void 0

      if (state) {
        if (props.accordion) {
          if (meta.value[ key ]) {
            const collapse = []
            if (meta.value[ key ].parent) {
              meta.value[ key ].parent.children.forEach(m => {
                if (m.key !== key && m.expandable === true) {
                  collapse.push(m.key)
                }
              })
            }
            else {
              props.nodes.forEach(node => {
                const k = getNodeKey(node)
                if (k !== key) {
                  collapse.push(k)
                }
              })
            }
            if (collapse.length !== 0) {
              collapse.forEach(key => innerExpanded.value.delete(key))
            }
          }
        }
        innerExpanded.value.add(key)
      }
      else {
        innerExpanded.value.delete(key)
      }

      if (shouldEmit === true) {
        emit('update:expanded', [ ...innerExpanded.value ])
      }
    }

    function isTicked (key) {
      return key && meta.value[ key ]
        ? meta.value[ key ].ticked
        : false
    }

    function setTicked (keys, state) {
      const shouldEmit = props.ticked !== void 0

      if (state) {
        keys.forEach(key => innerTicked.value.add(key))
      }
      else {
        keys.forEach(key => innerTicked.value.delete(key))
      }

      if (shouldEmit === true) {
        emit('update:ticked', [ ...innerTicked.value ])
      }
    }

    function getSlotScope (node, meta, key) {
      const scope = { tree: proxy, node, key, color: props.color, dark: isDark.value }

      injectProp(
        scope,
        'expanded',
        () => { return meta.expanded },
        val => { val !== meta.expanded && setExpanded(key, val) }
      )

      injectProp(
        scope,
        'ticked',
        () => { return meta.ticked },
        val => { val !== meta.ticked && setTicked([ key ], val) }
      )

      return scope
    }

    function getChildren (nodes) {
      const children =  (
        props.filter
          ? nodes.filter(n => meta.value[ n[ props.nodeKey ] ].matchesFilter)
          : nodes
      ).map((child, index) => getNode(child, index))

      return props.virtualScroll ? h(QVirtualScroll, {style: {
        height: `300px`
      }, separator: true, type: 'list', items: nodes}, virtSlots) : children
    }

    function getNodeMedia (node) {
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
          class: `q-tree__${ node.img ? 'img' : 'avatar' } q-mr-sm`,
          src
        })
      }
    }

    function onShow () {
      emit('afterShow')
    }

    function onHide () {
      emit('afterHide')
    }

    function getNode (node, cacheIndex) {
      const
        key = getNodeKey(node),
        m = meta.value[ key ],
        header = node.header
          ? slots[ `header-${ node.header }` ] || slots[ 'default-header' ]
          : slots[ 'default-header' ]

      const children = m.isParent === true
        ? getChildren(node[ props.childrenKey ])
        : []

      const isParent = children.length !== 0 || (m.lazy && m.lazy !== 'loaded')

      let body = node.body
        ? slots[ `body-${ node.body }` ] || slots[ 'default-body' ]
        : slots[ 'default-body' ]

      const slotScope = header !== void 0 || body !== void 0
        ? getSlotScope(node, m, key)
        : null

      if (body !== void 0) {
        body = h('div', { class: 'q-tree__node-body relative-position' }, [
          h('div', { class: textColorClass.value }, [
            body(slotScope)
          ])
        ])
      }

      return withMemo([key, m.selected, m.disabled, m.ticked, m.expanded], () => 
        h('div', {
        key,
        class: 'q-tree__node relative-position'
          + ` q-tree__node--${ isParent === true ? 'parent' : 'child' }`
      }, [
        h('div', {
          class: 'q-tree__node-header relative-position row no-wrap items-center'
            + (m.link === true ? ' q-tree__node--link q-hoverable q-focusable' : '')
            + (m.selected === true ? ' q-tree__node--selected' : '')
            + (m.disabled === true ? ' q-tree__node--disabled' : ''),
          tabindex: m.link === true ? 0 : -1,
          ariaExpanded: children.length > 0 ? m.expanded : null,
          role: 'treeitem',
          onClick: (e) => {
            onClick(node, m, e)
          },
          onKeypress (e) {
            if (shouldIgnoreKey(e) !== true) {
              if (e.keyCode === 13) { onClick(node, m, e, true) }
              else if (e.keyCode === 32) { onExpandClick(node, m, e, true) }
            }
          }
        }, [
          h('div', {
            class: 'q-focus-helper',
            tabindex: -1,
            ref: el => { blurTargets[ m.key ] = el }
          }),

          m.lazy === 'loading'
            ? h(QSpinner, {
              class: 'q-tree__spinner',
              color: computedControlColor.value
            })
            : (
                isParent === true
                  ? h(QIcon, {
                    class: 'q-tree__arrow'
                    + (m.expanded === true ? ' q-tree__arrow--rotate' : ''),
                    name: computedIcon.value,
                    onClick (e) { onExpandClick(node, m, e) }
                  })
                  : null
              ),

          m.hasTicking === true && m.noTick !== true
            ? h(QCheckbox, {
              class: 'q-tree__tickbox',
              modelValue: m.indeterminate === true ? null : m.ticked,
              color: computedControlColor.value,
              dark: isDark.value,
              dense: true,
              keepColor: true,
              disable: m.tickable !== true,
              onKeydown: stopAndPrevent,
              'onUpdate:modelValue': v => {
                onTickedClick(m, v)
              }
            })
            : null,

          h('div', {
            class: 'q-tree__node-header-content col row no-wrap items-center'
              + (m.selected === true ? selectedColorClass.value : textColorClass.value)
          }, [
            header
              ? header(slotScope)
              : [
                  getNodeMedia(node),
                  h('div', node[ props.labelKey ])
                ]
          ])
        ]),

        isParent === true
          ? (
              props.noTransition === true
                ? (
                    m.expanded === true
                      ? h('div', {
                        class: 'q-tree__node-collapsible' + textColorClass.value,
                        key: `${ key }__q`
                      }, [
                        body,
                        h('div', {
                          class: 'q-tree__children'
                            + (m.disabled === true ? ' q-tree__node--disabled' : ''),
                          role: 'group'
                        }, children)
                      ])
                      : null
                  )

                : h(QSlideTransition, {
                  duration: props.duration,
                  onShow,
                  onHide
                }, () => withDirectives(
                  h('div', {
                    class: 'q-tree__node-collapsible' + textColorClass.value,
                    key: `${ key }__q`
                  }, [
                    body,
                    h('div', {
                      class: 'q-tree__children'
                        + (m.disabled === true ? ' q-tree__node--disabled' : ''),
                      role: 'group'
                    }, children)
                  ]),
                  [ [ vShow, m.expanded ] ]
                ))
            )
          : body
      ]), nodesCache, cacheIndex)
    }

    function blur (key) {
      blurTargets[ key ]?.focus()
    }

    function onClick (node, meta, e, keyboard) {
      keyboard !== true && meta.selectable !== false && blur(meta.key)

      if (hasSelection.value && meta.selectable) {
        if (props.noSelectionUnset === false) {
          emit('update:selected', meta.key !== props.selected ? meta.key : null)
        }
        else if (meta.key !== props.selected) {
          emit('update:selected', meta.key === void 0 ? null : meta.key)
        }
      }
      else {
        onExpandClick(node, meta, e, keyboard)
      }

      if (typeof node.handler === 'function') {
        node.handler(node)
      }
    }

    function onExpandClick (node, meta, e, keyboard) {
      if (e !== void 0) {
        stopAndPrevent(e)
      }
      keyboard !== true && meta.selectable !== false && blur(meta.key)
      setExpanded(meta.key, !meta.expanded, node, meta)
    }

    function onTickedClick (meta, state) {
      if (meta.indeterminate === true) {
        state = meta.indeterminateNextState
      }
      if (meta.strictTicking) {
        setTicked([ meta.key ], state)
      }
      else if (meta.leafTicking) {
        const keys = []
        const travel = meta => {
          if (meta.isParent) {
            if (state !== true && meta.noTick !== true && meta.tickable === true) {
              keys.push(meta.key)
            }
            if (meta.leafTicking === true) {
              meta.children.forEach(travel)
            }
          }
          else if (
            meta.noTick !== true
            && meta.tickable === true
            && (meta.leafFilteredTicking !== true || meta.matchesFilter === true)
          ) {
            keys.push(meta.key)
          }
        }
        travel(meta)
        setTicked(keys, state)
      }
    }

    props.defaultExpandAll === true && expandAll()

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
      const children = getChildren(props.nodes)

      return h(
        'div', {
          class: classes.value,
          role: 'tree'
        },
        children.length === 0
          ? (
              props.filter
                ? props.noResultsLabel || $q.lang.tree.noResults
                : props.noNodesLabel || $q.lang.tree.noNodes
            )
          : children
      )
    }
  }
})
