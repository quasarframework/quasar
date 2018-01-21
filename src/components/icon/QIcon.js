export default {
  name: 'q-icon',
  props: {
    name: String,
    mat: String,
    ios: String,
    color: String,
    size: String
  },
  computed: {
    icon () {
      return this.mat && __THEME__ === 'mat'
        ? this.mat
        : (this.ios && __THEME__ === 'ios' ? this.ios : this.name)
    },
    classes () {
      let cls
      const icon = this.icon

      if (!icon) {
        cls = ''
      }
      else if (icon.startsWith('fa-')) {
        // Fontawesome 4
        cls = `fa ${icon}`
      }
      else if (/^fa[s|r|l|b]{0,1} /.test(icon)) {
        // Fontawesome 5
        cls = icon
      }
      else if (icon.startsWith('bt-')) {
        cls = `bt ${icon}`
      }
      else if (icon.startsWith('ion-') || icon.startsWith('icon-')) {
        cls = `${icon}`
      }
      else if (icon.startsWith('mdi-')) {
        cls = `mdi ${icon}`
      }
      else {
        cls = 'material-icons'
      }

      return this.color
        ? `${cls} text-${this.color}`
        : cls
    },
    content () {
      return this.classes.startsWith('material-icons')
        ? this.icon.replace(/ /g, '_')
        : ' '
    },
    style () {
      if (this.size) {
        return { fontSize: this.size }
      }
    }
  },
  render (h) {
    return h('i', {
      staticClass: 'q-icon',
      'class': this.classes,
      style: this.style,
      attrs: { 'aria-hidden': true }
    }, [
      this.content,
      this.$slots.default
    ])
  }
}
