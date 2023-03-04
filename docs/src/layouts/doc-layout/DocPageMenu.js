import {
  QExpansionItem,
  QList,
  QItem,
  QItemSection,
  QIcon,
  QBadge,
  Ripple
} from 'quasar'

import { mdiMenuDown } from '@quasar/extras/mdi-v6'
import { h, ref, watch, onBeforeUpdate, withDirectives } from 'vue'
import { useRoute } from 'vue-router'

import Menu from 'assets/menu.json'
import './DocPageMenu.sass'

function getParentProxy (proxy) {
  if (Object(proxy.$parent) === proxy.$parent) {
    return proxy.$parent
  }

  let { parent } = proxy.$

  while (Object(parent) === parent) {
    if (Object(parent.proxy) === parent.proxy) {
      return parent.proxy
    }

    parent = parent.parent
  }
}

export default {
  setup () {
    const $route = useRoute()
    const routePath = $route.path

    const rootRef = ref(null)

    watch(() => $route.path, val => {
      showMenu(childRefs[ val ])
    })

    let childRefs = []

    onBeforeUpdate(() => {
      childRefs = []
    })

    function showMenu (proxy) {
      if (proxy !== void 0 && proxy !== rootRef.value) {
        proxy.show !== void 0 && proxy.show()
        const parent = getParentProxy(proxy)
        if (parent !== void 0) {
          showMenu(parent)
        }
      }
    }

    function getDrawerMenu (menu, path, level) {
      if (menu.children !== void 0) {
        return h(
          QExpansionItem,
          {
            class: 'doc-layout__item non-selectable' + (level !== 0 ? ' doc-page-menu__deep-expansion' : ''),
            ref: vm => { if (vm) { childRefs[ path ] = vm } },
            key: `${menu.name}-${path}`,
            label: menu.name,
            icon: menu.icon,
            expandIcon: mdiMenuDown,
            defaultOpened: menu.opened || routePath.startsWith(path),
            switchToggleSide: level !== 0,
            denseToggle: level !== 0,
            activeClass: 'doc-layout__item--active'
          },
          () => menu.children.map(item => getDrawerMenu(
            item,
            path + (item.path !== void 0 ? '/' + item.path : ''),
            (level / 2) + 0.1
          ))
        )
      }

      const props = {
        ref: vm => { if (vm) { childRefs[ path ] = vm } },
        key: path,
        class: 'doc-layout__item non-selectable',
        to: path,
        activeClass: 'doc-layout__item--active'
      }

      if (level !== 0) {
        props.insetLevel = Math.min(level, 1)
      }

      menu.external === true && Object.assign(props, {
        to: void 0,
        clickable: true,
        tag: 'a',
        href: menu.path,
        target: '_blank'
      })

      const child = []

      menu.icon !== void 0 && child.push(
        h(QItemSection, {
          avatar: true
        }, () => h(QIcon, { name: menu.icon }))
      )

      child.push(
        h(QItemSection, () => menu.name)
      )

      menu.badge !== void 0 && child.push(
        h(QItemSection, {
          side: true
        }, () => h(QBadge, { label: menu.badge, class: 'header-badge' }))
      )

      return withDirectives(
        h(QItem, props, () => child),
        [[Ripple]]
      )
    }

    return () => h(QList, { ref: rootRef, class: 'doc-page-menu', dense: true }, () => Menu.map(
      item => getDrawerMenu(item, '/' + item.path, 0)
    ))
  }
}
