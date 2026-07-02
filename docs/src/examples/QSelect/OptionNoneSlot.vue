<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select filled v-model="model" :options="options" label="No options">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-italic text-grey">
              No options slot
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = []
</script>
