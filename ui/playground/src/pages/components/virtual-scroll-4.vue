<template>
  <q-layout view="lHh LpR fFf">
    <q-page-container>
      <q-page padding class="bg-white q-pr-xl">
        <div class="bg-grey-2" style="height: 60vh">Spacer</div>

        <div>List index: {{ virtualListIndex1 }}</div>
        <div
          class="scroll"
          style="max-height: 80vh"
          ref="virtualScrollTargetRef"
        >
          <div
            class="text-h6 q-my-lg q-pa-lg bg-grey-10 text-white"
            style="height: 500px"
          >
            Before list
          </div>
          <q-virtual-scroll
            component="q-list"
            :items="heavyList"
            separator
            :scroll-target="scrollTarget"
            @virtual-scroll="onVirtualScroll1"
          >
            <template v-slot="{ item, index }">
              <q-item :key="'a' + index" v-if="index % 3 === 0" clickable>
                <q-item-section>
                  <q-item-label class="q-px-xl">
                    Option - {{ item.label }} #{{ index }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-banner
                :key="'b' + index"
                v-else-if="index % 5 === 0"
                class="bg-negative"
              >
                <template v-slot:avatar>
                  <q-avatar square color="warning" text-color="negative">
                    {{ item.value }}
                  </q-avatar>
                </template>
                {{ item.label }} #{{ index }}
              </q-banner>

              <div
                :key="'c' + index"
                v-else
                class="bg-yellow q-py-lg text-center scroll"
                style="max-height: 100px"
              >
                {{ item.label }} #{{ index }}
              </div>
            </template>
          </q-virtual-scroll>
          <div
            class="text-h6 q-my-lg q-pa-lg bg-grey-10 text-white"
            style="height: 800px"
          >
            After list
          </div>
        </div>

        <div class="q-pa-md">
          <div class="q-pa-md">
            <q-input
              type="number"
              :model-value="virtualListIndex2"
              :min="0"
              :max="99999"
              label="Scroll to index"
              input-class="text-right"
              @update:model-value="onIndexChange"
            />
          </div>

          <q-virtual-scroll
            ref="virtualListRef"
            class="q-my-md"
            style="max-height: 300px"
            component="q-list"
            :items="heavyList"
            separator
            @virtual-scroll="onVirtualScroll2"
          >
            <template v-slot="{ item, index }">
              <q-item
                :key="index"
                dense
                :class="{
                  'bg-black text-white': index === virtualListIndex2,
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
    // deterministic: server-rendered, hydration must match
    value: 1 + ((i * 37) % 99)
  })
}

Object.freeze(heavyList)

const scrollTarget = ref(void 0)
const virtualListIndex1 = ref(0)
const virtualListIndex2 = ref(1200)

const virtualScrollTargetRef = ref(null)
const virtualListRef = ref(null)

onMounted(() => {
  scrollTarget.value = virtualScrollTargetRef.value
  virtualListRef.value.scrollTo(virtualListIndex2.value)
})

function onIndexChange(index) {
  virtualListRef.value.scrollTo(index)
}

function onVirtualScroll1({ index }) {
  virtualListIndex1.value = index
}

function onVirtualScroll2({ index }) {
  virtualListIndex2.value = index
}
</script>
