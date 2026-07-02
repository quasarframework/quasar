import { computed, h } from 'vue'

import useSize, {
  useSizeProps
} from '../../composables/private.use-size/use-size.js'

const defaultViewBox = '0 0 24 24'

const sameFn = i => i
const ionFn = i => `ionicons ${i}`

const libMap = {
  'mdi-': i => `mdi ${i}`,
  'icon-': sameFn, // fontawesome equiv
  'bt-': i => `bt ${i}`,
  'eva-': i => `eva ${i}`,
  'ion-md': ionFn,
  'ion-ios': ionFn,
  'ion-logo': ionFn,
  'iconfont ': sameFn,
  'ti-': i => `themify-icon ${i}`,
  'bi-': i => `bootstrap-icons ${i}`,
  'i-': sameFn // UnoCSS pure icons
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
const faRE =
  /^(fa-(classic|sharp|solid|regular|light|brands|duotone|thin)|[lf]a[srlbdk]?) /

export const useIconProps = {
  ...useSizeProps,

  /**
   * HTML tag to use
   *
   * @api prop tag
   * @type {String}
   * @default 'i'
   * @category content
   * @example 'i'
   * @example 'span'
   */
  tag: {
    type: String,
    default: 'i'
  },

  /**
   * Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix
   *
   * @api prop name
   * @extends icon
   */
  name: String,

  /**
   * Color name for component from the Quasar Color Palette
   *
   * @api prop color
   * @extends text-color
   */
  color: String,

  /**
   * Useful if icon is on the left side of something: applies a standard margin on the right side of the icon
   *
   * @api prop left
   * @type {Boolean}
   * @category style
   */
  left: Boolean,

  /**
   * Useful if icon is on the right side of something: applies a standard margin on the left side of the icon
   *
   * @api prop right
   * @type {Boolean}
   * @category style
   */
  right: Boolean
}

export default function useIcon(props, $q) {
  const sizeStyle = useSize(props)

  const classes = computed(
    () =>
      'q-icon' +
      (props.left ? ' on-left' : '') + // TODO Qv3: drop this
      (props.right ? ' on-right' : '') +
      (props.color !== void 0 ? ` text-${props.color}` : '')
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
        } else {
          return {
            cls: res.cls,
            content: res.content !== void 0 ? res.content : ' '
          }
        }
      }
    }

    if (mRE.test(icon)) {
      const [def, viewBox = defaultViewBox] = icon.split('|')

      return {
        svg: true,
        viewBox,
        nodes: def.split('&&').map(path => {
          const [d, style, transform] = path.split('@@')
          return h('path', { style, d, transform })
        })
      }
    }

    if (imgRE.test(icon)) {
      return {
        img: true,
        src: icon.slice(4)
      }
    }

    if (svgUseRE.test(icon)) {
      const [def, viewBox = defaultViewBox] = icon.split('|')

      return {
        svguse: true,
        src: def.slice(7),
        viewBox
      }
    }

    let content = ' '
    const matches = icon.match(libRE)

    if (matches !== null) {
      cls = libMap[matches[1]](icon)
    } else if (faRE.test(icon)) {
      cls = icon
    } else if (ionRE.test(icon)) {
      cls = `ionicons ion-${$q.platform.is.ios ? 'ios' : 'md'}${icon.slice(3)}`
    } else if (symRE.test(icon)) {
      // "notranslate" class is for Google Translate
      // to avoid tampering with Material Symbols ligature font
      //
      // Caution: To be able to add suffix to the class name,
      // keep the 'material-symbols' at the end of the string.
      cls = 'notranslate material-symbols'

      const symMatches = icon.match(symRE)
      if (symMatches !== null) {
        icon = icon.slice(6)
        cls += symMap[symMatches[1]]
      }

      content = icon
    } else {
      // "notranslate" class is for Google Translate
      // to avoid tampering with Material Icons ligature font
      //
      // Caution: To be able to add suffix to the class name,
      // keep the 'material-icons' at the end of the string.
      cls = 'notranslate material-icons'

      const matMatches = icon.match(matRE)
      if (matMatches !== null) {
        icon = icon.slice(2)
        cls += matMap[matMatches[1]]
      }

      content = icon
    }

    return {
      cls,
      content
    }
  })

  return {
    classes,
    sizeStyle,
    type
  }
}
