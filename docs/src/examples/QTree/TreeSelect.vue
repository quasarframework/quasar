<template>
  <div class="q-pa-md q-gutter-sm">
    <q-field filled label="Tree Select" stack-label>
      <template v-slot:control>
        <div tabindex="0" class="no-outline full-width">
          {{ selected }}
        </div>
      </template>
      <template v-slot:append>
        <q-icon
          name="expand_more"
          class="q-expansion-item__toggle-icon"
          :class="{ 'rotate-180': $refs.menu !== void 0 && $refs.menu.showing === true }"
        />
      </template>
      <q-menu fit auto-close ref="menu">
        <q-tree
          :nodes="props"
          default-expand-all
          :selected.sync="selected"
          node-key="label"
        ></q-tree>
      </q-menu>
    </q-field>
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
          avatar: 'https://cdn.quasar-framework.org/img/boy-avatar.png',
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
  }
}
</script>
