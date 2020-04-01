<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn no-caps push color="primary" label="List With Disabled Option" @click="show()" />
    <q-btn no-caps push color="white" text-color="primary" label="Grid With Disabled Option" @click="show(true)" />
  </div>
</template>

<script>
export default {
  methods: {
    show (grid) {
      this.$q.bottomSheet({
        message: 'Bottom Sheet message',
        grid,
        actions: [
          {
            label: 'Clickable',
            icon: 'touch_app',
            color: 'primary',
            id: 'clickable'
          },
          {
            label: 'Disabled',
            icon: 'cancel',
            disable: true,
            id: 'disabled'
          }
        ]
      }).onOk(action => {
        // console.log('Action chosen:', action.id)
      }).onCancel(() => {
        // console.log('Dismissed')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
  }
}
</script>
