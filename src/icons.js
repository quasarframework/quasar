import iconMaterial from '../icons/material'

export default {
  __installed: false,
  install ({ $q, Vue, iconSet }) {
    if (this.__installed) { return }
    this.__installed = true

    this.set = (iconDef = iconMaterial) => {
      iconDef.set = this.set

      Vue.set($q, 'icon', iconDef)
      this.name = iconDef.name
      this.def = iconDef
    }

    // TODO default ???
    this.set(iconSet)
  }
}
