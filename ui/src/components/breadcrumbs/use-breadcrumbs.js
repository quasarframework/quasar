import { computed } from 'vue'

import useAlign, {
  useAlignProps
} from '../../composables/private.use-align/use-align.js'

export const useBreadcrumbsProps = {
  ...useAlignProps,

  /**
   * The string used to separate the breadcrumbs
   *
   * @api prop separator
   * @type {String}
   * @default '/'
   * @category content
   * @optional
   * @example '-'
   * @example '|'
   * @example '>'
   */
  separator: {
    type: String,
    default: '/'
  },

  /**
   * The color used to color the separator, which can be any color from the Quasar Color Palette
   *
   * @api prop separator-color
   * @type {String}
   * @ts-type NamedColor
   * @category style
   * @example 'primary'
   * @example 'teal'
   * @example 'teal-10'
   */
  separatorColor: String,

  /**
   * The color of the active breadcrumb, which can be any color from the Quasar Color Palette
   *
   * @api prop active-color
   * @type {String}
   * @ts-type NamedColor
   * @default 'primary'
   * @category style
   * @optional
   * @example 'primary'
   * @example 'teal'
   * @example 'teal-10'
   */
  activeColor: {
    type: String,
    default: 'primary'
  },

  /**
   * The gutter value allows you control over the space between the breadcrumb elements.
   *
   * @api prop gutter
   * @type {String}
   * @default 'sm'
   * @category content
   * @optional
   * @value 'none'
   * @value 'xs'
   * @value 'sm'
   * @value 'md'
   * @value 'lg'
   * @value 'xl'
   */
  gutter: {
    type: String,
    validator: v => ['none', 'xs', 'sm', 'md', 'lg', 'xl'].includes(v),
    default: 'sm'
  }
}

export default function useBreadcrumbs(props) {
  const alignClass = useAlign(props)

  const classes = computed(
    () =>
      `flex items-center ${alignClass.value}${props.gutter === 'none' ? '' : ` q-gutter-${props.gutter}`}`
  )

  const sepClass = computed(() =>
    props.separatorColor ? ` text-${props.separatorColor}` : ''
  )
  const activeClass = computed(() => ` text-${props.activeColor}`)

  return {
    classes,
    sepClass,
    activeClass
  }
}
