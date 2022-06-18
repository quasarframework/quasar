<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-field
      filled
      :model-value="slider"
      label="Move it above 30"
      bottom-slots
      hint="Max value is 30"
      :error="!isValid"
    >
      <template v-slot:control>
        <q-slider v-model="slider" :min="0" :max="100" label label-always class="q-mt-lg" style="width: 200px" />
      </template>
      <template v-slot:error>
        Please use a maximum value of 30.
      </template>
    </q-field>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup () {
    const slider = ref(10)

    return {
      slider,
      isValid: computed(() => slider.value <= 30)
    }
  }
}
</script>
