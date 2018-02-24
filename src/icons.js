import materialIcons from '../icons/material-icons'

export default {
  __installed: false,
  install ({ $q, Vue, iconSet }) {
    if (this.__installed) { return }
    this.__installed = true

    this.set = (iconDef = materialIcons) => {
      iconDef.set = this.set

      if ($q.icon) {
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
