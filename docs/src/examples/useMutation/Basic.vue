<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm q-mb-md">
      <q-btn color="primary" push label="Add item" @click="addItem" />
      <q-btn
        color="negative"
        push
        label="Remove last"
        :disable="items.length === 0"
        @click="removeItem"
      />
      <q-btn
        color="secondary"
        push
        label="Rename first"
        :disable="items.length === 0"
        @click="renameItem"
      />
      <q-toggle v-model="paused" label="Paused" />
    </div>

    <q-list ref="listRef" bordered separator class="q-mb-md">
      <q-item v-for="item in items" :key="item.id">
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
      <q-item v-if="items.length === 0">
        <q-item-section class="text-grey">Empty list</q-item-section>
      </q-item>
    </q-list>

    <div class="q-gutter-sm">
      <q-badge :label="`batches: ${batches}`" />
      <q-badge color="secondary" :label="`last batch: ${lastBatch}`" />
      <q-badge
        color="accent"
        :label="`records in it: ${mutationRecords.length}`"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { useMutation } from 'quasar'

const listRef = useTemplateRef('listRef') // a component: its root gets observed

const items = ref([])
const paused = ref(false)
const batches = ref(0)
const lastBatch = ref('none')

let nextId = 1

const { mutationRecords } = useMutation(() => ({
  target: listRef,
  childList: true,
  characterData: true,
  subtree: true,
  disabled: paused.value,
  onMutation(records) {
    batches.value++
    lastBatch.value = records
      .map(record => record.type)
      .filter((type, index, list) => list.indexOf(type) === index)
      .join(', ')
  }
}))

function addItem() {
  items.value.push({ id: nextId, label: `Item ${nextId}` })
  nextId++
}

function removeItem() {
  items.value.pop()
}

function renameItem() {
  items.value[0].label += ' (renamed)'
}
</script>
