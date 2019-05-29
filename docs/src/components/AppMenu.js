import Menu from 'assets/menu.js'
import './AppMenu.styl'

export default {
  name: 'AppMenu',

  methods: {
    matchCurrentPath (path, menu) {
      let pathToMatch = ''
      let pathsToMatch = []
      let currentMenuPath = path.split('/')
      currentMenuPath.shift()

      // get the current visited path
      let currentPath = this.$router.history.current.fullPath.split('/')
      currentPath.shift()

      // if we are looking at a sub-menu, use the children paths
      // to see if the sub-menu needs to be expanded
      if (typeof menu.path === 'undefined') {
        pathsToMatch = menu.children.map(item => item.path)
      }
      else {
        pathToMatch = currentMenuPath[currentMenuPath.length - 1]
      }

      if (pathToMatch) {
        return currentPath.includes(pathToMatch)
      }
      else {
        return pathsToMatch.some(item => currentPath.includes(item))
      }
    },

    getDrawerMenu (h, menu, path, level) {
      if (menu.children !== void 0) {
        return h(
          'q-expansion-item',
          {
            staticClass: 'non-selectable',
            props: {
              label: menu.name,
              dense: level > 0,
              icon: menu.icon,
              defaultOpened: this.matchCurrentPath(path, menu),
              expandSeparator: true,
              switchToggleSide: level > 0,
              denseToggle: level > 0
            }
          },
          menu.children.map(item => this.getDrawerMenu(
            h,
            item,
            path + (item.path !== void 0 ? '/' + item.path : ''),
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
      item => this.getDrawerMenu(h, item, '/' + item.path, 0)
    ))
  }
}
