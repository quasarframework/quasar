<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      color="teal"
      :max="max"
      :max-pages="5"
      boundary-numbers
    >
      <template v-slot:ellipsis="{ btnProps }">
        <q-btn v-bind="btnProps" aria-label="Go to page">
          <q-popup-edit
            v-model="current"
            title="Go to page"
            :cover="false"
            :offset="[0, 8]"
            :validate="validatePage"
            v-slot="scope"
          >
            <q-input
              v-model.number="scope.value"
              type="number"
              :min="1"
              :max="max"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-btn>
      </template>
    </q-pagination>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const max = 20
const current = ref(10)

function validatePage(page) {
  return Number.isInteger(page) && page >= 1 && page <= max
}
</script>
