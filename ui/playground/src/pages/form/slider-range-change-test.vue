<template>
  <div class="q-layout-padding">
    <div>
      {{ modelXSimple }}
    </div>
    <q-slider
      v-model="modelXSimple"
      :min="0"
      :max="50"
      label
      @update:model-value="onXInput"
      @change="onXChange"
    />
    <q-slider
      :model-value="modelXSimple"
      :min="0"
      :max="50"
      label
      @change="
        val => {
          modelXSimple = val
          onXChange(val)
        }
      "
    />
    <q-slider
      v-model="modelXSimple"
      :min="0"
      :max="50"
      label
      @change="onXChange"
    />
    <div>
      {{ modelX }}
    </div>
    <q-range
      v-model="modelX"
      :min="0"
      :max="50"
      label
      @update:model-value="onXInput"
      @change="onXChange"
    />
    <q-range
      :model-value="modelX"
      :min="0"
      :max="50"
      label
      @change="
        val => {
          modelX = val
          onXChange(val)
        }
      "
    />
    <q-range v-model="modelX" :min="0" :max="50" label @change="onXChange" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()

const modelX = ref({
  min: 5,
  max: 25
})

const modelXSimple = ref(5)

function onXInput(val) {
  console.log('@update:model-value', val)
}

function onXChange(val) {
  console.log('@change', val)
  $q.notify('@change ' + JSON.stringify(val))
}
</script>
