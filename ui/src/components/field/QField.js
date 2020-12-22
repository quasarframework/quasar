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
    const state = useFieldState(props, attrs)

    // const hasValue = computed(() => {
    //   const value = state.getControl === void 0
    //     ? props.modelValue
    //     : state.innerValue.value

    //   return value !== void 0 &&
    //     value !== null &&
    //     ('' + value).length > 0
    // })

    // floatingLabel
    // this.$data.inputValue !== void 0 && this.hideSelected === true
    //     ? this.inputValue.length > 0
    //     : hasValue.value === true
    // ) ||
    // (
    //   this.$props.hasOwnProperty('displayValue') === true &&
    //   this.displayValue !== void 0 &&
    //   this.displayValue !== null &&
    //   ('' + this.displayValue).length > 0
    // )
    return useField({ props, slots, emit, attrs, $q, state })
  }
})
