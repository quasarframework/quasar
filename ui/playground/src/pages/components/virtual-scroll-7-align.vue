<template>
  <q-layout view="lHh LpR fFf">
    <q-page-container>
      <q-page padding class="q-pr-xl">
        <div class="q-pa-md">
          <div class="q-pa-md row q-gutter-sm items-center">
            <q-input
              style="min-width: 10em"
              type="number"
              :model-value="virtualListIndex"
              :min="0"
              :max="99999"
              label="Scroll to index"
              input-class="text-right"
              @update:model-value="onIndexChange"
            />

            <q-option-group
              type="radio"
              v-model="alignMode"
              :options="alignModes"
              inline
            />
          </div>

          <q-virtual-scroll
            ref="virtualListRef"
            class="q-my-md"
            style="max-height: 60vh"
            component="q-list"
            :items="heavyList"
            separator
            @virtual-scroll="onVirtualScroll"
          >
            <template v-slot="{ item, index }">
              <q-item
                :key="index"
                dense
                :class="{
                  'bg-grey-8 text-white': index === virtualListIndex,
                  'q-py-xl': index % 4 === 0
                }"
                :style="index === 99999 ? 'height: 800px' : void 0"
              >
                <q-item-section>
                  <q-item-label> #{{ index }} - {{ item.label }} </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-virtual-scroll>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const heavyList = []

for (let i = 0; i < 100_000; i++) {
  heavyList.push({
    label: 'Option ' + (i + 1),
    html: 'Option <em class="text-h6">' + (i + 1) + '</em>',
    value: Math.trunc(1 + Math.random() * 99)
  })
}

Object.freeze(heavyList)

const virtualListIndex = ref(1200)
const alignMode = ref(void 0)
const alignModes = ref(
  [
    'auto',
    'start',
    'center',
    'end',
    'start-force',
    'center-force',
    'end-force'
  ].map(label => ({ label, value: label === 'auto' ? void 0 : label }))
)

const virtualListRef = ref(null)

onMounted(() => {
  virtualListRef.value.scrollTo(virtualListIndex.value)
})

function onIndexChange(index) {
  virtualListRef.value.scrollTo(index, alignMode.value)
}

function onVirtualScroll({ index }) {
  virtualListIndex.value = index
}
</script>
