<template>
  <q-virtual-scroll
    style="max-height: 300px"
    :items="heavyList"
    separator
    v-slot="{ item, index }"
  >
    <q-banner
      v-if="item.banner"
      class="bg-black text-white q-py-xl"
      :key="'a' + index"
    >
      #{{ index }} - {{ item.label }}
    </q-banner>

    <q-item v-else :key="'b' + index" dense clickable>
      <q-item-section>
        <q-item-label> #{{ index }} - {{ item.label }} </q-item-label>
      </q-item-section>
    </q-item>
  </q-virtual-scroll>
</template>

<script setup>
const maxSize = 10_000
const heavyList = []

for (let i = 0; i < maxSize; i++) {
  heavyList.push({
    label: 'Option ' + (i + 1),
    banner: i % 5 === 0
  })
}
</script>
