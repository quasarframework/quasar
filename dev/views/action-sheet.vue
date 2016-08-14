<template>
  <h1>With Icons</h1>
  <button class="primary" @click="showActionSheet()">Show Action Sheet</button>
  <button class="primary" @click="showActionSheet(true)">Show Action Sheet (Gallery)</button>

  <h1>With Avatar</h1>
  <button class="primary" @click="showActionSheetWithAvatar()">Show Action Sheet</button>
  <button class="primary" @click="showActionSheetWithAvatar(true)">Show Action Sheet (Gallery)</button>
</template>

<script>
import { ActionSheet } from 'quasar'

export default {
  methods: {
    showActionSheet (gallery) {
      ActionSheet.create({
        title: 'Actions',
        gallery: gallery,
        buttons: [
          {
            label: 'Delete',
            icon: 'delete',
            handler () {
              console.log('Deleting')
            }
          },
          {
            label: 'Share',
            icon: 'share',
            handler () {
              console.log('Sharing')
            }
          },
          {
            label: 'Play',
            icon: 'gamepad',
            handler () {
              console.log('Playing')
            }
          },
          {
            label: 'Favorite',
            icon: 'favorite',
            handler () {
              console.log('Added to favorites')
            }
          },
          {
            label: 'Cancel',
            icon: 'cancel',
            classes: 'text-primary',
            handler () {
              console.log('Cancelled...')
            }
          }
        ]
      }).show()
    },
    showActionSheetWithAvatar (gallery) {
      ActionSheet.create({
        title: 'Share to',
        gallery: gallery,
        buttons: [
          {
            label: 'Joe',
            avatar: 'assets/linux-avatar.png',
            handler () {
              console.log('Joe')
            }
          },
          {
            label: 'John',
            avatar: 'assets/boy-avatar.png',
            handler () {
              console.log('John')
            }
          },
          {
            label: 'Jim',
            avatar: 'assets/linux-avatar.png',
            handler () {
              console.log('Jim')
            }
          },
          {
            label: 'Jack',
            avatar: 'assets/guy-avatar.png',
            handler () {
              console.log('Jack')
            }
          },
          {
            label: 'Cancel',
            icon: 'cancel',
            classes: 'text-primary',
            handler () {
              console.log('Cancelled...')
            }
          }
        ]
      }).show()
    }
  }
}
</script>
