import Vue from 'vue'

import slot from '../../utils/slot.js'

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
    type () {
      let cls
      const icon = this.name

      if (!icon) {
        return {
          cls: void 0,
          content: void 0
        }
      }

      let content = ' '

      if (/^fa[s|r|l|b]{0,1} /.test(icon) || icon.startsWith('icon-') === true) {
        cls = icon
      }
      else if (icon.startsWith('bt-') === true) {
        cls = `bt ${icon}`
      }
      else if (icon.startsWith('eva-') === true) {
        cls = `eva ${icon}`
      }
      else if (/^ion-(md|ios|logo)/.test(icon) === true) {
        cls = `ionicons ${icon}`
      }
      else if (icon.startsWith('ion-') === true) {
        cls = `ionicons ion-${this.$q.platform.is.ios === true ? 'ios' : 'md'}${icon.substr(3)}`
      }
      else if (icon.startsWith('mdi-') === true) {
        cls = `mdi ${icon}`
      }
      else if (icon.startsWith('iconfont ') === true) {
        cls = `${icon}`
      }
      else if (icon.startsWith('ti-') === true) {
        cls = `themify-icon ${icon}`
      }
      else {
        cls = 'material-icons'
        content = icon
      }

      return {
        cls: cls + (this.color !== void 0 ? ` text-${this.color}` : '') +
          (this.left === true ? ' on-left' : '') +
          (this.right === true ? ' on-right' : ''),
        content
      }
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
      class: this.type.cls,
      style: this.style,
      attrs: { 'aria-hidden': true },
      on: this.$listeners
    }, [
      this.type.content,
      slot(this, 'default')
    ])
  }
})
