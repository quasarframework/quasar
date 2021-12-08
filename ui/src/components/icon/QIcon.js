import Vue from 'vue'

import SizeMixin from '../../mixins/size.js'
import TagMixin from '../../mixins/tag.js'
import ListenersMixin from '../../mixins/listeners.js'

import { slot, mergeSlot } from '../../utils/slot.js'

const sameFn = i => i
const ionFn = i => `ionicons ${i}`

const libMap = {
  'icon-': sameFn, // fontawesome equiv
  'bt-': i => `bt ${i}`,
  'eva-': i => `eva ${i}`,
  'ion-md': ionFn,
  'ion-ios': ionFn,
  'ion-logo': ionFn,
  'mdi-': i => `mdi ${i}`,
  'iconfont ': sameFn,
  'ti-': i => `themify-icon ${i}`,
  'bi-': i => `bootstrap-icons ${i}`
}

const matMap = {
  o_: '-outlined',
  r_: '-round',
  s_: '-sharp'
}

const libRE = new RegExp('^(' + Object.keys(libMap).join('|') + ')')
const matRE = new RegExp('^(' + Object.keys(matMap).join('|') + ')')
const mRE = /^[Mm]\s?[-+]?\.?\d/
const imgRE = /^img:/
const svgUseRE = /^svguse:/
const ionRE = /^ion-/
const faLaRE = /^[lf]a[srlbdk]? /

export default Vue.extend({
  name: 'QIcon',

  mixins: [ ListenersMixin, SizeMixin, TagMixin ],

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

      if (mRE.test(icon) === true) {
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

      if (imgRE.test(icon) === true) {
        return {
          img: true,
          cls: this.classes,
          src: icon.substring(4)
        }
      }

      if (svgUseRE.test(icon) === true) {
        const [ def, viewBox ] = icon.split('|')

        return {
          svguse: true,
          cls: this.classes,
          src: def.substring(7),
          viewBox: viewBox !== void 0 ? viewBox : '0 0 24 24'
        }
      }

      let content = ' '
      const matches = icon.match(libRE)

      if (matches !== null) {
        cls = libMap[ matches[ 1 ] ](icon)
      }
      else if (faLaRE.test(icon) === true) {
        cls = icon
      }
      else if (ionRE.test(icon) === true) {
        cls = `ionicons ion-${this.$q.platform.is.ios === true ? 'ios' : 'md'}${icon.substr(3)}`
      }
      else {
        // "notranslate" class is for Google Translate
        // to avoid tampering with Material Icons ligature font
        //
        // Caution: To be able to add suffix to the class name,
        // keep the 'material-icons' at the end of the string.
        cls = 'notranslate material-icons'

        const matches = icon.match(matRE)
        if (matches !== null) {
          icon = icon.substring(2)
          cls += matMap[ matches[ 1 ] ]
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

      return h('svg', data, mergeSlot([
        h('use', { attrs: { 'xlink:href': this.type.src } })
      ], this, 'default'))
    }

    return h(this.tag, data, mergeSlot([
      this.type.content
    ], this, 'default'))
  }
})
