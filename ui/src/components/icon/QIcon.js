import { h } from 'vue'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import {
  getSizeStyle,
  useSizeProps
} from '../../composables/private.use-size/use-size.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hMergeSlot, hSlot } from '../../utils/private.render/render.js'

const defaultViewBox = '0 0 24 24'
// "ion-" prefixed names are handled before this map is consulted
const libMap = {
  'mdi-': 'mdi ',
  'icon-': '', // fontawesome equiv
  'fa-': '',
  'bt-': 'bt ',
  'eva-': 'eva ',
  'iconfont ': '',
  'ti-': 'themify-icon ',
  'bi-': 'bootstrap-icons ',
  'i-': '' // UnoCSS pure icons
}
const libPrefixes = Object.keys(libMap)

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

// legacy fontawesome / line-awesome style syntax:
// "[lf]a[srlbdk]? " — "fa fa-...", "fas fa-...", "las la-...", ...
function isFaLegacy(s) {
  const c0 = s.codePointAt(0)
  if ((c0 !== 102 && c0 !== 108) || s.codePointAt(1) !== 97) {
    return false // f | l, then a
  }

  const c2 = s.codePointAt(2)
  return c2 === 32 // ' '
    ? true
    : s.codePointAt(3) === 32 &&
        (c2 === 115 || // s
          c2 === 114 || // r
          c2 === 108 || // l
          c2 === 98 || // b
          c2 === 100 || // d
          c2 === 107) // k
}

function isSpace(c) {
  return (
    c === 32 ||
    (c >= 9 && c <= 13) ||
    c === 0xa0 ||
    c === 0x16_80 ||
    (c >= 0x20_00 && c <= 0x20_0a) ||
    c === 0x20_28 ||
    c === 0x20_29 ||
    c === 0x20_2f ||
    c === 0x20_5f ||
    c === 0x30_00 ||
    c === 0xfe_ff
  )
}

function isSvgPath(s) {
  const c0 = s.codePointAt(0)
  if (c0 !== 77 && c0 !== 109) return false // M m
  let i = 1
  let c = s.codePointAt(i)
  if (isSpace(c)) c = s.codePointAt(++i)
  if (c === 43 || c === 45) c = s.codePointAt(++i) // + -
  if (c === 46) c = s.codePointAt(++i) // .
  return c >= 48 && c <= 57
}

const noneType = { cls: '' }

// shared across all ligature vnodes — Vue treats plain, non-reactive
// vnode props as read-only (same contract the cached svg path
// definitions rely on)
const ligatureSpanProps = { 'aria-hidden': 'true' }

function parseIcon(icon, isIos) {
  if (icon.startsWith('img:')) {
    return {
      cls: '',
      img: true,
      src: icon.slice(4)
    }
  }

  if (icon.startsWith('svguse:')) {
    const [def, viewBox] = icon.split('|')

    return {
      cls: '',
      svguse: true,
      src: def.slice(7),
      viewBox: viewBox || defaultViewBox
    }
  }

  // class-based sets render their glyph through the font's own
  // ::before rule, so they carry no text content at all

  if (icon.startsWith('ion-')) {
    return {
      // explicit-platform names (ion-md-*/ion-ios-*/ion-logo-*) pass
      // through untouched; bare ion-* gets the current platform's prefix
      cls:
        ' ionicons ' +
        (icon.startsWith('ion-md') ||
        icon.startsWith('ion-ios') ||
        icon.startsWith('ion-logo')
          ? icon
          : `ion-${isIos ? 'ios' : 'md'}${icon.slice(3)}`)
    }
  }

  // ligature sets (material icons/symbols) carry the icon name as
  // real text content
  // an unknown "sym_" name falls through and is treated as a regular
  // material-icons ligature name
  if (icon.startsWith('sym_')) {
    const symType = symMap[icon.slice(0, 6)]
    if (symType !== void 0) {
      return {
        // "notranslate" class is for Google Translate
        // to avoid tampering with Material Symbols ligature font
        cls: ' notranslate material-symbols' + symType,
        content: icon.slice(6),
        ligature: true
      }
    }
  }

  // declaration order matters: "icon-"/"iconfont " must win over "i-"
  for (const prefix of libPrefixes) {
    if (icon.startsWith(prefix)) {
      return { cls: ` ${libMap[prefix]}${icon}` }
    }
  }

  if (isFaLegacy(icon)) {
    return { cls: ' ' + icon }
  }

  if (isSvgPath(icon)) {
    const [def, viewBox] = icon.split('|')

    return {
      cls: '',
      svg: true,
      viewBox: viewBox || defaultViewBox,
      // plain path definitions; vnodes are built per render
      // (Vue clones already-mounted vnodes anyway)
      nodes: def.split('&&').map(path => {
        const [d, style, transform] = path.split('@@')
        return { d, style, transform }
      })
    }
  }

  // "notranslate" class is for Google Translate
  // to avoid tampering with Material Icons ligature font
  //
  // Caution: To be able to add suffix to the class name,
  // keep the 'material-icons' at the end of the string.
  const cls = ' notranslate material-icons'
  const matType = matMap[icon.slice(0, 2)]

  return matType !== void 0
    ? { cls: cls + matType, content: icon.slice(2), ligature: true }
    : { cls, content: icon, ligature: true }
}

