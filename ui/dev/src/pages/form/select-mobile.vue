<template>
  <div class="q-layout-padding" style="width: 100vw; height: 100vh;">
    <q-bar class="desktop-only bg-negative text-white">
      Please check in mobile view.
    </q-bar>
    <q-select
      v-model="model"
      :options="options"
      label="Example Selector"
      multiple
      clearable
      fullscreen
      @clear="onClear"
      @update:modelValue="onUpdateModelValue"
    />
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'PageIndex',
  setup () {
    const model = ref([])
    const options = [ 1, 2, 3, 4, 5 ]

    watch(model, val => {
      console.log(`Model changed: ${ model.value }`)
    })

    function onClear (val) {
      console.log(`onClear: ${ val }`)
    }

    function onUpdateModelValue (val) {
      console.log(`onUpdateModelValue: ${ val }`)
    }

    return {
      model,
      options,
      onClear,
      onUpdateModelValue
    }
  }
})
</script>
