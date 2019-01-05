import Menu from 'assets/menu.js'

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
        }
      }, [
        h('q-item-section', [ menu.name ])
      ])
    }
  },
  render (h) {
    return h('q-list', Menu.map(
      item => this.getDrawerMenu(h, item, '/' + item.path)
    ))
  }
}
