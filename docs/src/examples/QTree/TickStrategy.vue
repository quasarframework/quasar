<template>
  <div class="q-pa-md row q-col-gutter-sm">
    <q-tree class="col-12 col-sm-6"
      :nodes="simple"
      node-key="label"
      :tick-strategy="tickStrategy"
      :ticked.sync="ticked"
      :expanded.sync="expanded"
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
export default {
  data () {
    return {
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
      ],

      ticked: [ 'Pleasant surroundings' ],
      expanded: [ 'Good service (disabled node)' ],
      tickStrategy: 'strict',
      tickStrategies: [
        { value: 'none', label: 'None' },
        { value: 'strict', label: 'Strict' },
        { value: 'leaf', label: 'Leaf' },
        { value: 'leaf-filtered', label: 'Leaf Filtered' }
      ]
    }
  }
}
</script>
