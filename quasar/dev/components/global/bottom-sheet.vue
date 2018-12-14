<template>
  <div class="q-layout-padding">
    <div style="max-width: 500px" class="q-mx-auto">
      <h1>Bottom Sheet</h1>

      <div class="q-gutter-sm">
        <q-btn flat color="primary" label="List" @click="show()" />
        <q-btn flat color="primary" label="Grid" @click="show(true)" />
      </div>
    </div>
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
            label: 'Drive',
            img: 'statics/logo_drive_128px.png',
            id: 'drive'
          },
          {
            label: 'Keep',
            img: 'statics/logo_keep_128px.png',
            id: 'keep'
          },
          {
            label: 'Google Hangouts',
            img: 'statics/logo_hangouts_128px.png',
            id: 'calendar'
          },
          {
            label: 'Calendar',
            img: 'statics/logo_calendar_128px.png',
            id: 'calendar'
          },
          {},
          {
            label: 'Share',
            icon: 'share',
            id: 'share'
          },
          {
            label: 'Upload',
            icon: 'cloud_upload',
            color: 'primary',
            id: 'upload'
          },
          {},
          {
            label: 'John',
            avatar: 'statics/boy-avatar.png',
            id: 'john'
          }
        ]
      }).onOk(action => {
        console.log('Action chosen:', action.id)
      }).onCancel(() => {
        console.log('Dismissed')
      })
    }
  }
}
</script>
