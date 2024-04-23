import { h, computed, getCurrentInstance } from 'vue'

import useSize, { useSizeProps } from '../../composables/private.use-size/use-size.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot, hMergeSlot } from '../../utils/private.render/render.js'

const defaultViewBox = '0 0 24 24'

const sameFn = i => i
const ionFn = i => `ionicons ${ i }`

const libMap = {
  'mdi-': i => `mdi ${ i }`,
  'icon-': sameFn, // fontawesome equiv
  'bt-': i => `bt ${ i }`,
  'eva-': i => `eva ${ i }`,
  'ion-md': ionFn,
  'ion-ios': ionFn,
  'ion-logo': ionFn,
  'iconfont ': sameFn,
  'ti-': i => `themify-icon ${ i }`,
  'bi-': i => `bootstrap-icons ${ i }`
}

const matMap = {
  o_: '-outlined',
  r_: '-round',
  s_: '-sharp'
}

const symMap = {
  sym_o_: '-outlined',
  sym_r_: '-rounded',
  sym_s_: '-sharp'
}

const libRE = new RegExp('^(' + Object.keys(libMap).join('|') + ')')
const matRE = new RegExp('^(' + Object.keys(matMap).join('|') + ')')
const symRE = new RegExp('^(' + Object.keys(symMap).join('|') + ')')
const mRE = /^[Mm]\s?[-+]?\.?\d/
const imgRE = /^img:/
const svgUseRE = /^svguse:/
const ionRE = /^ion-/
const faRE = /^(fa-(sharp|solid|regular|light|brands|duotone|thin)|[lf]a[srlbdk]?) /

export default createComponent({
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
      + (props.left === true ? ' on-left' : '') // TODO Qv3: drop this
      + (props.right === true ? ' on-right' : '')
      + (props.color !== void 0 ? ` text-${ props.color }` : '')
    )

    const type = computed(() => {
      let cls
      let icon = props.name

      if (icon === 'none' || !icon) {
        return { none: true }
      }

      if ($q.iconMapFn !== null) {
        const res = $q.iconMapFn(icon)
        if (res !== void 0) {
          if (res.icon !== void 0) {
            icon = res.icon
            if (icon === 'none' || !icon) {
              return { none: true }
            }
          }
          else {
            return {
              cls: res.cls,
              content: res.content !== void 0
                ? res.content
                : ' '
            }
          }
        }
      }

      if (mRE.test(icon) === true) {
        const [ def, viewBox = defaultViewBox ] = icon.split('|')

        return {
          svg: true,
          viewBox,
          nodes: def.split('&&').map(path => {
            const [ d, style, transform ] = path.split('@@')
            return h('path', { style, d, transform })
          })
        }
      }

      if (imgRE.test(icon) === true) {
        return {
          img: true,
          src: icon.substring(4)
        }
      }

      if (svgUseRE.test(icon) === true) {
        const [ def, viewBox = defaultViewBox ] = icon.split('|')

        return {
          svguse: true,
          src: def.substring(7),
          viewBox
        }
      }

      let content = ' '
      const matches = icon.match(libRE)

      if (matches !== null) {
        cls = libMap[ matches[ 1 ] ](icon)
      }
      else if (faRE.test(icon) === true) {
        cls = icon
      }
      else if (ionRE.test(icon) === true) {
        cls = `ionicons ion-${ $q.platform.is.ios === true ? 'ios' : 'md' }${ icon.substring(3) }`
      }
      else if (symRE.test(icon) === true) {
        // "notranslate" class is for Google Translate
        // to avoid tampering with Material Symbols ligature font
        //
        // Caution: To be able to add suffix to the class name,
        // keep the 'material-symbols' at the end of the string.
        cls = 'notranslate material-symbols'

        const matches = icon.match(symRE)
        if (matches !== null) {
          icon = icon.substring(6)
          cls += symMap[ matches[ 1 ] ]
        }

        content = icon
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
        cls,
        content
      }
    })

    return () => {
      const data = {
        class: classes.value,
        style: sizeStyle.value,
        'aria-hidden': 'true',
        role: 'presentation'
      }

      if (type.value.none === true) {
        return h(props.tag, data, hSlot(slots.default))
      }

      if (type.value.img === true) {
        return h(props.tag, data, hMergeSlot(slots.default, [
          h('img', { src: type.value.src })
        ]))
      }

      if (type.value.svg === true) {
        return h(props.tag, data, hMergeSlot(slots.default, [
          h('svg', {
            viewBox: type.value.viewBox || '0 0 24 24'
          }, type.value.nodes)
        ]))
      }

      if (type.value.svguse === true) {
        return h(props.tag, data, hMergeSlot(slots.default, [
          h('svg', {
            viewBox: type.value.viewBox
          }, [
            h('use', { 'xlink:href': type.value.src })
          ])
        ]))
      }

      if (type.value.cls !== void 0) {
        data.class += ' ' + type.value.cls
      }

      return h(props.tag, data, hMergeSlot(slots.default, [
        type.value.content
      ]))
    }
  }
})
