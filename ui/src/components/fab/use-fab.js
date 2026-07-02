import { computed } from 'vue'

const labelPositions = ['top', 'right', 'bottom', 'left']

export const useFabProps = {
  /**
   * Define the button HTML DOM type
   *
   * @api prop type
   * @type {String}
   * @default 'a'
   * @category general
   * @value 'a'
   * @value 'submit'
   * @value 'button'
   * @value 'reset'
   */
  type: {
    type: String,
    default: 'a'
  },

  /**
   * Use 'outline' design for Fab button
   *
   * @api prop outline
   * @type {Boolean}
   * @category style
   */
  outline: Boolean,

  /**
   * Use 'push' design for Fab button
   *
   * @api prop push
   * @type {Boolean}
   * @category style
   */
  push: Boolean,

  /**
   * Use 'flat' design for Fab button
   *
   * @api prop flat
   * @type {Boolean}
   * @category style
   */
  flat: Boolean,

  /**
   * Remove shadow
   *
   * @api prop unelevated
   * @type {Boolean}
   * @category style
   */
  unelevated: Boolean,

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
   * Apply the glossy effect over the button
   *
   * @api prop glossy
   * @type {Boolean}
   * @category style
   */
  glossy: Boolean,

  /**
   * Apply a rectangle aspect to the FAB
   *
   * @api prop square
   * @type {Boolean}
   * @category style
   */
  square: Boolean,

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
   */
  padding: String,

  /**
   * The label that will be shown when Fab is extended
   *
   * @api prop label
   * @type {String|Number}
   * @default ''
   * @category content
   * @example 'Button Label'
   */
  label: {
    type: [String, Number],
    default: ''
  },

  /**
   * Position of the label around the icon
   *
   * @api prop label-position
   * @type {String}
   * @default 'right'
   * @category style|content
   * @value 'top'
   * @value 'right'
   * @value 'bottom'
   * @value 'left'
   */
  labelPosition: {
    type: String,
    default: 'right',
    validator: v => labelPositions.includes(v)
  },

  /**
   * Display label besides the FABs, as external content
   *
   * @api prop external-label
   * @type {Boolean}
   * @category style|content
   */
  externalLabel: Boolean,

  /**
   * Hide the label; Useful for animation purposes where you toggle the visibility of the label
   *
   * @api prop hide-label
   * @type {Boolean|null}
   * @category style|content
   */
  hideLabel: {
    type: Boolean
  },

  /**
   * Class definitions to be attributed to the label container
   *
   * @api prop label-class
   * @type {String|Array|Object}
   * @ts-type VueClassProp
   * @category style
   * @example 'my-special-class'
   * @example { 'my-special-class': true }
   */
  labelClass: [Array, String, Object],

  /**
   * Style definitions to be attributed to the label container
   *
   * @api prop label-style
   * @type {String|Array|Object}
   * @ts-type VueStyleProp
   * @category style
   * @example 'background-color: #ff0000'
   * @example { backgroundColor: '#ff0000' }
   */
  labelStyle: [Array, String, Object],

  /**
   * Put component in disabled mode
   *
   * @api prop disable
   * @extends disable
   */
  disable: Boolean,

  /**
   * Tabindex HTML attribute value
   *
   * @api prop tabindex
   * @extends tabindex
   */
  tabindex: [Number, String]
}

export default function useFab(props, showing) {
  return {
    formClass: computed(
      () => `q-fab--form-${props.square ? 'square' : 'rounded'}`
    ),

    stacked: computed(
      () =>
        !props.externalLabel && ['top', 'bottom'].includes(props.labelPosition)
    ),

    labelProps: computed(() => {
      if (props.externalLabel) {
        const hideLabel =
          props.hideLabel === null ? !showing.value : props.hideLabel

        return {
          action: 'push',
          data: {
            class: [
              props.labelClass,
              'q-fab__label q-tooltip--style q-fab__label--external' +
                ` q-fab__label--external-${props.labelPosition}` +
                (hideLabel ? ' q-fab__label--external-hidden' : '')
            ],
            style: props.labelStyle
          }
        }
      }

      return {
        action: ['left', 'top'].includes(props.labelPosition)
          ? 'unshift'
          : 'push',
        data: {
          class: [
            props.labelClass,
            `q-fab__label q-fab__label--internal q-fab__label--internal-${props.labelPosition}` +
              (props.hideLabel ? ' q-fab__label--internal-hidden' : '')
          ],
          style: props.labelStyle
        }
      }
    })
  }
}
