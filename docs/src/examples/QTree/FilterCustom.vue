<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input
      ref="filter"
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
      :expanded.sync="expanded"
      default-expand-all
    />
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
      filter: 'de',
      expanded: [ 'Good service (disabled node) (*)' ]
    }
  },

  methods: {
    myFilterMethod (node, filter) {
      const filt = filter.toLowerCase()
      return node.label && node.label.toLowerCase().indexOf(filt) > -1 && node.label.toLowerCase().indexOf('(*)') > -1
    },

    resetFilter () {
      this.filter = ''
      this.$refs.filter.focus()
    }
  }
}
</script>
