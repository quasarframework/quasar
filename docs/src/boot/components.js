// import something here
import DocExample from 'components/DocExample.vue'
import DocCode from 'components/DocCode.vue'
import DocApi from 'components/DocApi.vue'
import DocInstallation from 'components/DocInstallation.vue'

import DocLink from 'components/DocLink.vue'
import DocPage from 'components/DocPage.vue'

import SvgMaterialIcons from 'components/svg/SvgMaterialIcons'
import SvgMaterialIconsOutlined from 'components/svg/SvgMaterialIconsOutlined'
import SvgMaterialIconsRound from 'components/svg/SvgMaterialIconsRound'
import SvgMaterialIconsSharp from 'components/svg/SvgMaterialIconsSharp'
import SvgMdi from 'components/svg/SvgMdi'
import SvgIonicons from 'components/svg/SvgIonicons'
import SvgEvaIcons from 'components/svg/SvgEvaIcons'
import SvgFontawesome from 'components/svg/SvgFontawesome'
import SvgLineAwesome from 'components/svg/SvgLineAwesome'
import SvgThemify from 'components/svg/SvgThemify'
import SvgFeatherIcons from 'components/svg/SvgFeatherIcons'

// leave the export, even if you don't use it
export default async ({ Vue }) => {
  Vue.component('DocExample', DocExample)
  Vue.component('DocCode', DocCode)
  Vue.component('DocApi', DocApi)
  Vue.component('DocInstallation', DocInstallation)

  Vue.component('DocLink', DocLink)
  Vue.component('DocPage', DocPage)

  Vue.component('SvgMaterialIcons', SvgMaterialIcons)
  Vue.component('SvgMaterialIconsOutlined', SvgMaterialIconsOutlined)
  Vue.component('SvgMaterialIconsRound', SvgMaterialIconsRound)
  Vue.component('SvgMaterialIconsSharp', SvgMaterialIconsSharp)
  Vue.component('SvgMdi', SvgMdi)
  Vue.component('SvgIonicons', SvgIonicons)
  Vue.component('SvgEvaIcons', SvgEvaIcons)
  Vue.component('SvgFontawesome', SvgFontawesome)
  Vue.component('SvgLineAwesome', SvgLineAwesome)
  Vue.component('SvgThemify', SvgThemify)
  Vue.component('SvgFeatherIcons', SvgFeatherIcons)
}
