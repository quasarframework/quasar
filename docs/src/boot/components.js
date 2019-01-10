// import something here
import CodeExample from 'components/CodeExample.vue'
import CodeMarkup from 'components/CodeMarkup.vue'
import ApiCard from 'components/ApiCard.vue'
import InstallationCard from 'components/InstallationCard.vue'

import DocLink from 'components/DocLink.vue'
import DocSection from 'components/DocSection.vue'
import DocWarning from 'components/DocWarning.vue'
import DocPage from 'components/DocPage.vue'

// leave the export, even if you don't use it
export default async ({ Vue }) => {
  Vue.component('CodeExample', CodeExample)
  Vue.component('CodeMarkup', CodeMarkup)
  Vue.component('ApiCard', ApiCard)
  Vue.component('InstallationCard', InstallationCard)

  Vue.component('DocLink', DocLink)
  Vue.component('DocSection', DocSection)
  Vue.component('DocWarning', DocWarning)
  Vue.component('DocPage', DocPage)
}
