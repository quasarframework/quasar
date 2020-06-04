import { QIcon } from 'quasar'

import { farFileAlt, fasFolderOpen } from '@quasar/extras/fontawesome-v5'

import DocPage from './DocPage.vue'
import DocLink from './DocLink.vue'

import getMeta from 'assets/get-meta.js'

export default function (title, links) {
  return {
    name: 'DocListingPage',

    meta: {
      title: `${title} listing`,

      meta: getMeta(
        `${title} | Quasar Framework`,
        `List of pages under the '${title}' section`
      )
    },

    created () {
      this.$root.store.toc = []
    },

    render (h) {
      return h(DocPage, {
        props: {
          title,
          noEdit: true
        }
      }, links.map(link => {
        return h('div', { staticClass: 'doc-page-listing' }, [
          h(QIcon, {
            props: {
              name: link.page === true ? farFileAlt : fasFolderOpen
            }
          }),

          h(DocLink, {
            props: {
              to: link.to
            }
          }, [ link.title ])
        ])
      }))
    }
  }
}
