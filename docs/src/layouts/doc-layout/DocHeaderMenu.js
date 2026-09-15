import { QIcon, QItemLabel, QList, QMenu, QSeparator, Screen } from 'quasar'
import { h } from 'vue'
import { useRouter } from 'vue-router'
import { mdiMenuRight } from '@quasar/extras/mdi-v7'

const offset = [0, 4]

// the checks vue-router's own links make before taking over a click
function isPlainClick(e) {
  return (
    e.defaultPrevented !== true &&
    e.button === 0 &&
    !e.metaKey &&
    !e.altKey &&
    !e.ctrlKey &&
    !e.shiftKey
  )
}

export default {
  props: {
    elements: Array,
    mqPrefix: String
  },

  setup(props) {
    const $router = useRouter()

    // one listener per list, not a closure per link on every render:
    // a page link is taken over unless the click asks for a new tab
    function onListClick(e) {
      const link = e.target.closest('a[href]')

      if (link !== null && link.target !== '_blank' && isPlainClick(e)) {
        e.preventDefault()
        $router.push(link.getAttribute('href'))
      }
    }

    function getChildren(list) {
      return h(
        QList,
        { dense: true, padding: true, role: 'menu', onClick: onListClick },
        () =>
          list.map(entry => {
            if (entry.header !== void 0) {
              return h(QItemLabel, { header: true }, () => entry.header)
            }
            if (entry.separator === true) {
              return h(QSeparator, { spaced: true })
            }

            const hasChildren = entry.children !== void 0
            const content = []

            if (entry.icon !== void 0) {
              content.push(h(QIcon, { name: entry.icon }))
            }

            content.push(h('span', { class: 'text-no-wrap' }, entry.name))

            if (hasChildren) {
              content.push(
                h(QIcon, {
                  class: 'doc-header-menu__arrow',
                  name: mdiMenuRight
                }),
                h(
                  QMenu,
                  {
                    anchor: 'top right',
                    self: 'top left',
                    class: 'doc-header-menu doc-technical',
                    cover: Screen.lt.sm,
                    hover: true
                  },
                  () => getChildren(entry.children)
                )
              )
            }

            const data = {
              class: `doc-header-menu__item ${props.mqPrefix}-${entry.mq || 'none'}`,
              role: 'menuitem',
              'aria-haspopup': hasChildren ? 'menu' : void 0
            }

            // a submenu opener has no target of its own
            if (entry.path === void 0) {
              return h('div', { ...data, tabindex: 0 }, content)
            }

            data.href = entry.path

            if (entry.external === true) {
              data.target = '_blank'
            }

            return h('a', data, content)
          })
      )
    }

    function getMenu() {
      return getChildren(props.elements)
    }

    return () =>
      h(
        QMenu,
        {
          fit: true,
          hover: true,
          class: 'doc-header-menu doc-technical',
          offset
        },
        getMenu
      )
  }
}
