import { isSSR } from './plugins/platform'
import materialIcons from '../icons/material-icons'

export default {
  __installed: false,
  install ($q, Vue, iconSet) {
    this.set = (iconDef = materialIcons) => {
      iconDef.set = this.set

      if (isSSR || $q.icon) {
        $q.icon = iconDef
      }
      else {
        Vue.util.defineReactive($q, 'icon', iconDef)
      }

      this.name = iconDef.name
      this.def = iconDef
    }

    this.set(iconSet)
  }
}
