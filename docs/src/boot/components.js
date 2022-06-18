import DocCode from 'components/DocCode.vue'

import DocLink from 'components/DocLink.vue'
import DocPage from 'components/DocPage.vue'

// leave the export, even if you don't use it
export default async ({ app }) => {
  app.component('DocCode', DocCode)

  app.component('DocLink', DocLink)
  app.component('DocPage', DocPage)
}
