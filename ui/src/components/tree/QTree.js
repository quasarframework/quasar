import {
  computed,
  getCurrentInstance,
  h,
  nextTick,
  onBeforeUpdate,
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
    const focusedKey = ref(null)

    let blurTargets = {},
      headerTargets = {}

    onBeforeUpdate(() => {
      blurTargets = {}
      headerTargets = {}
    })

    const classes = computed(
      () =>
        `q-tree q-tree--${props.dense ? 'dense' : 'standard'}` +
        (props.noConnectors ? ' q-tree--no-connectors' : '') +
        (isDark.value ? ' q-tree--dark' : '') +
        (props.color !== void 0 ? ` text-${props.color}` : '')
    )

    const hasSelection = computed(() => props.selected !== void 0)

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

    const meta = computed(() => {
      const acc = {}

      const travel = (node, parent) => {
        const tickStrategy =
          node.tickStrategy ||
          (parent ? parent.tickStrategy : props.tickStrategy)
        const key = node[props.nodeKey],
          isParent =
            node[props.childrenKey] &&
            Array.isArray(node[props.childrenKey]) &&
            node[props.childrenKey].length !== 0,
          selectable =
            !node.disabled && hasSelection.value && node.selectable !== false,
          expandable = !node.disabled && node.expandable !== false,
          hasTicking = tickStrategy !== 'none',
          strictTicking = tickStrategy === 'strict',
          leafFilteredTicking = tickStrategy === 'leaf-filtered',
          leafTicking =
            tickStrategy === 'leaf' || tickStrategy === 'leaf-filtered'

        let tickable = !node.disabled && node.tickable !== false
        if (
          leafTicking &&
          tickable === true &&
          parent &&
          parent.tickable !== true
        ) {
          tickable = false
        }

        let localLazy = node.lazy
        if (
          localLazy === true &&
          lazy.value[key] !== void 0 &&
          Array.isArray(node[props.childrenKey])
        ) {
          localLazy = lazy.value[key]
        }

        const m = {
          key,
          parent,
          isParent,
          lazy: localLazy,
          disabled: node.disabled,
          link:
            !node.disabled &&
            (selectable || (expandable && (isParent || localLazy === true))),
          children: [],
          matchesFilter: props.filter
            ? computedFilterMethod.value(node, props.filter)
            : true,

          selected: key === props.selected && selectable,
          selectable,
          expanded: isParent ? innerExpanded.value.includes(key) : false,
          expandable,
          noTick:
            node.noTick === true ||
            (!strictTicking && localLazy && localLazy !== 'loaded'),
          tickable,
          tickStrategy,
          hasTicking,
          strictTicking,
          leafFilteredTicking,
          leafTicking,
          ticked: strictTicking
            ? innerTicked.value.includes(key)
            : isParent
              ? false
              : innerTicked.value.includes(key)
        }

        acc[key] = m

        if (isParent) {
          m.children = node[props.childrenKey].map(n => travel(n, m))

          if (props.filter) {
            if (m.matchesFilter !== true) {
              m.matchesFilter = m.children.some(n => n.matchesFilter)
            } else if (
              m.noTick !== true &&
              m.disabled !== true &&
              m.tickable === true &&
              leafFilteredTicking &&
              m.children.every(
                n =>
                  n.matchesFilter !== true ||
                  n.noTick === true ||
                  n.tickable !== true
              )
            ) {
              m.tickable = false
            }
          }

          if (m.matchesFilter === true) {
            if (
              m.noTick !== true &&
              strictTicking !== true &&
              m.children.every(n => n.noTick)
            ) {
              m.noTick = true
            }

            if (leafTicking) {
              m.ticked = false
              m.indeterminate = m.children.some(
                entry => entry.indeterminate === true
              )
              m.tickable =
                m.tickable === true && m.children.some(entry => entry.tickable)

              if (m.indeterminate !== true) {
                const sel = m.children.reduce(
                  (localAcc, entry) =>
                    entry.ticked === true ? localAcc + 1 : localAcc,
                  0
                )

                if (sel === m.children.length) {
                  m.ticked = true
                } else if (sel > 0) {
                  m.indeterminate = true
                }
              }

              if (m.indeterminate === true) {
                m.indeterminateNextState = m.children.every(
                  entry => entry.tickable !== true || entry.ticked !== true
                )
              }
            }
          }
        }

        return m
      }

      props.nodes.forEach(node => travel(node, null))
      return acc
    })

    const focusableKeys = computed(() => {
      const acc = []

      function travel(nodes) {
        nodes.forEach(node => {
          const localMeta = meta.value[node[props.nodeKey]]

          if (props.filter && localMeta.matchesFilter !== true) return
          if (localMeta.link === true) acc.push(localMeta.key)

          if (
            localMeta.expanded === true &&
            Array.isArray(node[props.childrenKey])
          ) {
            travel(node[props.childrenKey])
          }
        })
      }

      travel(props.nodes)
      return acc
    })

    const tabKey = computed(() => {
      const keys = focusableKeys.value

      if (keys.includes(focusedKey.value)) return focusedKey.value

      const selected = keys.find(key => meta.value[key].selected === true)
      return selected !== void 0 ? selected : keys[0]
    })

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
      return key && meta.value[key] ? meta.value[key].expanded : false
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
      m = meta.value[key]
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
              const localMeta = meta.value[key]
              if (localMeta?.isParent === true) {
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
      } else if (m.isParent === true && m.expandable === true) {
        localSetExpanded(key, state)
      }
    }

    function localSetExpanded(key, state) {
      let target = innerExpanded.value
      const shouldEmit = props.expanded !== void 0

      if (shouldEmit) target = [...target]

      if (state) {
        if (props.accordion && meta.value[key]) {
          const collapse = []
          if (meta.value[key].parent) {
            meta.value[key].parent.children.forEach(m => {
              if (m.key !== key && m.expandable === true) {
                collapse.push(m.key)
              }
            })
          } else {
            props.nodes.forEach(node => {
              const k = node[props.nodeKey]
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
      return key && meta.value[key] ? meta.value[key].ticked : false
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

      if (shouldEmit) emit('update:ticked', target)
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
          ? nodes.filter(n => meta.value[n[props.nodeKey]].matchesFilter)
          : nodes
      ).map(child => getNode(child))
    }

    function onShow() {
      emit('afterShow')
    }

    function onHide() {
      emit('afterHide')
    }

    function getNode(node) {
      const key = node[props.nodeKey],
        m = meta.value[key],
        header = node.header
          ? slots[`header-${node.header}`] || slots['default-header']
          : slots['default-header']

      const children =
        m.isParent === true ? getChildren(node[props.childrenKey]) : []

      const isParent = children.length !== 0 || (m.lazy && m.lazy !== 'loaded')

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
                (m.link === true
                  ? ' q-tree__node--link q-hoverable q-focusable'
                  : '') +
                (m.selected === true ? ' q-tree__node--selected' : '') +
                (m.disabled === true ? ' q-tree__node--disabled' : ''),
              ref: el => {
                headerTargets[m.key] = el
              },
              tabindex: m.link === true && m.key === tabKey.value ? 0 : -1,
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
              'aria-disabled': m.disabled === true ? 'true' : null,
              role: 'treeitem',
              onFocus() {
                if (m.link === true) focusedKey.value = m.key
              },
              onClick: e => {
                onClick(node, m, e)
              },
              onKeydown(e) {
                if (shouldIgnoreKey(e) !== true) {
                  if (e.keyCode === 13) {
                    onClick(node, m, e, true)
                  } else if (e.keyCode === 32) {
                    onExpandClick(node, m, e, true)
                  } else if (onNavigationKey(m, e.keyCode)) {
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
                  blurTargets[m.key] = el
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
                        (m.expanded === true ? ' q-tree__arrow--rotate' : ''),
                      name: computedIcon.value,
                      onClick(e) {
                        onExpandClick(node, m, e)
                      }
                    })
                  : null,

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

              h(
                'div',
                {
                  class:
                    'q-tree__node-header-content col row no-wrap items-center' +
                    (m.selected === true
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
              ? m.expanded === true
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
                    withDirectives(
                      h(
                        'div',
                        {
                          class:
                            'q-tree__node-collapsible' + textColorClass.value,
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
        focusedKey.value = key
        headerTargets[key]?.focus()
      }
    }

    function getFirstFocusableChild(children) {
      for (const child of children) {
        if (props.filter && child.matchesFilter !== true) continue
        if (child.link === true) return child.key

        if (child.expanded === true) {
          const key = getFirstFocusableChild(child.children)
          if (key !== void 0) return key
        }
      }
    }

    function onNavigationKey(localMeta, keyCode) {
      const keys = focusableKeys.value,
        index = keys.indexOf(localMeta.key)

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
        if (localMeta.isParent !== true && !localMeta.lazy) return true

        if (localMeta.expanded !== true) {
          setExpanded(localMeta.key, true)
        } else {
          focusNode(getFirstFocusableChild(localMeta.children))
        }
        return true
      }
      if (keyCode === 37) {
        if (localMeta.expanded === true) {
          setExpanded(localMeta.key, false)
        } else {
          let parent = localMeta.parent
          while (parent !== null && parent.link !== true) parent = parent.parent
          focusNode(parent?.key)
        }
        return true
      }

      return false
    }

    function onClick(node, localMeta, e, keyboard) {
      if (localMeta.link === true) focusedKey.value = localMeta.key

      if (keyboard !== true && localMeta.selectable !== false) {
        blur(localMeta.key)
      }

      if (hasSelection.value && localMeta.selectable) {
        if (!props.noSelectionUnset) {
          emit(
            'update:selected',
            localMeta.key !== props.selected ? localMeta.key : null
          )
        } else if (localMeta.key !== props.selected) {
          emit(
            'update:selected',
            localMeta.key === void 0 ? null : localMeta.key
          )
        }
      } else {
        onExpandClick(node, localMeta, e, keyboard)
      }

      if (typeof node.handler === 'function') {
        node.handler(node)
      }
    }

    function onExpandClick(node, localMeta, e, keyboard) {
      if (localMeta.link === true) focusedKey.value = localMeta.key

      if (e !== void 0) {
        stopAndPrevent(e)
      }
      if (keyboard !== true && localMeta.selectable !== false) {
        blur(localMeta.key)
      }
      setExpanded(localMeta.key, !localMeta.expanded, node, localMeta)
    }

    function onTickedClick(localMeta, state) {
      if (localMeta.indeterminate === true) {
        state = localMeta.indeterminateNextState
      }
      if (localMeta.strictTicking) {
        setTicked([localMeta.key], state)
      } else if (localMeta.leafTicking) {
        const keys = []
        const travel = nodeMeta => {
          if (nodeMeta.isParent) {
            if (
              state !== true &&
              nodeMeta.noTick !== true &&
              nodeMeta.tickable === true
            ) {
              keys.push(nodeMeta.key)
            }
            if (nodeMeta.leafTicking === true) {
              nodeMeta.children.forEach(travel)
            }
          } else if (
            nodeMeta.noTick !== true &&
            nodeMeta.tickable === true &&
            (nodeMeta.leafFilteredTicking !== true ||
              nodeMeta.matchesFilter === true)
          ) {
            keys.push(nodeMeta.key)
          }
        }
        travel(localMeta)
        setTicked(keys, state)
      }
    }

    if (props.defaultExpandAll) expandAll()

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
