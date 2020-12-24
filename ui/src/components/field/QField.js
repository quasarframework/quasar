import { defineComponent } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useField, { useFieldState, useFieldProps, useFieldEmits } from '../../composables/private/use-field.js'

export default defineComponent({
  name: 'QField',

  inheritAttrs: false,

  props: useFieldProps,

  emits: useFieldEmits,

  setup (props, { slots, emit, attrs }) {
    const $q = useQuasar()
    const state = useFieldState(props, attrs, $q)

    return useField({ props, slots, emit, attrs, $q, state })
  }
})
