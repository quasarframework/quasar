import { h, defineComponent } from 'vue'
import { QIcon, createMetaMixin } from 'quasar'

import { farFileAlt, fasFolderOpen } from '@quasar/extras/fontawesome-v5'

import DocPage from './DocPage.vue'
import DocLink from './DocLink.vue'

import getMeta from 'assets/get-meta.js'

export default function (title, links) {
  return defineComponent({
    name: 'DocListingPage',

    mixins: [
      createMetaMixin({
        title: `${title} listing`,

        meta: getMeta(
          `${title} | Quasar Framework`,
          `List of pages under the '${title}' section`
        )
      })
    ],

    created () {
      this.$root.store.toc = []
    },

    methods: {
      getContent () {
        return links.map(link => {
          return h('div', { class: 'doc-page-listing' }, [
            h(QIcon, {
              name: link.page === true ? farFileAlt : fasFolderOpen
            }),

            h(DocLink, {
              to: link.to
            }, () => link.title)
          ])
        })
      }
    },

    render () {
      return h(DocPage, {
        title,
        noEdit: true
      }, this.getContent)
    }
  })
}