// parse results are deterministic per (platform, name), so they are
// shared module-wide; two maps (md/ios) because only the "ion-" prefix
// is platform-dependent and SSR serves both platforms from one process
const typeCacheMd = new Map()
const typeCacheIos = new Map()

function getType(icon, isIos) {
  const cache = isIos ? typeCacheIos : typeCacheMd
  let type = cache.get(icon)

  if (type === void 0) {
    // svg path definitions can be generated on the fly (e.g. animated
    // paths), so guard against unbounded growth
    if (cache.size > 1000) cache.clear()
    type = parseIcon(icon, isIos)
    cache.set(icon, type)
  }

  return type
}

// an iconMapFn is expected to be a pure (name) => mapping function
const mapFnCache = new WeakMap()

function getMappedType(mapFn, icon, isIos) {
  let cache = mapFnCache.get(mapFn)
  if (cache === void 0) {
    cache = new Map()
    mapFnCache.set(mapFn, cache)
  }

  const key = (isIos === true ? 'ios;' : 'md;') + icon
  let type = cache.get(key)

  if (type === void 0) {
    if (cache.size > 1000) cache.clear()

    const res = mapFn(icon)

    if (res === void 0) {
      type = getType(icon, isIos)
    } else if (res.icon !== void 0) {
      type =
        res.icon === 'none' || !res.icon ? noneType : getType(res.icon, isIos)
    } else {
      const { cls, content } = res
      type = {
        cls: cls !== void 0 ? ' ' + cls : '',
        content,
        ligature: content !== void 0 && content.trim().length !== 0
      }
    }

    cache.set(key, type)
  }

  return type
}

export default /*#__PURE__*/ createComponent({
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

  setup(props, { slots }) {
    const $q = useQuasar()
    const isIos = $q.platform.is.ios

    // no per-instance computeds: QIcon is mount-dominated, everything
    // derived is either per-render trivial or served by the module caches;
    // the memo below only spares re-renders with an unchanged name
    // (a null start value is safe: a null name resolves to noneType)
    let lastIcon = null
    let lastType = noneType
    let lastMapFn = null

    return () => {
      const icon = props.name

      if (icon !== lastIcon || $q.iconMapFn !== lastMapFn) {
        lastIcon = icon
        lastMapFn = $q.iconMapFn
        lastType =
          icon === 'none' || !icon
            ? noneType
            : lastMapFn !== null
              ? getMappedType(lastMapFn, icon, isIos)
              : getType(icon, isIos)
      }

      const type = lastType

      const data = {
        'aria-hidden': 'true',
        class:
          'q-icon' +
          (props.left ? ' on-left' : '') + // TODO Qv3: drop this
          (props.right ? ' on-right' : '') +
          (props.color !== void 0 ? ` text-${props.color}` : '') +
          type.cls
      }

      if (props.size !== void 0) {
        data.style = getSizeStyle(props.size)
      }

      if (type.content !== void 0) {
        return h(
          props.tag,
          data,
          hMergeSlot(slots.default, [
            // ligature text is rendered as a glyph, so it must not
            // surface in the accessibility tree, where it would compete
            // with the aria-label of interactive icons (WCAG 2.5.3)
            type.ligature
              ? h('span', ligatureSpanProps, type.content)
              : type.content
          ])
        )
      }

      if (type.img) {
        return h(
          props.tag,
          data,
          hMergeSlot(slots.default, [h('img', { src: type.src })])
        )
      }

      if (type.svg) {
        return h(
          props.tag,
          data,
          hMergeSlot(slots.default, [
            h(
              'svg',
              { viewBox: type.viewBox },
              type.nodes.map(svgData => h('path', svgData))
            )
          ])
        )
      }

      if (type.svguse) {
        return h(
          props.tag,
          data,
          hMergeSlot(slots.default, [
            h('svg', { viewBox: type.viewBox }, [
              h('use', { 'xlink:href': type.src })
            ])
          ])
        )
      }

      // "none" type and class-based sets: no content of their own
      return h(props.tag, data, hSlot(slots.default))
    }
  }
})
