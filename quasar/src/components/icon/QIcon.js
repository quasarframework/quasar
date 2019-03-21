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

      const commonCls = 'q-icon' +
        (this.left === true ? ' on-left' : '') +
        (this.right === true ? ' on-right' : '')

      if (icon.startsWith('img:') === true) {
        return {
          img: true,
          cls: commonCls,
          src: icon.substring(4)
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
        cls: cls + ' ' + commonCls +
          (this.color !== void 0 ? ` text-${this.color}` : ''),
        content
      }
    },

    style () {
      if (this.size !== void 0) {
        return { fontSize: this.size }
      }
    }
  },

  render (h) {
    return this.type.img === true
      ? h('img', {
        staticClass: this.type.cls,
        style: this.style,
        on: this.$listeners,
        attrs: { src: this.type.src }
      })
      : h('i', {
        staticClass: this.type.cls,
        style: this.style,
        on: this.$listeners,
        attrs: { 'aria-hidden': true }
      }, [
        this.type.content,
        slot(this, 'default')
      ])
  }
})
