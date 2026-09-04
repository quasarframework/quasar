<template>
  <div class="q-pa-md row q-col-gutter-sm">
    <q-tree
      ref="treeRef"
      class="col-12 col-sm-6"
      :nodes="simple"
      v-model:ticked="ticked"
      node-key="label"
      tick-strategy="leaf"
      default-expand-all
    >
      <template v-slot:default-header="prop">
        {{ prop.node.label }}
        <q-badge
          v-if="prop.indeterminate"
          class="q-ml-sm"
          color="orange"
          label="partial"
        />
      </template>
    </q-tree>

    <div class="col-12 col-sm-6">
      <div class="text-h6">Ticked</div>
      <div v-for="label in ticked" :key="`ticked-${label}`">
        {{ label }}
      </div>

      <div class="text-h6 q-mt-md">Partially ticked</div>
      <div v-for="node in indeterminate" :key="`indeterminate-${node.label}`">
        {{ node.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, useTemplateRef, watch } from 'vue'

const treeRef = useTemplateRef('treeRef')
const ticked = ref(['Good recipe'])
const indeterminate = ref([])

function refreshIndeterminate() {
  indeterminate.value = treeRef.value.getIndeterminateNodes()
}

onMounted(refreshIndeterminate)

// 'post' so that the QTree has already taken the new "ticked" value in
watch(ticked, refreshIndeterminate, { flush: 'post' })

const simple = [
  {
    label: 'Satisfied customers',
    children: [
      {
        label: 'Good food',
        children: [{ label: 'Quality ingredients' }, { label: 'Good recipe' }]
      },
      {
        label: 'Pleasant surroundings',
        children: [
          { label: 'Happy atmosphere' },
          { label: 'Good table presentation' }
        ]
      }
    ]
  }
]
</script>
