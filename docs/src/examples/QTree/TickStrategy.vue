<template>
  <div class="q-pa-md row q-col-gutter-sm">
    <q-tree class="col-12 col-sm-6"
      :nodes="simple"
      node-key="label"
      :filter="filter"
      :tick-strategy="tickStrategy"
      :selected.sync="selected"
      :ticked.sync="ticked"
      :expanded.sync="expanded"
      default-expand-all
    />
    <div class="col-12 col-sm-6">
      <q-option-group
        v-model="tickStrategy"
        :options="tickStrategies"
      />
      <q-toggle v-model="filtered" label="Filtered by '(*)'" v-if="tickStrategy === 'leaf-filtered'" />
      <div class="bg-black text-white q-pa-sm q-mt-sm">ticked:</div>
      <pre>{{ticked}}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
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
    selected: null,
    filtered: false,
    ticked: [],
    expanded: ['Good service (disabled node)'],
    tickStrategy: 'strict',
    tickStrategies: [
      { value: 'none', label: 'None' },
      { value: 'strict', label: 'Strict' },
      { value: 'leaf', label: 'Leaf' },
      { value: 'leaf-filtered', label: 'Leaf Filtered' }
    ]
  }),
  computed: {
    filter () {
      return this.tickStrategy === 'leaf-filtered' && this.filtered ? '(*)' : null
    }
  }
}
</script>
