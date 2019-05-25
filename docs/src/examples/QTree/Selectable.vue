<template>
  <div class="q-pa-md q-gutter-sm">
    <div>
      <div class="q-gutter-sm">
        <q-btn size="sm" color="primary" @click="selectGoodService" label="Select 'Good service'" />
        <q-btn v-if="selected" size="sm" color="red" @click="unselectNode" label="Unselect node" />
      </div>
    </div>
    <q-tree
      :nodes="props"
      default-expand-all
      :selected.sync="selected"
      node-key="label"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      selected: null,
      props: [
        {
          label: 'Satisfied customers',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          children: [
            {
              label: 'Good food',
              icon: 'restaurant_menu',
              children: [
                { label: 'Quality ingredients' },
                { label: 'Good recipe' }
              ]
            },
            {
              label: 'Good service',
              icon: 'room_service',
              children: [
                { label: 'Prompt attention' },
                { label: 'Professional waiter' }
              ]
            },
            {
              label: 'Pleasant surroundings',
              icon: 'photo',
              children: [
                {
                  label: 'Happy atmosphere'
                },
                {
                  label: 'Good table presentation'
                },
                {
                  label: 'Pleasing decor'
                }
              ]
            }
          ]
        }
      ]
    }
  },

  methods: {
    selectGoodService () {
      if (this.selected !== 'Good service') {
        this.selected = 'Good service'
      }
    },

    unselectNode () {
      this.selected = null
    }
  }
}
</script>
