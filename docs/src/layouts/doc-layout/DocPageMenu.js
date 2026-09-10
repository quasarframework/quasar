import { QBadge, QIcon, QItem, QTree } from 'quasar'

import { h, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Menu from '@/assets/menu.js'
import './DocPageMenu.sass'

let nodes = null

// leaf route path -> keys of the groups that must be open to reveal it
const ancestorKeys = new Map()
// groups flagged as opened in the menu definition
const defaultOpenedKeys = []

// a click on the link is the link's business (router navigation, or
// the browser's for external ones), never the treeitem's
function stopClick(e) {
  e.stopPropagation()
}

function getNodes(list, parentPath, parentKeys, onNodeClick) {
  return list.map(item => {
    const path = parentPath + (item.path !== void 0 ? '/' + item.path : '')
    // some groups (Buttons, Form Components, ...) carry no path of
    // their own, so the path alone would collide with the parent's
    const key = item.path !== void 0 ? path : `${path}#${item.name}`

    const node = {
      key,
      label: item.name,
      icon: item.icon,
      badge: item.badge,
      path: item.external === true ? item.path : path,
      external: item.external === true
    }

    if (item.children !== void 0) {
      if (item.opened === true) {
        defaultOpenedKeys.push(key)
      }
      node.children = getNodes(
        item.children,
        path,
        [...parentKeys, key],
        onNodeClick
      )
    } else if (node.external === false) {
      node.handler = onNodeClick
      ancestorKeys.set(path, parentKeys)
    }

    return node
  })
}

function getExpandedKeys(routePath, current) {
  const keys = ancestorKeys.get(routePath)

  if (keys === void 0) return current

  const merged = new Set(current)
  keys.forEach(key => {
    merged.add(key)
  })

  return merged.size === current.length ? current : [...merged]
}

const getNodeClickHandler = import.meta.env.QUASAR_SERVER
  ? () => {}
  : () => {
      const $router = useRouter()
      const $route = useRoute()

      return node => {
        if (node.path !== $route.path) {
          $router.push(node.path)
        }
      }
    }

export default {
  setup() {
    if (nodes === null) {
      nodes = getNodes(Menu, '', [], getNodeClickHandler())
    }

    const $route = useRoute()
    const expanded = ref(getExpandedKeys($route.path, [...defaultOpenedKeys]))

    watch(
      () => $route.path,
      path => {
        expanded.value = getExpandedKeys(path, expanded.value)
      }
    )

    function getHeader({ node }) {
      const isParent = node.children !== void 0
      const props = {
        class: 'doc-layout__item non-selectable',
        dense: true
      }

      if (!isParent) {
        // the treeitem is the Tab stop and activates the link on Enter
        props.tabindex = -1
        props.onClick = stopClick

        if (node.external) {
          Object.assign(props, {
            clickable: true,
            href: node.path,
            target: '_blank'
          })
        } else {
          Object.assign(props, {
            to: node.path,
            activeClass: 'doc-layout__item--active'
          })
        }
      }

      const child = []

      if (node.icon !== void 0) {
        child.push(h(QIcon, { name: node.icon }))
      }

      child.push(node.label)

      if (node.badge !== void 0) {
        child.push(h(QBadge, { label: node.badge, class: 'header-badge' }))
      }

      return h(QItem, props, () => child)
    }

    function onUpdateExpanded(val) {
      expanded.value = val
    }

    return () =>
      h(
        QTree,
        {
          class: 'doc-page-menu',
          nodes,
          nodeKey: 'key',
          expanded: expanded.value,
          'onUpdate:expanded': onUpdateExpanded,
          dense: true,
          noConnectors: true
        },
        { 'default-header': getHeader }
      )
  }
}
