<template>
  <div class="q-pa-md row q-col-gutter-sm">
    <q-tree class="col-12 col-sm-6"
      :nodes="simple"
      node-key="label"
      tick-strategy="leaf"
      :selected.sync="selected"
      :ticked.sync="ticked"
      :expanded.sync="expanded"
    />
    <div class="col-12 col-sm-6">
      <div class="bg-black text-white q-pa-sm">selected:</div>
      <pre>{{selected}}</pre>
      <div class="bg-black text-white q-pa-sm q-mt-sm">ticked:</div>
      <pre>{{ticked}}</pre>
      <div class="bg-black text-white q-pa-sm q-mt-sm">expanded:</div>
      <pre>{{expanded}}</pre>
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
              { label: 'Happy atmosphere' },
              { label: 'Good table presentation' },
              { label: 'Pleasing decor' }
            ]
          }
        ]
      }
    ],
    selected: 'Pleasant surroundings',
    ticked: ['Quality ingredients', 'Good table presentation'],
    expanded: ['Satisfied customers', 'Good service (disabled node)', 'Pleasant surroundings']
  })
}
</script>
