import Vue from 'vue'

import { isSSR } from './plugins/Platform.js'
import materialIcons from '../icon-set/material-icons.js'

export default {
  __installed: false,
  install ($q, iconSet) {
    this.set = (iconDef = materialIcons) => {
      iconDef.set = this.set

      if (isSSR === true || $q.iconSet !== void 0) {
        $q.iconSet = iconDef
      }
      else {
        Vue.util.defineReactive($q, 'iconSet', iconDef)
      }

      this.name = iconDef.name
      this.def = iconDef
    }

    this.set(iconSet)
  }
}
