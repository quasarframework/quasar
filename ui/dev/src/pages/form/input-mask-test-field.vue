<template>
  <div>
    <q-input
      mask="###########################"
      :model-value="modelValue"
      @update:model-value="update"
    />
    <q-btn @click="click">Increment</q-btn>
    <div class="q-mt-md">
      {{ modelValue }}
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {}
  },
  setup (props, { emit }) {
    return {
      click () {
        emit('update:model-value', Number(props.modelValue) + 1)
      },
      update (value) {
        emit('update:model-value', Number(value))
      }
    }
  }
})
</script>
