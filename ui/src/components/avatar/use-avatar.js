import { computed, h } from 'vue'

import QIcon from '../icon/QIcon.js'

import useSize, {
  useSizeProps
} from '../../composables/private.use-size/use-size.js'

export const useAvatarProps = {
  ...useSizeProps,

  /**
   * The size in CSS units, including unit name, of the content (icon, text)
   *
   * @api prop font-size
   * @type {String}
   * @category style
   * @example '18px'
   * @example '2rem'
   */
  fontSize: String,

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
   * Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix
   *
   * @api prop icon
   * @extends icon
   */
  icon: String,

  /**
   * Removes border-radius so borders are squared
   *
   * @api prop square
   * @extends square
   */
  square: Boolean,

  /**
   * Applies a small standard border-radius for a squared shape of the component
   *
   * @api prop rounded
   * @extends rounded
   */
  rounded: Boolean
}

export default function useAvatar(props) {
  const sizeStyle = useSize(props)

  const classes = computed(
    () =>
      'q-avatar' +
      (props.color ? ` bg-${props.color}` : '') +
      (props.textColor ? ` text-${props.textColor} q-chip--colored` : '') +
      (props.square
        ? ' q-avatar--square'
        : props.rounded
          ? ' rounded-borders'
          : '')
  )

  const contentStyle = computed(() =>
    props.fontSize ? { fontSize: props.fontSize } : null
  )

  const getIcon = () =>
    props.icon !== void 0 ? [h(QIcon, { name: props.icon })] : void 0

  return {
    classes,
    sizeStyle,
    contentStyle,
    getIcon
  }
}
