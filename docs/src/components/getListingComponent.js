import { QIcon } from 'quasar'

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

    preFetch ({ store }) {
      store.commit('updateToc', [])
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
              name: link.page === true ? 'far fa-file-alt' : 'fas fa-folder-open'
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
