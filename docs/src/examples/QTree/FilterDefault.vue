<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input dense v-model="filter" label="Filter" />
    <q-tree
      :nodes="simple"
      node-key="label"
      :filter="filter"
      default-expand-all
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    filter: '',
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
  })
}
</script>
