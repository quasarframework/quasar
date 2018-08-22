const prefix = process.env.THEME === 'mat' ? 'md' : 'ios'

export default {
  name: 'QIcon',
  props: {
    name: String,
    color: String,
    size: String
  },
  computed: {
    classes () {
      let cls
      const icon = this.name

      if (!icon) {
        return ''
      }
      else if (/^fa[s|r|l|b]{0,1} /.test(icon) || icon.startsWith('icon-')) {
        cls = icon
      }
      else if (icon.startsWith('bt-')) {
        cls = `bt ${icon}`
      }
      else if (/^ion-(md|ios|logo)/.test(icon)) {
        cls = `ionicons ${icon}`
      }
      else if (icon.startsWith('ion-')) {
        cls = `ionicons ion-${prefix}${icon.substr(3)}`
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
        ? this.name.replace(/ /g, '_')
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
