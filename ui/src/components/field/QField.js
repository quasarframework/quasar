import useField, {
  useFieldEmits,
  useFieldProps,
  useFieldState
} from '../../composables/private.use-field/use-field.js'

import { createComponent } from '../../utils/private.create/create.js'

export default /*#__PURE__*/ createComponent({
  name: 'QField',

  inheritAttrs: false,

  props: {
    ...useFieldProps,

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
