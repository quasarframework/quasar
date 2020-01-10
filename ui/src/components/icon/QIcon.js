import Vue from 'vue'

import SizeMixin from '../../mixins/size.js'
import { mergeSlot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QIcon',

  mixins: [ SizeMixin ],

  props: {
    name: String,
    color: String,
    left: Boolean,
    right: Boolean
  },

  computed: {
    type () {
      let cls
      let icon = this.name

      if (!icon) {
        return {
          cls: void 0,
          content: void 0
        }
      }

      const commonCls = 'q-icon' +
        (this.left === true ? ' on-left' : '') +
        (this.right === true ? ' on-right' : '') +
        (this.color !== void 0 ? ` text-${this.color}` : '')

      if (this.$q.iconMapFn !== void 0) {
        const res = this.$q.iconMapFn(icon)
        if (res !== void 0) {
          if (res.icon !== void 0) {
            icon = res.icon
          }
          else {
            return {
              cls: res.cls + ' ' + commonCls,
              content: res.content !== void 0
                ? res.content
                : ' '
            }
          }
        }
      }

      if (icon.startsWith('M') === true) {
        const cfg = icon.split('|')
        return {
          svg: true,
          cls: commonCls + ' q-svg-icon',
          path: cfg[0],
          viewBox: cfg[1] !== void 0 ? cfg[1] : '0 0 24 24'
        }
      }

      if (icon.startsWith('img:') === true) {
        return {
          img: true,
          cls: commonCls,
          src: icon.substring(4)
        }
      }

      let content = ' '

      if (/^fa[s|r|l|b|d]{0,1} /.test(icon) || icon.startsWith('icon-') === true) {
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

        if (icon.startsWith('o_') === true) {
          icon = icon.substring(2)
          cls += '-outlined'
        }
        else if (icon.startsWith('r_') === true) {
          icon = icon.substring(2)
          cls += '-round'
        }
        else if (icon.startsWith('s_') === true) {
          icon = icon.substring(2)
          cls += '-sharp'
        }

        content = icon
      }

      return {
        cls: cls + ' ' + commonCls,
        content
      }
    }
  },

  render (h) {
    if (this.type.img === true) {
      return h('img', {
        staticClass: this.type.cls,
        style: this.sizeStyle,
        on: this.$listeners,
        attrs: { src: this.type.src }
      })
    }

    const data = {
      staticClass: this.type.cls,
      style: this.sizeStyle,
      on: this.$listeners,
      attrs: {
        'aria-hidden': true,
        role: 'presentation'
      }
    }

    if (this.type.svg === true) {
      data.attrs.focusable = 'false' /* needed for IE11 */
      data.attrs.viewBox = this.type.viewBox

      return h('svg', data, mergeSlot([
        h('path', {
          attrs: { d: this.type.path }
        })
      ], this, 'default'))
    }

    return h('i', data, mergeSlot([
      this.type.content
    ], this, 'default'))
  }
})
