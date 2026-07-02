import { useCheckboxProps } from '../checkbox/use-checkbox.js'

export { useCheckboxEmits as useToggleEmits } from '../checkbox/use-checkbox.js'

export const useToggleProps = {
  ...useCheckboxProps,

  /**
   * The icon to be used when the toggle is on
   *
   * @api prop checked-icon
   * @type {String}
   * @category icons
   * @example 'visibility'
   */
  checkedIcon: useCheckboxProps.checkedIcon,

  /**
   * The icon to be used when the toggle is off
   *
   * @api prop unchecked-icon
   * @type {String}
   * @category icons
   * @example 'visibility_off'
   */
  uncheckedIcon: useCheckboxProps.uncheckedIcon,

  /**
   * The icon to be used when the model is indeterminate
   *
   * @api prop indeterminate-icon
   * @type {String}
   * @category icons
   * @example 'help'
   */
  indeterminateIcon: useCheckboxProps.indeterminateIcon,

  /**
   * Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)
   *
   * @api prop icon
   * @type {String}
   * @category content
   * @example 'map'
   * @example 'ion-add'
   * @example 'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'
   * @example 'img:path/to/some_image.png'
   */
  icon: String,

  /**
   * Override default icon color (for truthy state only); Color name for component from the Quasar Color Palette
   *
   * @api prop icon-color
   * @type {String}
   * @ts-type NamedColor
   * @category style
   * @example 'primary'
   * @example 'teal'
   * @example 'teal-10'
   */
  iconColor: String
}
