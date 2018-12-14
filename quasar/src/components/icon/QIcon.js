import Vue from 'vue'

export default Vue.extend({
  name: 'QIcon',

  props: {
    name: String,
    color: String,
    size: String,
    left: Boolean,
    right: Boolean
  },

  computed: {
    classes () {
      let cls
      const icon = this.name

      if (!icon) {
        return
      }
      else if (/^fa[s|r|l|b]{0,1} /.test(icon) || icon.startsWith('icon-')) {
        cls = icon
      }
      else if (icon.startsWith('bt-')) {
        cls = `bt ${icon}`
      }
      else if (icon.startsWith('eva-')) {
        cls = `eva ${icon}`
      }
      else if (/^ion-(md|ios|logo)/.test(icon)) {
        cls = `ionicons ${icon}`
      }
      else if (icon.startsWith('ion-')) {
        cls = `ionicons ion-${this.$q.platform.is.ios ? 'ios' : 'md'}${icon.substr(3)}`
      }
      else if (icon.startsWith('mdi-')) {
        cls = `mdi ${icon}`
      }
      else {
        cls = 'material-icons'
      }

      return {
        [`text-${this.color}`]: this.color,
        [cls]: true,
        'on-left': this.left,
        'on-right': this.right
      }
    },

    content () {
      return this.classes && this.classes['material-icons']
        ? this.name
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
      class: this.classes,
      style: this.style,
      attrs: { 'aria-hidden': true },
      on: this.$listeners
    }, [
      this.content,
      this.$slots.default
    ])
  }
})
