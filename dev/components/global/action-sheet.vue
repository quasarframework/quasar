<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on each type to see an Action Sheet in action.
      </p>

      <div class="list" style="max-width: 600px;">
        <div
          class="item item-link"
          v-for="dialog in types"
          @click="dialog.handler()"
        >
          <i class="item-primary">settings</i>
          <div class="item-content has-secondary">
            <div>{{dialog.label}}</div>
          </div>
          <i class="item-secondary">keyboard_arrow_right</i>
        </div>
      </div>
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
      icon: 'cancel',
      classes: 'text-primary',
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
      icon: 'cancel',
      classes: 'text-primary',
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
