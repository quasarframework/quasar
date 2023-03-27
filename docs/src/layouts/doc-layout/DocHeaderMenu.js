import { QMenu, QIcon, QList, QItem, QItemSection, QItemLabel, QSeparator, Screen } from 'quasar'
import { h } from 'vue'
import { mdiMenuRight } from '@quasar/extras/mdi-v6'

const offset = [ 0, 4 ]

export default {
  props: {
    elements: Array,
    mqPrefix: String
  },

  setup (props) {
    function getChildren (list) {
      return h(QList, { dense: true, padding: true }, () => list.map(entry => {
        if (entry.header !== void 0) {
          return h(QItemLabel, { header: true }, () => entry.header)
        }
        if (entry.separator === true) {
          return h(QSeparator, { spaced: true })
        }

        return h(QItem, {
          class: `${ props.mqPrefix }-${ entry.mq || 'none' }`,
          clickable: true,
          to: entry.path,
          href: entry.external ? entry.path : void 0,
          target: entry.external ? '_blank' : void 0
        }, () => {
          const acc = []

          entry.icon !== void 0 && acc.push(
            h(QItemSection, { side: true }, () => h(QIcon, { name: entry.icon }))
          )

          acc.push(
            h(QItemSection, { class: 'text-no-wrap' }, () => entry.name)
          )

          entry.children !== void 0 && acc.push(
            h(QItemSection, { side: true, class: 'doc-header-menu__arrow' }, () => h(QIcon, { name: mdiMenuRight })),
            h(QMenu, { anchor: 'top right', self: 'top left', class: 'doc-header-menu doc-technical', cover: Screen.lt.sm }, () => getChildren(entry.children))
          )

          return acc
        })
      }))
    }

    function getMenu () {
      return getChildren(props.elements)
    }

    return () => h(QMenu, { fit: true, class: 'doc-header-menu doc-technical', offset }, getMenu)
  }
}
