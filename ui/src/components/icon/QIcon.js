import { h, defineComponent } from 'vue'

import SizeMixin from '../../mixins/size.js'

import { hSlot, hMergeSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QIcon',

  mixins: [ SizeMixin ],

  props: {
    tag: {
      type: String,
      default: 'i'
    },

    name: String,
    color: String,
    left: Boolean,
    right: Boolean
  },

  computed: {
    classes () {
      return 'q-icon' +
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
            return h('path', {
              style,
              d,
              transform
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
      else {
        // "notranslate" class is for Google Translate
        // to avoid tampering with Material Icons ligature font
        cls = 'material-icons notranslate'

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

  render () {
    const data = {
      class: this.type.cls,
      style: this.sizeStyle,
      'aria-hidden': 'true',
      role: 'presentation'
    }

    if (this.type.none === true) {
      return h(this.tag, data, hSlot(this, 'default'))
    }

    if (this.type.img === true) {
      data.src = this.type.src
      return h('img', data)
    }

    if (this.type.svg === true) {
      data.focusable = 'false' /* needed for IE11 */
      data.viewBox = this.type.viewBox

      return h('svg', data, hMergeSlot(this.type.nodes, this, 'default'))
    }

    if (this.type.svguse === true) {
      data.focusable = 'false' /* needed for IE11 */
      data.viewBox = this.type.viewBox

      return h('svg', data, hMergeSlot(
        [ h('use', { 'xlink:href': this.type.src }) ],
        this,
        'default')
      )
    }

    return h(this.tag, data, hMergeSlot([
      this.type.content
    ], this, 'default'))
  }
})
