import {
  h, ref, computed, watch,
  withDirectives, vShow, nextTick, getCurrentInstance, onBeforeUpdate
} from 'vue'

import QIcon from '../icon/QIcon.js'
import QCheckbox from '../checkbox/QCheckbox.js'
import QSlideTransition from '../slide-transition/QSlideTransition.js'
import QSpinner from '../spinner/QSpinner.js'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

import { createComponent } from '../../utils/private/create.js'
import { stopAndPrevent } from '../../utils/event.js'
import { shouldIgnoreKey } from '../../utils/private/key-composition.js'
import { injectProp } from '../../utils/private/inject-obj-prop.js'

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

    duration: Number,
    noConnectors: Boolean,

    noNodesLabel: String,
    noResultsLabel: String
  },

  emits: [
    'update:expanded',
    'update:ticked',
    'update:selected',
    'lazy-load',
    'after-show',
    'after-hide'
  ],

  setup (props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const isDark = useDark(props, $q)

    const lazy = ref({})
    const innerTicked = ref(props.ticked || [])
    const innerExpanded = ref(props.expanded || [])

    let blurTargets = {}

    onBeforeUpdate(() => {
      blurTargets = {}
    })

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
            && node[ props.labelKey ].toLowerCase().indexOf(filt) > -1
          }
    ))

    const meta = computed(() => {
      const meta = {}

      const travel = (node, parent) => {
        const tickStrategy = node.tickStrategy || (parent ? parent.tickStrategy : props.tickStrategy)
        const
          key = node[ props.nodeKey ],
          isParent = node[ props.childrenKey ] && node[ props.childrenKey ].length > 0,
          isLeaf = isParent !== true,
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
          isLeaf,
          lazy: localLazy,
          disabled: node.disabled,
          link: node.disabled !== true && (selectable === true || (expandable === true && (isParent === true || localLazy === true))),
          children: [],
          matchesFilter: props.filter ? computedFilterMethod.value(node, props.filter) : true,

          selected: key === props.selected && selectable === true,
          selectable,
          expanded: isParent === true ? innerExpanded.value.includes(key) : false,
          expandable,
          noTick: node.noTick === true || (strictTicking !== true && localLazy && localLazy !== 'loaded'),
          tickable,
          tickStrategy,
          hasTicking,
          strictTicking,
          leafFilteredTicking,
          leafTicking,
          ticked: strictTicking === true
            ? innerTicked.value.includes(key)
            : (isLeaf === true ? innerTicked.value.includes(key) : false)
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
      innerTicked.value = val
    })

    watch(() => props.expanded, val => {
      innerExpanded.value = val
    })

    function getNodeByKey (key) {
      const reduce = [].reduce

      const find = (result, node) => {
        if (result || !node) {
          return result
        }
        if (Array.isArray(node) === true) {
          return reduce.call(Object(node), find, result)
        }
        if (node[ props.nodeKey ] === key) {
          return node
        }
        if (node[ props.childrenKey ]) {
          return find(null, node[ props.childrenKey ])
        }
      }

      return find(null, props.nodes)
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
        innerExpanded.value = []
      }
    }

    function expandAll () {
      const
        expanded = innerExpanded.value,
        travel = node => {
          if (node[ props.childrenKey ] && node[ props.childrenKey ].length > 0) {
            if (node.expandable !== false && node.disabled !== true) {
              expanded.push(node[ props.nodeKey ])
              node[ props.childrenKey ].forEach(travel)
            }
          }
        }

      props.nodes.forEach(travel)

      if (props.expanded !== void 0) {
        emit('update:expanded', expanded)
      }
      else {
        innerExpanded.value = expanded
      }
    }

    function setExpanded (key, state, node = getNodeByKey(key), m = meta.value[ key ]) {
      if (m.lazy && m.lazy !== 'loaded') {
        if (m.lazy === 'loading') {
          return
        }

        lazy.value[ key ] = 'loading'
        if (Array.isArray(node[ props.childrenKey ]) !== true) {
          node[ props.childrenKey ] = []
        }
        emit('lazy-load', {
          node,
          key,
          done: children => {
            lazy.value[ key ] = 'loaded'
            node[ props.childrenKey ] = Array.isArray(children) === true ? children : []
            nextTick(() => {
              const localMeta = meta.value[ key ]
              if (localMeta && localMeta.isParent === true) {
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
      let target = innerExpanded.value
      const shouldEmit = props.expanded !== void 0

      if (shouldEmit === true) {
        target = target.slice()
      }

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
                const k = node[ props.nodeKey ]
                if (k !== key) {
                  collapse.push(k)
                }
              })
            }
            if (collapse.length > 0) {
              target = target.filter(k => collapse.includes(k) === false)
            }
          }
        }

        target = target.concat([ key ])
          .filter((key, index, self) => self.indexOf(key) === index)
      }
      else {
        target = target.filter(k => k !== key)
      }

      if (shouldEmit === true) {
        emit('update:expanded', target)
      }
      else {
        innerExpanded.value = target
      }
    }

    function isTicked (key) {
      return key && meta.value[ key ]
        ? meta.value[ key ].ticked
        : false
    }

    function setTicked (keys, state) {
      let target = innerTicked.value
      const shouldEmit = props.ticked !== void 0

      if (shouldEmit === true) {
        target = target.slice()
      }

      if (state) {
        target = target.concat(keys)
          .filter((key, index, self) => self.indexOf(key) === index)
      }
      else {
        target = target.filter(k => keys.includes(k) === false)
      }

      if (shouldEmit === true) {
        emit('update:ticked', target)
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
      return (
        props.filter
          ? nodes.filter(n => meta.value[ n[ props.nodeKey ] ].matchesFilter)
          : nodes
      ).map(child => getNode(child))
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
      emit('after-show')
    }

    function onHide () {
      emit('after-hide')
    }

    function getNode (node) {
      const
        key = node[ props.nodeKey ],
        m = meta.value[ key ],
        header = node.header
          ? slots[ `header-${ node.header }` ] || slots[ 'default-header' ]
          : slots[ 'default-header' ]

      const children = m.isParent === true
        ? getChildren(node[ props.childrenKey ])
        : []

      const isParent = children.length > 0 || (m.lazy && m.lazy !== 'loaded')

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

      return h('div', {
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
          ? h(QSlideTransition, {
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
                  + (m.disabled === true ? ' q-tree__node--disabled' : '')
                }, children)
              ]),
              [ [ vShow, m.expanded ] ]
            ))
          : body
      ])
    }

    function blur (key) {
      const blurTarget = blurTargets[ key ]
      blurTarget && blurTarget.focus()
    }

    function onClick (node, meta, e, keyboard) {
      keyboard !== true && blur(meta.key)

      if (hasSelection.value) {
        if (meta.selectable) {
          if (props.noSelectionUnset === false) {
            emit('update:selected', meta.key !== props.selected ? meta.key : null)
          }
          else if (meta.key !== props.selected) {
            emit('update:selected', meta.key || null)
          }
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
      keyboard !== true && blur(meta.key)
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

    props.defaultExpandAll === true && expandAll()

    return () => {
      const children = getChildren(props.nodes)

      return h(
        'div', {
          class: classes.value
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
