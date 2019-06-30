import { QIcon } from 'quasar'

import DocPage from './DocPage.vue'
import DocLink from './DocLink.vue'

export default function (title, links) {
  const desc = `List of pages under the '${title}' section`

  return {
    name: 'DocListingPage',

    meta: {
      title: `${title} listing`,

      meta: {
        description: {
          name: 'description',
          content: desc
        },
        twitterDesc: {
          name: 'twitter:description',
          content: desc
        },
        ogTitle: {
          name: 'og:title',
          content: `${title} | Quasar Framework`
        },
        ogDesc: {
          name: 'og:description',
          content: desc
        }
      }
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
