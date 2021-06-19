import { h, defineComponent, computed, getCurrentInstance } from 'vue'

import useSize, { useSizeProps } from '../../composables/private/use-size.js'
import { hSlot, hMergeSlot } from '../../utils/private/render.js'

const sameFn = i => i
const ionFn = i => `ionicons ${ i }`

const libMap = {
  'icon-': sameFn, // fontawesome equiv
  'bt-': i => `bt ${ i }`,
  'eva-': i => `eva ${ i }`,
  'ion-md': ionFn,
  'ion-ios': ionFn,
  'ion-logo': ionFn,
  'mdi-': i => `mdi ${ i }`,
  'iconfont ': sameFn,
  'ti-': i => `themify-icon ${ i }`,
  'bi-': i => `bootstrap-icons ${ i }`
}

const matMap = {
  o_: '-outlined',
  r_: '-round',
  s_: '-sharp'
}

const libRE = new RegExp('^(' + Object.keys(libMap).join('|') + ')')
const matRE = new RegExp('^(' + Object.keys(matMap).join('|') + ')')
const mRE = /^M/
const imgRE = /^img:/
const svgUseRE = /^svguse:/
const ionRE = /^ion-/
const faLaRE = /^[l|f]a[s|r|l|b|d]? /

export default defineComponent({
  name: 'QIcon',

  props: {
    ...useSizeProps,

    tag: {
      type: String,
      default: 'i'
    },

    name: String,
    color: String,
    left: Boolean,
    right: Boolean
  },

  setup (props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance()
    const sizeStyle = useSize(props)

    const classes = computed(() =>
      'q-icon'
      + (props.left === true ? ' on-left' : '')
      + (props.right === true ? ' on-right' : '')
      + (props.color !== void 0 ? ` text-${ props.color }` : '')
    )

    const type = computed(() => {
      let cls
      let icon = props.name

      if (!icon) {
        return {
          none: true,
          cls: classes.value
        }
      }

      if ($q.iconMapFn !== null) {
        const res = $q.iconMapFn(icon)
        if (res !== void 0) {
          if (res.icon !== void 0) {
            icon = res.icon
          }
          else {
            return {
              cls: res.cls + ' ' + classes.value,
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
          cls: classes.value,
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

      if (imgRE.test(icon) === true) {
        return {
          img: true,
          cls: classes.value,
          src: icon.substring(4)
        }
      }

      if (svgUseRE.test(icon) === true) {
        const [ def, viewBox ] = icon.split('|')

        return {
          svguse: true,
          cls: classes.value,
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
        cls = `ionicons ion-${ $q.platform.is.ios === true ? 'ios' : 'md' }${ icon.substr(3) }`
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
        cls: cls + ' ' + classes.value,
        content
      }
    })

    return () => {
      const data = {
        class: type.value.cls,
        style: sizeStyle.value,
        'aria-hidden': 'true',
        role: 'presentation'
      }

      if (type.value.none === true) {
        return h(props.tag, data, hSlot(slots.default))
      }

      if (type.value.img === true) {
        data.src = type.value.src
        return h('img', data)
      }

      if (type.value.svg === true) {
        data.viewBox = type.value.viewBox

        return h('svg', data, hMergeSlot(slots.default, type.value.nodes))
      }

      if (type.value.svguse === true) {
        data.viewBox = type.value.viewBox

        return h(
          'svg',
          data,
          hMergeSlot(slots.default, [ h('use', { 'xlink:href': type.value.src }) ])
        )
      }

      return h(props.tag, data, hMergeSlot(slots.default, [
        type.value.content
      ]))
    }
  }
})
