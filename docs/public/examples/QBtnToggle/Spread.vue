<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-btn-toggle
        v-model="model"
        spread
        no-caps
        toggle-color="purple"
        color="white"
        text-color="black"
        :options="[
          {label: 'Option 1', value: 'one'},
          {label: 'Option 2', value: 'two'}
        ]"
      />

      <q-btn-toggle
        v-model="secondModel"
        spread
        class="my-custom-toggle"
        no-caps
        rounded
        unelevated
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
          {label: 'Option 1', value: 'one'},
          {label: 'Option 2', value: 'two'}
        ]"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref('one'),
      secondModel: ref('one')
    }
  }
}
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
