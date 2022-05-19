import { watch } from 'vue'

// VTU won't accept reactive v-model binding, this adapter manually
// set the model prop each time a new value is emitted
// See https://github.com/vuejs/test-utils/discussions/279

// See https://github.com/vuejs/test-utils/issues/871
export function vModelAdapter (modelRef, modelName = 'modelValue') {
  watch(modelRef, (value) => Cypress.vueWrapper.setProps({ [ modelName ]: value }))

  return {
    [ modelName ]: modelRef.value,
    [ `onUpdate:${ modelName }` ]: (emittedValue) => {
      modelRef.value = emittedValue
    }
  }
}
