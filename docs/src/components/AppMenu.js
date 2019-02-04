import Menu from 'assets/menu.js'
import './AppMenu.styl'

export default {
  name: 'AppMenu',

  methods: {
    getDrawerMenu (h, menu, path, level) {
      if (menu.separator === true) {
        return h('q-separator')
      }

      if (menu.section !== void 0) {
        return h('q-item-label', {
          props: { header: true }
        }, [ menu.section ])
      }

      if (menu.children !== void 0) {
        return h(
          'q-expansion-item',
          {
            staticClass: 'non-selectable',
            props: {
              label: menu.name,
              dense: level > 0,
              icon: menu.icon,
              defaultOpened: menu.opened,
              expandSeparator: true,
              switchToggleSide: level > 0,
              denseToggle: level > 0,
              headerInsetLevel: level > 0 ? level - 1 : void 0
            }
          },
          menu.children.map(item => this.getDrawerMenu(
            h,
            item,
            path + (item.path !== void 0 ? '/' + item.path : ''),
            level > 0 ? level : level + 1
          ))
        )
      }

      return h('q-item', {
        props: {
          to: path,
          dense: level > 0,
          insetLevel: level
        },
        staticClass: 'app-menu-entry non-selectable'
      }, [
        menu.icon !== void 0
          ? h('q-item-section', {
            props: { avatar: true }
          }, [ h('q-icon', { props: { name: menu.icon } }) ])
          : null,
        h('q-item-section', [ menu.name ]),
        menu.badge !== void 0
          ? h('q-item-section', {
            props: { side: true }
          }, [ h('q-badge', [ menu.badge ]) ])
          : null
      ])
    }
  },
  render (h) {
    return h('q-list', { staticClass: 'app-menu' }, Menu.map(
      item => this.getDrawerMenu(h, item, '/' + item.path, 0)
    ))
  }
}
