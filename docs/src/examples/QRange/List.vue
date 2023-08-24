<template>
  <div class="q-pa-md">
    <q-list dense>
      <q-item>
        <q-item-section avatar>
          <q-icon name="local_atm" />
        </q-item-section>
        <q-item-section>
          <q-range
            v-model="model"
            :min="0"
            :max="50"
            label
          />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section avatar>
          <q-icon name="euro_symbol" />
        </q-item-section>
        <q-item-section>
          <q-range
            v-model="model"
            :min="0"
            :max="50"
            label
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref({
        min: 10,
        max: 35
      })
    }
  }
}
</script>
