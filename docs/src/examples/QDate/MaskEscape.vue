<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <div>
        <div class="q-pb-sm">
          <q-badge color="teal">
            Model: {{ model1 }}
          </q-badge>
        </div>
        <div class="q-pb-sm">
          <q-badge color="purple" text-color="white">
            Mask: dddd, MMM D, YYYY
          </q-badge>
        </div>

        <q-date v-model="model1" mask="dddd, MMM D, YYYY" />
      </div>

      <div>
        <div class="q-pb-sm">
          <q-badge color="teal">
            Model: {{ model2 }}
          </q-badge>
        </div>
        <div class="q-pb-sm">
          <q-badge color="purple" text-color="white">
            Mask: [Month ( ]MMMM ) Do[, Year ( ]YYYY )
          </q-badge>
        </div>

        <q-date v-model="model2" mask="[Month ( ]MMMM ) Do[, Year ( ]YYYY )" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model1: ref('Sunday, Apr 28, 2019'),
      model2: ref('Month ( March ) 14th, Year ( 2019 )')
    }
  }
}
</script>
