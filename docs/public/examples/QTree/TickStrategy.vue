<template>
  <div class="q-pa-md row q-col-gutter-sm">
    <q-tree class="col-12 col-sm-6"
      :nodes="simple"
      v-model:ticked="ticked"
      v-model:expanded="expanded"
      node-key="label"
      :tick-strategy="tickStrategy"
      default-expand-all
    />
    <div class="col-12 col-sm-6">
      <q-option-group
        v-model="tickStrategy"
        :options="tickStrategies"
      />

      <div class="text-h6 q-mt-md">Ticked</div>
      <div>
        <div v-for="tick in ticked" :key="`ticked-${tick}`">
          {{ tick }}
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
      ticked: ref(['Pleasant surroundings']),
      expanded: ref(['Good service (disabled node)']),
      tickStrategy: ref('strict'),

      tickStrategies: [
        { value: 'none', label: 'None' },
        { value: 'strict', label: 'Strict' },
        { value: 'leaf', label: 'Leaf' },
        { value: 'leaf-filtered', label: 'Leaf Filtered' }
      ],

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
                { label: 'Happy atmosphere (*)' },
                { label: 'Good table presentation' },
                { label: 'Pleasing decor (*)' }
              ]
            }
          ]
        }
      ]
    }
  }
}
</script>
