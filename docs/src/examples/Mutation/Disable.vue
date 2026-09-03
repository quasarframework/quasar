<template>
  <div class="q-pa-md">
    <div class="row no-wrap items-center q-gutter-md">
      <q-btn
        label="Add row"
        color="primary"
        @click="addRow"
        :disable="listItems.length >= 7"
      />
      <q-btn
        label="Remove row"
        color="accent"
        @click="removeRow"
        :disable="listItems.length === 0"
      />
      <q-toggle v-model="enabled" label="Observe" dense />
    </div>

    <div class="row no-wrap q-col-gutter-md">
      <div v-mutation="enabled ? handler : false" class="col-4">
        <q-list
          v-if="listItems.length > 0"
          bordered
          separator
          class="q-mt-md rounded-borders"
        >
          <q-item v-for="item in listItems" :key="item">
            <q-item-section>
              {{ item }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-8">
        <q-card bordered flat class="q-mt-md">
          <q-card-section>
            Mutations caught: {{ mutationCount }}
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const enabled = ref(true)
const listItems = ref([])
const mutationCount = ref(0)

function handler(mutationRecords) {
  mutationCount.value += mutationRecords.length
}

function addRow() {
  listItems.value.push(`List item #${listItems.value.length + 1}`)
}

function removeRow() {
  listItems.value.pop()
}
</script>
