<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input
      ref="filterRef"
      filled
      v-model="filter"
      label="Search - only filters labels that have also '(*)'"
    >
      <template v-slot:append>
        <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
      </template>
    </q-input>

    <q-tree
      :nodes="simple"
      node-key="label"
      :filter="filter"
      :filter-method="myFilterMethod"
      v-model:expanded="expanded"
      default-expand-all
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const filter = ref('de')
    const filterRef = ref(null)

    return {
      filter,
      filterRef,
      expanded: ref(['Good service (disabled node) (*)']),

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
              label: 'Good service (disabled node) (*)',
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

      myFilterMethod (node, filter) {
        const filt = filter.toLowerCase()
        return node.label && node.label.toLowerCase().indexOf(filt) > -1 && node.label.toLowerCase().indexOf('(*)') > -1
      },

      resetFilter () {
        filter.value = ''
        filterRef.value.focus()
      }
    }
  }
}
</script>
