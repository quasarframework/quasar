import Menu from 'assets/menu.js'
import './AppMenu.styl'

export default {
  name: 'AppMenu',

  methods: {
    getDrawerMenu (h, menu, path) {
      if (menu.children) {
        return h(
          'q-expansion-item',
          {
            props: {
              label: menu.name,
              expandSeparator: true,
              switchToggleSide: true
            }
          },
          menu.children.map(item => this.getDrawerMenu(h, item, path + '/' + item.path))
        )
      }

      return h('q-item', {
        props: {
          to: path
        },
        staticClass: 'app-menu-entry'
      }, [
        h('q-item-section', [ menu.name ])
      ])
    }
  },
  render (h) {
    return h('q-list', { staticClass: 'app-menu' }, Menu.map(
      item => this.getDrawerMenu(h, item, '/' + item.path)
    ))
  }
}
