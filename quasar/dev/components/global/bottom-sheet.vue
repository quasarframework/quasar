<template>
  <div class="q-layout-padding">
    <div style="max-width: 500px" class="q-mx-auto">
      <h1>Bottom Sheet</h1>

      <div class="q-gutter-sm">
        <q-btn flat color="primary" label="List" @click="show()" />
        <q-btn flat color="primary" label="Grid" @click="show(true)" />
      </div>

      <div class="q-gutter-sm">
        <q-btn flat color="primary" label="List - custom" @click="showCustom()" />
        <q-btn flat color="primary" label="Grid - custom" @click="showCustom(true)" />
      </div>
    </div>
  </div>
</template>

<script>
const actions = [
  {
    label: 'Drive',
    img: 'https://cdn.quasar-framework.org/img/logo_drive_128px.png',
    id: 'drive'
  },
  {
    label: 'Keep',
    img: 'https://cdn.quasar-framework.org/img/logo_keep_128px.png',
    id: 'keep'
  },
  {
    label: 'Google Hangouts',
    img: 'https://cdn.quasar-framework.org/img/logo_hangouts_128px.png',
    id: 'calendar'
  },
  {
    label: 'Calendar',
    img: 'https://cdn.quasar-framework.org/img/logo_calendar_128px.png',
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
    avatar: 'https://cdn.quasar-framework.org/img/boy-avatar.png',
    id: 'john'
  }
]

export default {
  methods: {
    hideBottomSheet () {
      if (this.bottomSheetHandler !== void 0) {
        this.bottomSheetHandler.hide()
      }
    },

    show (grid) {
      this.bottomSheetHandler = this.$q.bottomSheet({
        message: 'Bottom Sheet message',
        grid,
        actions
      }).onOk(action => {
        console.log('Action chosen:', action.id)
      }).onCancel(() => {
        console.log('Dismissed')
      }).onDismiss(() => {
        this.bottomSheetHandler = void 0
      })
    },

    showCustom (grid) {
      this.bottomSheetHandler = this.$q.bottomSheet({
        message: 'Bottom Sheet message',
        grid,
        actions,
        style: { backgroundColor: 'red' },
        className: 'custom-bottom-sheet'
      }).onOk(action => {
        console.log('Action chosen:', action.id)
      }).onCancel(() => {
        console.log('Dismissed')
      }).onDismiss(() => {
        this.bottomSheetHandler = void 0
      })
    }
  },

  beforeRouteLeave (to, from, next) {
    this.hideBottomSheet()
    next()
  }
}
</script>
