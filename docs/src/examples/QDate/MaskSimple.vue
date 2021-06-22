<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <div>
        <div class="q-pb-sm q-gutter-sm">
          <q-badge color="teal">
            Model: {{ model1 }}
          </q-badge>
          <q-badge color="purple" text-color="white">
            Mask: YYYY-MM-DD
          </q-badge>
        </div>

        <q-date v-model="model1" mask="YYYY-MM-DD" />
      </div>

      <div>
        <div class="q-pb-sm q-gutter-sm">
          <q-badge color="teal">
            Model: {{ model2 }}
          </q-badge>
          <q-badge color="purple" text-color="white">
            Mask: MM-DD-YYYY
          </q-badge>
        </div>

        <q-date v-model="model2" mask="MM-DD-YYYY" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model1: ref('2019-02-15'),
      model2: ref('03-21-2019')
    }
  }
}
</script>
