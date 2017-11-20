<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on each type to see an Action Sheet in action.
      </p>

      <q-list style="max-width: 600px;">
        <q-item
          link
          v-for="dialog in types"
          :key="dialog.label"
          @click="dialog.handler()"
          v-ripple.mat
        >
          <q-item-side icon="settings" />
          <q-item-main :label="dialog.label" />
          <q-item-side right icon="keyboard_arrow_right" />
        </q-item>
      </q-list>
    </div>

    {{ showActionSheet }}

    <q-btn label="Toggle ref" @click="toggle" />
    <q-btn label="Toggle model" @click="toggle2" />

    <q-action-sheet
      v-model="showActionSheet"
      ref="modal"
      @show="onShow"
      @hide="onHide"
      @cancel="onCancel"
      @ok="onOk"
      title="Action Sheet"
      :actions="[
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
      ]"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      showActionSheet: false,
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
    onHide (data) {
      console.log('onHide', data)
    },
    onShow (data) {
      console.log('onShow', data)
    },
    showActionSheetWithIcons (grid) {
      this.$q.actionSheet({
        title: 'Article Actions',
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
      }).then(name => {
        console.log('name', name)
      }).catch(() => {
        console.log('dismissed')
      })
    },
    showActionSheetWithAvatar (grid) {
      this.$q.actionSheet({
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
      }).then(name => {
        console.log('name', name)
      }).catch(() => {
        console.log('dismissed')
      })
    }
  }
}
</script>
