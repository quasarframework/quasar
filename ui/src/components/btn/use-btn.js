import { computed } from 'vue'

import useAlign, {
  useAlignProps
} from '../../composables/private.use-align/use-align.js'
import useSize, {
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

  /**
   * 1) Define the button native type attribute (submit, reset, button) or 2) render component with <a> tag so you can access events even if disable or 3) Use 'href' prop and specify 'type' as a media tag
   *
   * @api prop type
   * @type {String}
   * @default 'button'
   * @category general
   * @example 'a'
   * @example 'submit'
   * @example 'button'
   * @example 'reset'
   * @example 'image/png'
   */
  type: {
    type: String,
    default: 'button'
  },

  /**
   * The text that will be shown on the button
   *
   * @api prop label
   * @type {String|Number}
   * @category content
   * @example 'Button Label'
   */
  label: [Number, String],

  /**
   * Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix
   *
   * @api prop icon
   * @extends icon
   */
  icon: String,

  /**
   * Icon name for the right side of the button, following Quasar convention
   *
   * @api prop icon-right
   * @extends icon
   */
  iconRight: String,

  /**
   * Use 'flat' design
   *
   * @api prop flat
   * @type {Boolean}
   * @category style
   */
  flat: Boolean,

  /**
   * Use 'outline' design
   *
   * @api prop outline
   * @type {Boolean}
   * @category style
   */
  outline: Boolean,

  /**
   * Use 'push' design
   *
   * @api prop push
   * @type {Boolean}
   * @category style
   */
  push: Boolean,

  /**
   * Remove shadow
   *
   * @api prop unelevated
   * @type {Boolean}
   * @category style
   */
  unelevated: Boolean,

  /**
   * Removes border-radius so borders are squared
   *
   * @api prop square
   * @extends square
   * @addedIn v2.7.6
   */
  square: Boolean,

  /**
   * Applies a more prominent border-radius for a squared shape button
   *
   * @api prop rounded
   * @type {Boolean}
   * @category style
   */
  rounded: Boolean,

  /**
   * Applies a glossy effect
   *
   * @api prop glossy
   * @type {Boolean}
   * @category style
   */
  glossy: Boolean,

  /**
   * Size in CSS units, including unit name or standard size name (xs|sm|md|lg|xl)
   *
   * @api prop size
   * @type {String}
   * @category style
   * @example '16px'
   * @example '2rem'
   * @example 'xs'
   * @example 'md'
   */
  size: String,

  /**
   * Makes button size and shape to fit a Floating Action Button
   *
   * @api prop fab
   * @type {Boolean}
   * @category style
   */
  fab: Boolean,

  /**
   * Makes button size and shape to fit a small Floating Action Button
   *
   * @api prop fab-mini
   * @type {Boolean}
   * @category style
   */
  fabMini: Boolean,

  /**
   * Apply custom padding (vertical [horizontal]); Size in CSS units, including unit name or standard size name (none|xs|sm|md|lg|xl); Also removes the min width and height when set
   *
   * @api prop padding
   * @type {String}
   * @category style
   * @example '16px'
   * @example '10px 5px'
   * @example '2rem'
   * @example 'xs'
   * @example 'md lg'
   * @example '2px 2px 5px 7px'
   */
  padding: String,

  /**
   * Color name for component from the Quasar Color Palette
   *
   * @api prop color
   * @extends color
   */
  color: String,

  /**
   * Overrides text color, if needed; Color name from the Quasar Color Palette
   *
   * @api prop text-color
   * @extends text-color
   */
  textColor: String,

  /**
   * Avoid turning label text into caps (which happens by default)
   *
   * @api prop no-caps
   * @type {Boolean}
   * @category content
   */
  noCaps: Boolean,

  /**
   * Avoid label text wrapping
   *
   * @api prop no-wrap
   * @type {Boolean}
   * @category content
   */
  noWrap: Boolean,

  /**
   * Dense mode; occupies less space
   *
   * @api prop dense
   * @extends dense
   */
  dense: Boolean,

  /**
   * Tabindex HTML attribute value
   *
   * @api prop tabindex
   * @extends tabindex
   */
  tabindex: [Number, String],

  /**
   * Configure material ripple or disable it
   *
   * @api prop ripple
   * @extends ripple
   */
  ripple: {
    type: [Boolean, Object],
    default: true
  },

  /**
   * Label or content alignment
   *
   * @api prop align
   * @type {String}
   * @default 'center'
   * @category content
   * @value 'left'
   * @value 'right'
   * @value 'center'
   * @value 'around'
   * @value 'between'
   * @value 'evenly'
   */
  align: {
    ...useAlignProps.align,
    default: 'center'
  },

  /**
   * Stack icon and label vertically instead of on same line (like it is by default)
   *
   * @api prop stack
   * @type {Boolean}
   * @category content
   */
  stack: Boolean,

  /**
   * When used on flexbox parent, button will stretch to parent's height
   *
   * @api prop stretch
   * @type {Boolean}
   * @category content
   */
  stretch: Boolean,

  /**
   * Put button into loading state (displays a QSpinner -- can be overridden by using a 'loading' slot)
   *
   * @api prop loading
   * @type {Boolean|null}
   * @default null
   * @category behavior|state
   */
  loading: {
    type: Boolean,
    default: null
  },

  /**
   * Put component in disabled mode
   *
   * @api prop disable
   * @extends disable
   */
  disable: Boolean
}

export const useBtnProps = {
  ...nonRoundBtnProps,

  /**
   * Makes a circle shaped button
   *
   * @api prop round
   * @type {Boolean}
   * @category style
   */
  round: Boolean
}

export default function useBtn(props) {
  const sizeStyle = useSize(props, defaultSizes)
  const alignClass = useAlign(props)
  const { hasRouterLink, hasLink, linkTag, linkAttrs, navigateOnClick } =
    useRouterLink({
      fallbackTag: 'button'
    })

  const style = computed(() => {
    const obj = props.fab || props.fabMini ? {} : sizeStyle.value

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
      } else if (acc.href === void 0) {
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
      alignClass.value +
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
