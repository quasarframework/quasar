import { computed } from 'vue'

import useAlign, { useAlignProps } from '../../composables/private/use-align.js'
import useSize, { useSizeProps } from '../../composables/private/use-size.js'
import useRouterLink, { useRouterLinkProps } from '../../composables/private/use-router-link.js'

const padding = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
}

const defaultSizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
}

export const useBtnProps = {
  ...useSizeProps,
  ...useRouterLinkProps,

  type: {
    type: String,
    default: 'button'
  },

  label: [ Number, String ],
  icon: String,
  iconRight: String,

  round: Boolean,
  outline: Boolean,
  flat: Boolean,
  unelevated: Boolean,
  rounded: Boolean,
  push: Boolean,
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

  tabindex: [ Number, String ],

  ripple: {
    type: [ Boolean, Object ],
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

export default function (props) {
  const sizeStyle = useSize(props, defaultSizes)
  const alignClass = useAlign(props)
  const { hasLink, linkProps, navigateToLink } = useRouterLink()

  const style = computed(() => {
    const obj = props.fab === false && props.fabMini === false
      ? sizeStyle.value
      : {}

    return props.padding !== void 0
      ? Object.assign({}, obj, {
          padding: props.padding
            .split(/\s+/)
            .map(v => (v in padding ? padding[ v ] + 'px' : v))
            .join(' '),
          minWidth: '0',
          minHeight: '0'
        })
      : obj
  })

  const isRounded = computed(() =>
    props.rounded === true || props.fab === true || props.fabMini === true
  )

  const isActionable = computed(() =>
    props.disable !== true && props.loading !== true
  )

  const tabIndex = computed(() => (
    isActionable.value === true ? props.tabindex || 0 : -1
  ))

  const isLink = computed(() =>
    props.type === 'a' || hasLink.value === true
  )

  const design = computed(() => {
    if (props.flat === true) return 'flat'
    if (props.outline === true) return 'outline'
    if (props.push === true) return 'push'
    if (props.unelevated === true) return 'unelevated'
    return 'standard'
  })

  const attributes = computed(() => {
    const acc = { tabindex: tabIndex.value }

    // if it's not rendered with "<a>" tag
    // OR it's "<a>" but type is not "button"
    // (<a> with type="button" is invalid HTML)
    if (props.type !== 'a' && (props.type !== 'button' || hasLink.value !== true)) {
      acc.type = props.type
    }

    if (hasLink.value === true) {
      Object.assign(acc, linkProps.value)
      acc.role = 'link'
    }
    else {
      acc.role = props.type === 'a' ? 'link' : 'button'
    }

    if (props.loading === true && props.percentage !== void 0) {
      Object.assign(acc, {
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': props.percentage
      })
    }

    if (props.disable === true) {
      acc.disabled = ''
      acc[ 'aria-disabled' ] = 'true'
    }

    return acc
  })

  const classes = computed(() => {
    let colors

    if (props.color !== void 0) {
      if (props.flat === true || props.outline === true) {
        colors = `text-${ props.textColor || props.color }`
      }
      else {
        colors = `bg-${ props.color } text-${ props.textColor || 'white' }`
      }
    }
    else if (props.textColor) {
      colors = `text-${ props.textColor }`
    }

    return `q-btn--${ design.value } `
      + `q-btn--${ props.round === true ? 'round' : `rectangle${ isRounded.value === true ? ' q-btn--rounded' : '' }` }`
      + (colors !== void 0 ? ' ' + colors : '')
      + (isActionable.value === true ? ' q-btn--actionable q-focusable q-hoverable' : (props.disable === true ? ' disabled' : ''))
      + (props.fab === true ? ' q-btn--fab' : (props.fabMini === true ? ' q-btn--fab-mini' : ''))
      + (props.noCaps === true ? ' q-btn--no-uppercase' : '')
      + (props.dense === true ? ' q-btn--dense' : '')
      + (props.stretch === true ? ' no-border-radius self-stretch' : '')
      + (props.glossy === true ? ' glossy' : '')
  })

  const innerClasses = computed(() =>
    alignClass.value + (props.stack === true ? ' column' : ' row')
    + (props.noWrap === true ? ' no-wrap text-no-wrap' : '')
    + (props.loading === true ? ' q-btn__content--hidden' : '')
  )

  return {
    classes,
    style,
    innerClasses,
    attributes,
    hasLink,
    isLink,
    navigateToLink,
    isActionable
  }
}
