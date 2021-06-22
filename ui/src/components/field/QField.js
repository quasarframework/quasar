import { defineComponent } from 'vue'

import useField, { useFieldState, useFieldProps, useFieldEmits } from '../../composables/private/use-field.js'

export default defineComponent({
  name: 'QField',

  inheritAttrs: false,

  props: useFieldProps,

  emits: useFieldEmits,

  setup () {
    return useField(useFieldState())
  }
})
