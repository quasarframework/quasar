import useField, {
  useFieldEmits,
  useFieldProps,
  useFieldState
} from '../../composables/private.use-field/use-field.js'

import { createComponent } from '../../utils/private.create/create.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/field
 */
/**
 * Field main content
 *
 * @api slot default
 */

/**
 * Prepend inner field; Suggestions: QIcon, QBtn
 *
 * @api slot prepend
 */

/**
 * Append to inner field; Suggestions: QIcon, QBtn
 *
 * @api slot append
 */

/**
 * Prepend outer field; Suggestions: QIcon, QBtn
 *
 * @api slot before
 */

/**
 * Append outer field; Suggestions: QIcon, QBtn
 *
 * @api slot after
 */

/**
 * Slot for label; Used only if 'label-slot' prop is set or the 'label' prop is set; When it is used the text in the 'label' prop is ignored
 *
 * @api slot label
 */

/**
 * Slot for errors; Enabled only if 'bottom-slots' prop is used; Suggestion: <div>
 *
 * @api slot error
 */

/**
 * Slot for hint text; Enabled only if 'bottom-slots' prop is used; Suggestion: <div>
 *
 * @api slot hint
 */

/**
 * Slot for counter text; Enabled only if 'bottom-slots' prop is used; Suggestion: <div>
 *
 * @api slot counter
 */

/**
 * Override default spinner when component is in loading mode; Use in conjunction with 'loading' prop
 *
 * @api slot loading
 */

/**
 * Slot for controls; Suggestion QSlider, QRange, QKnob, ...
 *
 * @api slot control
 * @scope id {String} Element id used in the 'for' attribute of the field label. Can be used to link the control to the label
 * @scope field {Element} DOM element of the field
 * @scope editable {Boolean} Field is editable
 * @scope focused {Boolean} Field has focus
 * @scope floatingLabel {Boolean} Field's label is floating
 * @scope modelValue {Any} Field's value
 * @scope emitValue {Function} Function that emits an @input event in the context of the field
 */
export default createComponent({
  name: 'QField',

  inheritAttrs: false,

  props: {
    ...useFieldProps,

    /**
     * @api prop tag
     * @extends tag
     * @default 'label'
     * @added-in v2.13.1
     * @example 'div'
     * @example 'label'
     */
    tag: {
      type: String,
      default: 'label'
    }
  },

  emits: useFieldEmits,

  setup() {
    return useField(useFieldState({ tagProp: true }))
  }
})
