<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <div>
        <div class="q-pb-sm q-gutter-sm">
          <q-badge color="teal">
            Model: {{ model1 }}
          </q-badge>
          <q-badge color="purple" text-color="white">
            Mask: hh:mm A
          </q-badge>
        </div>

        <q-time v-model="model1" mask="hh:mm A" />
      </div>

      <div>
        <div class="q-pb-sm q-gutter-sm">
          <q-badge color="teal">
            Model: {{ model2 }}
          </q-badge>
          <q-badge color="purple" text-color="white">
            Mask: HH*mm**ss
          </q-badge>
        </div>

        <q-time v-model="model2" mask="HH*mm**ss" with-seconds />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model1: ref('01:51 PM'),
      model2: ref('08*22**10')
    }
  }
}
</script>
