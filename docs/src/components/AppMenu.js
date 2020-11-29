import {
  QExpansionItem,
  QList,
  QItem,
  QItemSection,
  QIcon,
  QBadge
} from 'quasar'

import { getParentVm } from 'quasar/src/utils/vm.js'
import { h, ref, watch, onBeforeUpdate } from 'vue'
import { useRoute } from 'vue-router'

import Menu from 'assets/menu.js'
import './AppMenu.sass'

export default {
  name: 'AppMenu',

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

    function showMenu (vm) {
      if (vm !== void 0 && vm !== rootRef.value) {
        vm.show !== void 0 && vm.show()
        const parent = getParentVm(vm)
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
            class: 'non-selectable',
            ref: vm => { if (vm) { childRefs[ path ] = vm } },
            key: `${menu.name}-${path}`,
            label: menu.name,
            dense: true,
            icon: menu.icon,
            defaultOpened: menu.opened || routePath.startsWith(path),
            expandSeparator: true,
            switchToggleSide: level > 0,
            denseToggle: level > 0
          },
          () => menu.children.map(item => getDrawerMenu(
            item,
            path + (item.path !== void 0 ? '/' + item.path : ''),
            level + 1
          ))
        )
      }

      const props = {
        ref: vm => { if (vm) { childRefs[ path ] = vm } },
        key: path,
        class: 'app-menu-entry non-selectable',
        to: path,
        dense: level > 0,
        insetLevel: level > 1 ? 1.2 : level
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
        }, () => h(QBadge, { label: menu.badge }))
      )

      return h(QItem, props, () => child)
    }

    return () => h(QList, { ref: rootRef, class: 'app-menu', dense: true }, () => Menu.map(
      item => getDrawerMenu(item, '/' + item.path, 0)
    ))
  }
}
