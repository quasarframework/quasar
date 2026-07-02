import { computed } from 'vue'

export const useSizeDefaults = {
  xs: 18,
  sm: 24,
  md: 32,
  lg: 38,
  xl: 46
}

export const useSizeProps = {
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
  size: String
}

export default function useSize(props, sizes = useSizeDefaults) {
  // return sizeStyle
  return computed(() =>
    props.size !== void 0
      ? {
          fontSize: props.size in sizes ? `${sizes[props.size]}px` : props.size
        }
      : null
  )
}
