import Menu from 'assets/menu.js'
import './AppMenu.styl'

export default {
  name: 'AppMenu',

  methods: {
    matchCurrentPath (path, menu, listPath) {
      let pathsToMatch
      if (listPath !== void 0) {
        pathsToMatch = menu.children.map(item => item.path)
      }
      else {
        pathsToMatch = path.split('/')
        pathsToMatch.shift()
      }
      let currentPath = this.$router.history.current.fullPath.split('/')
      currentPath.shift()
      return currentPath.some(item => pathsToMatch.includes(item))
    },

    getDrawerMenu (h, menu, path, listPath, level) {
      if (menu.children !== void 0) {
        return h(
          'q-expansion-item',
          {
            staticClass: 'non-selectable',
            props: {
              label: menu.name,
              dense: level > 0,
              icon: menu.icon,
              defaultOpened: this.matchCurrentPath(path, menu, listPath),
              expandSeparator: true,
              switchToggleSide: level > 0,
              denseToggle: level > 0
            }
          },
          menu.children.map(item => this.getDrawerMenu(
            h,
            item,
            path + (item.path !== void 0 ? '/' + item.path : ''),
            listPath,
            level + 1
          ))
        )
      }

      return h('q-item', {
        props: {
          to: path,
          dense: level > 0,
          insetLevel: level > 1 ? 1.2 : level
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
      item => this.getDrawerMenu(h, item, '/' + item.path, item.listPath, 0)
    ))
  }
}
