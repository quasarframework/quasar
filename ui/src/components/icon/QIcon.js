import Vue from 'vue'

import SizeMixin from '../../mixins/size.js'
import TagMixin from '../../mixins/tag.js'
import ListenersMixin from '../../mixins/listeners.js'

import { slot, mergeSlot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QIcon',

  mixins: [ ListenersMixin, SizeMixin, TagMixin ],

  props: {
    tag: {
      default: 'i'
    },

    name: String,
    color: String,
    left: Boolean,
    right: Boolean
  },

  computed: {
    classes () {
      // "notranslate" class is for Google Translate
      // to avoid tampering with Material Icons ligature font
      return 'q-icon notranslate' +
        (this.left === true ? ' on-left' : '') +
        (this.right === true ? ' on-right' : '') +
        (this.color !== void 0 ? ` text-${this.color}` : '')
    },

    type () {
      let cls
      let icon = this.name

      if (!icon) {
        return {
          none: true,
          cls: this.classes
        }
      }

      if (this.$q.iconMapFn !== void 0) {
        const res = this.$q.iconMapFn(icon)
        if (res !== void 0) {
          if (res.icon !== void 0) {
            icon = res.icon
          }
          else {
            return {
              cls: res.cls + ' ' + this.classes,
              content: res.content !== void 0
                ? res.content
                : ' '
            }
          }
        }
      }

      if (icon.startsWith('M') === true) {
        const [ def, viewBox ] = icon.split('|')

        return {
          svg: true,
          cls: this.classes,
          nodes: def.split('&&').map(path => {
            const [ d, style, transform ] = path.split('@@')
            return this.$createElement('path', {
              attrs: {
                d,
                transform
              },
              style
            })
          }),
          viewBox: viewBox !== void 0 ? viewBox : '0 0 24 24'
        }
      }

      if (icon.startsWith('img:') === true) {
        return {
          img: true,
          cls: this.classes,
          src: icon.substring(4)
        }
      }

      if (icon.startsWith('svguse:') === true) {
        const [ def, viewBox ] = icon.split('|')

        return {
          svguse: true,
          cls: this.classes,
          src: def.substring(7),
          viewBox: viewBox !== void 0 ? viewBox : '0 0 24 24'
        }
      }

      let content = ' '

      if (/^[l|f]a[s|r|l|b|d]{0,1} /.test(icon) || icon.startsWith('icon-') === true) {
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
      else if (icon.startsWith('bi-') === true) {
        cls = `bootstrap-icons ${icon}`
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
        cls: cls + ' ' + this.classes,
        content
      }
    }
  },

  render (h) {
    const data = {
      class: this.type.cls,
      style: this.sizeStyle,
      on: { ...this.qListeners },
      attrs: {
        'aria-hidden': 'true',
        role: 'presentation'
      }
    }

    if (this.type.none === true) {
      return h(this.tag, data, slot(this, 'default'))
    }

    if (this.type.img === true) {
      data.attrs.src = this.type.src
      return h('img', data)
    }

    if (this.type.svg === true) {
      data.attrs.focusable = 'false' /* needed for IE11 */
      data.attrs.viewBox = this.type.viewBox

      return h('svg', data, mergeSlot(this.type.nodes, this, 'default'))
    }
    if (this.type.svguse === true) {
      data.attrs.focusable = 'false' /* needed for IE11 */
      data.attrs.viewBox = this.type.viewBox

      return h('svg', data, [
        h('use', {
          attrs: {
            'xlink:href': this.type.src
          }
        }),
        mergeSlot(this.type.nodes, this, 'default')
      ])
    }

    return h(this.tag, data, mergeSlot([
      this.type.content
    ], this, 'default'))
  }
})
