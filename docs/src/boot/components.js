// import something here
import CodeExample from 'components/CodeExample.vue'
import CodeMarkup from 'components/CodeMarkup.vue'
import ApiCard from 'components/ApiCard.vue'
import InstallationCard from 'components/InstallationCard.vue'

import DocToken from 'components/DocToken.vue'
import DocLink from 'components/DocLink.vue'
import DocSection from 'components/DocSection.vue'
import DocNote from 'components/DocNote.vue'
import DocPage from 'components/DocPage.vue'

// leave the export, even if you don't use it
export default async ({ Vue }) => {
  Vue.component('CodeExample', CodeExample)
  Vue.component('CodeMarkup', CodeMarkup)
  Vue.component('ApiCard', ApiCard)
  Vue.component('InstallationCard', InstallationCard)

  Vue.component('DocToken', DocToken)
  Vue.component('DocLink', DocLink)
  Vue.component('DocSection', DocSection)
  Vue.component('DocNote', DocNote)
  Vue.component('DocPage', DocPage)
}
