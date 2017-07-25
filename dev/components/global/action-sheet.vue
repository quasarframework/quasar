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
  </div>
</template>

<script>
import { ActionSheet, Toast } from 'quasar'

function showActionSheetWithIcons (gallery) {
  ActionSheet.create({
    title: 'Article Actions',
    gallery: gallery,
    actions: [
      {
        label: 'Delete',
        icon: 'delete',
        handler () {
          Toast.create('Deleted Article')
        }
      },
      {
        label: 'Share',
        icon: 'share',
        handler () {
          Toast.create('Shared!')
        }
      },
      {
        label: 'Play',
        icon: 'gamepad',
        handler () {
          Toast.create('Launched Game')
        }
      },
      {
        label: 'Favorite',
        icon: 'favorite',
        handler () {
          Toast.create('Added to favorites')
        }
      }
    ],
    dismiss: {
      label: 'Cancel',
      handler () {
        Toast.create('Cancelled...')
      }
    }
  })
}

function showActionSheetWithAvatar (gallery) {
  ActionSheet.create({
    title: 'Share to',
    gallery: gallery,
    actions: [
      {
        label: 'Joe',
        avatar: 'statics/linux-avatar.png',
        handler () {
          Toast.create('Shared to Joe!')
        }
      },
      {
        label: 'John',
        avatar: 'statics/boy-avatar.png',
        handler () {
          Toast.create('Shared to John!')
        }
      },
      {
        label: 'Jim',
        avatar: 'statics/linux-avatar.png',
        handler () {
          Toast.create('Shared to Jim!')
        }
      },
      {
        label: 'Jack',
        avatar: 'statics/guy-avatar.png',
        handler () {
          Toast.create('Shared to Jack!')
        }
      }
    ],
    dismiss: {
      label: 'Cancel',
      handler () {
        Toast.create('Cancelled...')
      }
    }
  })
}

export default {
  data () {
    return {
      types: [
        {
          label: 'List with Icons',
          handler () {
            showActionSheetWithIcons()
          }
        },
        {
          label: 'Gallery with Icons',
          handler () {
            showActionSheetWithIcons(true)
          }
        },
        {
          label: 'List with Avatars',
          handler () {
            showActionSheetWithAvatar()
          }
        },
        {
          label: 'Gallery with Avatars',
          handler () {
            showActionSheetWithAvatar(true)
          }
        }
      ]
    }
  }
}
</script>
