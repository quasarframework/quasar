<template>
  <div class="q-pa-md">
    <q-input v-model="filter" filled dense label="Filter" class="q-mb-md" />

    <q-tree
      :nodes="nodes"
      node-key="id"
      tick-strategy="leaf"
      default-expand-all
      virtual-scroll
      :filter="filter"
      style="height: 300px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const filter = ref('')

function buildNode(label, level) {
  const node = { id: label, label: `Node ${label}` }

  if (level < 4) {
    node.children = []
    for (let i = 1; i <= 8; i++) {
      node.children.push(buildNode(`${label}.${i}`, level + 1))
    }
  }

  return node
}

// 4,680 nodes
const nodes = []
for (let i = 1; i <= 8; i++) {
  nodes.push(buildNode(`${i}`, 1))
}
</script>
