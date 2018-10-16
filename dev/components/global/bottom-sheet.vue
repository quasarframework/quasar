<template>
  <div class="q-layout-padding">
    <div style="max-width: 500px" class="q-mx-auto">
      <h1>Bottom Sheet</h1>

      <q-list style="max-width: 600px;">
        <q-item
          clickable
          v-for="dialog in types"
          :key="dialog.label"
          @click="dialog.handler"
          v-ripple
        >
          <q-item-section side>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ dialog.label }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      types: [
        {
          label: 'List with Icons',
          handler: () => {
            this.showActionSheetWithIcons()
          }
        },
        {
          label: 'Grid with Icons',
          handler: () => {
            this.showActionSheetWithIcons(true)
          }
        },
        {
          label: 'List with Avatars',
          handler: () => {
            this.showActionSheetWithAvatar()
          }
        },
        {
          label: 'Grid with Avatars',
          handler: () => {
            this.showActionSheetWithAvatar(true)
          }
        }
      ]
    }
  },
  methods: {
    toggle () {
      this.$refs.modal.show()
    },
    toggle2 () {
      this.showActionSheet = !this.showActionSheet
    },
    onOk (data) {
      console.log('onOK', data)
    },
    onCancel (data) {
      console.log('onCancel', data)
    },
    onEscape (data) {
      console.log('onEscape', data)
    },
    onHide (data) {
      console.log('onHide', data)
    },
    onShow (data) {
      console.log('onShow', data)
    },
    showActionSheetWithIcons (grid) {
      this.$q.bottomSheet({
        message: 'Article Actions',
        grid,
        actions: [
          {
            label: 'Delete',
            icon: 'delete',
            color: 'red',
            id: 'delete'
          },
          {
            label: 'Share',
            icon: 'share',
            color: 'primary',
            id: 'share'
          },
          {
            label: 'Play',
            icon: 'gamepad',
            id: 'play'
          },
          {},
          {
            label: 'Favorite',
            icon: 'favorite',
            id: 'favorite'
          }
        ]
      }).onOk(name => {
        console.log('name', name)
      }).onCancel(() => {
        console.log('dismissed')
      })
    },
    showActionSheetWithAvatar (grid) {
      this.$q.bottomSheet({
        title: 'Share to',
        grid,
        actions: [
          {
            label: 'Joe',
            avatar: 'statics/linux-avatar.png',
            id: 'joe'
          },
          {
            label: 'John',
            avatar: 'statics/boy-avatar.png',
            id: 'john'
          },
          {
            label: 'Jim',
            avatar: 'statics/linux-avatar.png',
            id: 'jim'
          },
          {},
          {
            label: 'Jack',
            avatar: 'statics/guy-avatar.png',
            id: 'jack'
          }
        ]
      }).onOk(name => {
        console.log('name', name)
      }).onCancel(() => {
        console.log('dismissed')
      })
    }
  }
}
</script>
