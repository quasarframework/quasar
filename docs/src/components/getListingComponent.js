import { h } from 'vue'
import { QIcon } from 'quasar'

import { farFileAlt, fasFolderOpen } from '@quasar/extras/fontawesome-v5'

import DocPage from './DocPage.vue'
import DocLink from './DocLink.vue'

export default function (title, links) {
  function getContent () {
    return links.map(link => {
      return h('div', { class: 'doc-page-listing' }, [
        h(QIcon, {
          name: link.page === true ? farFileAlt : fasFolderOpen
        }),

        h(DocLink, { to: link.to }, () => link.title)
      ])
    })
  }

  return {
    name: 'DocListingPage',

    setup () {
      return () => h(DocPage, {
        title,
        noEdit: true,
        metaTitle: title,
        metaDesc: `List of pages under the '${title}' section`
      }, getContent)
    }
  }
}
