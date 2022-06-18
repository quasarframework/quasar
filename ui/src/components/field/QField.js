import useField, { useFieldState, useFieldProps, useFieldEmits } from '../../composables/private/use-field.js'

import { createComponent } from '../../utils/private/create.js'

export default createComponent({
  name: 'QField',

  inheritAttrs: false,

  props: useFieldProps,

  emits: useFieldEmits,

  setup () {
    return useField(useFieldState())
  }
})
