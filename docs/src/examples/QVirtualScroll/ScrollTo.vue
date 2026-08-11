<template>
  <div>
    <div class="q-pa-md row justify-center">
      <q-input
        style="min-width: 10em"
        type="number"
        v-model.number="virtualListIndex"
        :min="0"
        :max="9999"
        label="Scroll to index"
        input-class="text-right"
        outlined
      />
      <q-btn
        class="q-ml-sm"
        label="Go"
        no-caps
        color="primary"
        @click="executeScroll"
      />
    </div>

    <q-separator />

    <q-virtual-scroll
      ref="virtualListRef"
      style="max-height: 300px"
      component="q-list"
      :items="heavyList"
      separator
      @virtual-scroll="onVirtualScroll"
      v-slot="{ item, index }"
    >
      <q-item
        :key="index"
        dense
        :class="{ 'bg-black text-white': index === virtualListIndex }"
      >
        <q-item-section>
          <q-item-label> #{{ index }} - {{ item.label }} </q-item-label>
        </q-item-section>
      </q-item>
    </q-virtual-scroll>
  </div>
</template>

<script setup>
import { onMounted, ref, useTemplateRef } from 'vue'

const maxSize = 10_000
const heavyList = []

for (let i = 0; i < maxSize; i++) {
  heavyList.push({
    label: 'Option ' + (i + 1)
  })
}

const virtualListRef = useTemplateRef('virtualListRef')
const virtualListIndex = ref(1200)

onMounted(() => {
  virtualListRef.value.scrollTo(virtualListIndex.value)
})

function onVirtualScroll({ index }) {
  virtualListIndex.value = index
}

function executeScroll() {
  virtualListRef.value.scrollTo(virtualListIndex.value, 'start-force')
}
</script>
