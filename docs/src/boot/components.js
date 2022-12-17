import DocCode from 'components/DocCode.vue'

import DocLink from 'components/DocLink.vue'
import DocPage from 'src/layouts/doc-layout/DocPage.vue'

export default async ({ app }) => {
  app.component('DocCode', DocCode)
  app.component('DocLink', DocLink)
  app.component('DocPage', DocPage)
}
