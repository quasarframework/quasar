<template>
  <div class="q-pa-md row q-col-gutter-sm">
    <q-tree class="col-12 col-sm-6"
      :nodes="simple"
      node-key="label"
      tick-strategy="leaf"
      v-model:selected="selected"
      v-model:ticked="ticked"
      v-model:expanded="expanded"
    />
    <div class="col-12 col-sm-6 q-gutter-sm">
      <div class="text-h6">Selected</div>
      <div>{{ selected }}</div>

      <q-separator spaced />

      <div class="text-h6">Ticked</div>
      <div>
        <div v-for="tick in ticked" :key="`ticked-${tick}`">
          {{ tick }}
        </div>
      </div>

      <q-separator spaced />

      <div class="text-h6">Expanded</div>
      <div>
        <div v-for="expand in expanded" :key="`expanded-${expand}`">
          {{ expand }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      selected: ref('Pleasant surroundings'),
      ticked: ref([ 'Quality ingredients', 'Good table presentation' ]),
      expanded: ref([ 'Satisfied customers', 'Good service (disabled node)', 'Pleasant surroundings' ]),

      simple: [
        {
          label: 'Satisfied customers',
          children: [
            {
              label: 'Good food',
              children: [
                { label: 'Quality ingredients' },
                { label: 'Good recipe' }
              ]
            },
            {
              label: 'Good service (disabled node)',
              disabled: true,
              children: [
                { label: 'Prompt attention' },
                { label: 'Professional waiter' }
              ]
            },
            {
              label: 'Pleasant surroundings',
              children: [
                { label: 'Happy atmosphere' },
                { label: 'Good table presentation' },
                { label: 'Pleasing decor' }
              ]
            }
          ]
        }
      ]
    }
  }
}
</script>
