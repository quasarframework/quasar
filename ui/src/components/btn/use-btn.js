import { computed } from 'vue'

import useAlign, {
  useAlignProps
} from '../../composables/private.use-align/use-align.js'
import {
  createSizeStyle,
  useSizeProps
} from '../../composables/private.use-size/use-size.js'
import useRouterLink, {
  useRouterLinkNonMatchingProps
} from '../../composables/private.use-router-link/use-router-link.js'

export const btnPadding = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
}

export const defaultSizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
}

const getSizeStyle = /*#__PURE__*/ createSizeStyle(defaultSizes)

const formTypes = ['button', 'submit', 'reset']
const mediaTypeRE = /[^\s]\/[^\s]/

export const btnDesignOptions = ['flat', 'outline', 'push', 'unelevated']

export function getBtnDesign(props, defaultValue) {
  if (props.flat) return 'flat'
  if (props.outline) return 'outline'
  if (props.push) return 'push'
  if (props.unelevated) return 'unelevated'
  return defaultValue
}

export function getBtnDesignAttr(props) {
  const design = getBtnDesign(props)
  return design !== void 0 ? { [design]: true } : {}
}

export const nonRoundBtnProps = {
  ...useSizeProps,
  ...useRouterLinkNonMatchingProps,

  type: {
    type: String,
    default: 'button'
  },

  label: [Number, String],
  icon: String,
  iconRight: String,

  ...btnDesignOptions.reduce((acc, val) => (acc[val] = Boolean) && acc, {}),

  square: Boolean,
  rounded: Boolean,
  glossy: Boolean,

  size: String,
  fab: Boolean,
  fabMini: Boolean,
  padding: String,

  color: String,
  textColor: String,
  noCaps: Boolean,
  noWrap: Boolean,
  dense: Boolean,

  tabindex: [Number, String],

  ripple: {
    type: [Boolean, Object],
    default: true
  },

  align: {
    ...useAlignProps.align,
    default: 'center'
  },
  stack: Boolean,
  stretch: Boolean,
  loading: {
    type: Boolean,
    default: null
  },
  disable: Boolean
}

export const useBtnProps = {
  ...nonRoundBtnProps,
  round: Boolean
}

export default function useBtn(props) {
  const alignClass = useAlign(props)
  const { hasRouterLink, hasLink, linkTag, linkAttrs, navigateOnClick } =
    useRouterLink({
      fallbackTag: 'button'
    })

  const style = computed(() => {
    const obj = props.fab || props.fabMini ? {} : getSizeStyle(props.size)

    return props.padding !== void 0
      ? {
          ...obj,
          padding: props.padding
            .split(/\s+/)
            .map(v => (v in btnPadding ? btnPadding[v] + 'px' : v))
            .join(' '),
          minWidth: '0',
          minHeight: '0'
        }
      : obj
  })

  const isRounded = computed(() => props.rounded || props.fab || props.fabMini)

  const isActionable = computed(() => !props.disable && !props.loading)

  const tabIndex = computed(() =>
    isActionable.value ? props.tabindex || 0 : -1
  )

  const design = computed(() => getBtnDesign(props, 'standard'))

  const attributes = computed(() => {
    const acc = { tabindex: tabIndex.value }

    if (hasLink.value) {
      Object.assign(acc, linkAttrs.value)
    } else if (formTypes.includes(props.type)) {
      acc.type = props.type
    }

    if (linkTag.value === 'a') {
      if (props.disable) {
        acc['aria-disabled'] = 'true'
      }

      // a disabled link loses its href, but must still announce
      // as a (dimmed) button rather than as plain text
      if (acc.href === void 0) {
        acc.role = 'button'
      }

      if (!hasRouterLink.value && mediaTypeRE.test(props.type)) {
        acc.type = props.type
      }
    } else if (props.disable) {
      acc.disabled = ''
      acc['aria-disabled'] = 'true'
    }

    if (props.loading && props.percentage !== void 0) {
      Object.assign(acc, {
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': props.percentage
      })
    }

    return acc
  })

  const classes = computed(() => {
    let colors

    if (props.color !== void 0) {
      colors =
        props.flat || props.outline
          ? `text-${props.textColor || props.color}`
          : `bg-${props.color} text-${props.textColor || 'white'}`
    } else if (props.textColor) {
      colors = `text-${props.textColor}`
    }

    const shape = props.round
      ? 'round'
      : `rectangle${isRounded.value ? ' q-btn--rounded' : props.square ? ' q-btn--square' : ''}`

    return (
      `q-btn--${design.value} q-btn--${shape}` +
      (colors !== void 0 ? ' ' + colors : '') +
      (isActionable.value
        ? ' q-btn--actionable q-focusable q-hoverable'
        : props.disable
          ? ' disabled'
          : '') +
      (props.fab ? ' q-btn--fab' : props.fabMini ? ' q-btn--fab-mini' : '') +
      (props.noCaps ? ' q-btn--no-uppercase' : '') +
      (props.dense ? ' q-btn--dense' : '') +
      (props.stretch ? ' no-border-radius self-stretch' : '') +
      (props.glossy ? ' glossy' : '') +
      (props.square ? ' q-btn--square' : '')
    )
  })

  const innerClasses = computed(
    () =>
      alignClass() +
      (props.stack ? ' column' : ' row') +
      (props.noWrap ? ' no-wrap text-no-wrap' : '') +
      (props.loading ? ' q-btn__content--hidden' : '')
  )

  return {
    classes,
    style,
    innerClasses,
    attributes,
    hasLink,
    linkTag,
    navigateOnClick,
    isActionable
  }
}
