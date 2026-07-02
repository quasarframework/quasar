<template>
  <q-virtual-scroll
    :items="heavyList"
    virtual-scroll-horizontal
    v-slot="{ item, index }"
  >
    <div :key="index" :class="item.class">
      #{{ index }} - {{ item.label }}
    </div>
  </q-virtual-scroll>
</template>

<script setup>
const maxSize = 10_000
const heavyList = []

for (let i = 0; i < maxSize; i++) {
  heavyList.push({
    label: 'Option ' + (i + 1),
    class:
      i % 2 === 0
        ? 'q-pa-md self-center bg-grey-2 text-black'
        : 'q-pa-lg bg-black text-white'
  })
}
</script>
