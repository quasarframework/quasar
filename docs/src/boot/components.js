// import something here
import DocExample from 'components/DocExample.vue'
import DocCode from 'components/DocCode.vue'
import DocApi from 'components/DocApi.vue'
import DocInstallation from 'components/DocInstallation.vue'

import DocLink from 'components/DocLink.vue'
import DocPage from 'components/DocPage.vue'

// leave the export, even if you don't use it
export default async ({ Vue }) => {
  Vue.component('DocExample', DocExample)
  Vue.component('DocCode', DocCode)
  Vue.component('DocApi', DocApi)
  Vue.component('DocInstallation', DocInstallation)

  Vue.component('DocLink', DocLink)
  Vue.component('DocPage', DocPage)
}
