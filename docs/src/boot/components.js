// import something here
import CodeExample from 'components/CodeExample.vue'
import CodeMarkup from 'components/CodeMarkup.vue'
import ApiCard from 'components/ApiCard.vue'
import InstallationCard from 'components/InstallationCard.vue'

// leave the export, even if you don't use it
export default async ({ Vue }) => {
  Vue.component('CodeExample', CodeExample)
  Vue.component('CodeMarkup', CodeMarkup)
  Vue.component('ApiCard', ApiCard)
  Vue.component('InstallationCard', InstallationCard)
}
