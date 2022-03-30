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
import { h, ref, watch, onBeforeUpdate, withDirectives, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { expandedHeaderMainToolbarNavItems, expandedHeaderSecondaryToolbarNavItems } from 'assets/header/nav-items.js'

import Menu from 'assets/menu.json'
import './AppMenu.sass'


/**
 * Creates an array with all paths, labels and hrefs from navItems (and immediate subMenus nav items) which can then be filtered easily
 * @param navItems The header navigation items (both mainNavItems and secondaryNavItems)
 * @return headerNavPaths string[] the array with paths, labels and hrefs from navItems and subMenus of nav items
 */
function getHeaderPathsAndLabels (navItemsGroups) {
  const headerPathsAndLabels = []
  navItemsGroups.forEach(navItems => {
    for (const headerItem of navItems) {
      // add the path or href and label to the array
      const headerPath = headerItem.path || headerItem.href
      headerPathsAndLabels.push(headerItem.label)
      if (headerPath) {
        headerPathsAndLabels.push(headerPath)
      }
    }
  })
  return headerPathsAndLabels
}

function getParentVm (vm) {
  if (vm.$parent !== void 0 && vm.$parent !== null) {
    return vm.$parent
  }

  vm = vm.$.parent

  while (vm !== void 0 && vm !== null) {
    if (vm.proxy !== void 0 && vm.proxy !== null) {
      return vm.proxy
    }

    vm = vm.parent
  }
}

export default {
  name: 'AppMenu',

  setup () {
    const $q = useQuasar()

    const sidebarMenu = computed(() => {
      const headerPathsAndLabels = getHeaderPathsAndLabels([ expandedHeaderMainToolbarNavItems, expandedHeaderSecondaryToolbarNavItems ])
      return $q.screen.xs ? Menu : Menu.filter(menuItem => !headerPathsAndLabels.includes(menuItem.name) && !headerPathsAndLabels.includes(menuItem.path))
    })

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
            class: 'non-selectable text-black-87',
            ref: vm => { if (vm) { childRefs[ path ] = vm } },
            key: `${menu.name}-${path}`,
            label: menu.name,
            dense: true,
            icon: menu.icon,
            expandIcon: mdiMenuDown,
            headerClass: 'font-size-14',
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
        class: 'non-selectable text-black-87',
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
        }, () => h(QBadge, { label: menu.badge, color: 'brand-primary' }))
      )

      return withDirectives(
        h(QItem, props, () => child),
        [[Ripple]]
      )
    }

    return () => h(QList, { ref: rootRef, class: 'app-menu font-monserrat letter-spacing-25', dense: true }, () => sidebarMenu.value.map(
      item => getDrawerMenu(item, '/' + item.path, 0)
    ))
  }
}
