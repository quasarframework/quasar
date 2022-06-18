<template>
  <div class="q-pa-md q-gutter-md">
    <div>
      <q-btn-toggle
        v-model="model"
        push
        glossy
        toggle-color="primary"
        :options="[
          {label: 'One', value: 'one'},
          {label: 'Two', value: 'two'},
          {label: 'Three', value: 'three'}
        ]"
      />
    </div>

    <div>
      <q-btn-toggle
        v-model="model"
        toggle-color="primary"
        flat
        :options="[
          {label: 'One', value: 'one'},
          {label: 'Two', value: 'two'},
          {label: 'Three', value: 'three'}
        ]"
      />
    </div>

    <div>
      <q-btn-toggle
        v-model="model"
        color="brown"
        text-color="white"
        toggle-color="orange"
        toggle-text-color="black"
        rounded
        unelevated
        glossy
        :options="[
          {label: 'One', value: 'one'},
          {label: 'Two', value: 'two'},
          {label: 'Three', value: 'three'},
          {label: 'Four', value: 'four'}
        ]"
      />
    </div>

    <div>
      <q-btn-toggle
        v-model="model"
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
      model: ref('one')
    }
  }
}
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
