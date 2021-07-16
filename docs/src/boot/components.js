// import something here
import DocExample from 'components/DocExample.vue'
import DocCode from 'components/DocCode.vue'
import DocApi from 'components/DocApi.vue'
import DocInstallation from 'components/DocInstallation.vue'

import DocLink from 'components/DocLink.vue'
import DocPage from 'components/DocPage.vue'

// leave the export, even if you don't use it
export default async ({ app }) => {
  app.component('DocExample', DocExample)
  app.component('DocCode', DocCode)
  app.component('DocApi', DocApi)
  app.component('DocInstallation', DocInstallation)

  app.component('DocLink', DocLink)
  app.component('DocPage', DocPage)
}
