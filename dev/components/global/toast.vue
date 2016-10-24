<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Basic Toasts</p>
      <p class="group">
        <button class="primary" @click="basicToast()">
          Default Toast
        </button>

        <button class="primary" @click="basicToastWithLongMessage()">
          Default Toast with Long Message
        </button>
      </p>

      <p class="caption">Types of Toasts</p>
      <p class="group">
        <button
          v-for="type in types"
          :class="type"
          @click="toastWithType(type)"
        >
          {{ capitalize(type) }} Toast
        </button>
      </p>

      <p class="caption">Toasts with Options</p>
      <p class="group">
        <button class="primary" @click="toastWithIcon()">
          Toast With an Icon
        </button>

        <button class="primary" @click="toastWithButton()">
          Toast With a Button
        </button>

        <button class="primary" @click="toastWithImage()">
          Toast With an Image
        </button>

        <button class="purple" @click="toastWithStyle()">
          Styled Toast
        </button>

        <button class="orange" @click="toastWithButtonAndStyle()">
          Styled Toast with Button
        </button>

        <button class="primary" @click="toastWithTimeout()">
          Toast With Custom Timeout
        </button>

        <button class="primary" @click="toastWithOnDismiss()">
          Toast With Dismiss Trigger
        </button>
      </p>

      <p class="caption">Simultaneous Multiple Toasts</p>
      <p class="group">
        <button class="primary" @click="showMultipleToasts()">
          Show Multiple Toasts
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from 'quasar'

export default {
  data () {
    return {
      types: ['positive', 'negative', 'info', 'warning'],
      toastShowing: false
    }
  },
  methods: {
    capitalize (msg) {
      return msg.charAt(0).toUpperCase() + msg.slice(1)
    },
    basicToast () {
      Toast.create('Lorem ipsum dolor')
    },
    basicToastWithLongMessage () {
      Toast.create('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
    },
    toastWithType (type) {
      Toast.create[type]({
        html: type.charAt(0).toUpperCase() + type.slice(1) + ' toast'
      })
    },
    toastWithIcon () {
      Toast.create({
        html: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        icon: 'camera_enhance'
      })
    },
    toastWithButton () {
      Toast.create({
        html: 'Toast with an action button',
        button: {
          label: 'Undo',
          handler () {
            Toast.create('Undone')
          }
        }
      })
    },
    toastWithImage () {
      Toast.create({
        html: 'Toast with an image',
        image: 'statics/linux-avatar.png'
      })
    },
    toastWithOnDismiss () {
      Toast.create({
        html: 'Showing Dialog after Toast is dismissed.',
        timeout: 5000,
        onDismiss () {
          Dialog.create({
            title: 'Dismissed',
            message: 'Toast was just dismissed!',
            buttons: ['OK']
          })
        }
      })
    },
    toastWithTimeout () {
      Toast.create({
        html: 'Toast being displayed for 6s.',
        timeout: 6000
      })
    },
    toastWithStyle () {
      Toast.create({
        html: 'Styled Toast',
        color: '#BBB',
        bgColor: 'purple'
      })
    },
    toastWithButtonAndStyle () {
      Toast.create({
        html: 'Styled Toast',
        color: 'black',
        bgColor: 'orange',
        button: {
          label: 'Show Me',
          color: '#555',
          handler () {
            Toast.create('But, but... I just showed you..')
          }
        }
      })
    },
    showMultipleToasts () {
      for (let i = 1; i <= 3; i++) {
        Toast.create('Showing Toast #' + i)
      }
    }
  }
}
</script>
