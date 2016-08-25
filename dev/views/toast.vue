<template>
  <h5>Basic Notifiers</h5>
  <p class="group">
    <button class="primary" @click="basicToast()">
      Basic Toast
    </button>

    <button class="primary" @click="basicToastWithLongMessage()">
      Basic Toast with Long Message
    </button>
  </p>

  <h5>Notifiers with Options</h5>
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

    <button class="primary" @click="toastWithStyle()">
      Styled Toast
    </button>

    <button class="primary" @click="toastWithButtonAndStyle()">
      Styled Toast with Button
    </button>
  </p>

  <h5>Simultaneous Multiple Notifiers</h5>
  <p class="group">
    <button class="primary" @click="showMultipleNotifiers()">
      Show Multiple Notifiers
    </button>
  </p>
</template>

<script>
import { Toast } from 'quasar'

export default {
  data () {
    return {
      types: ['positive', 'negative', 'info', 'warning'],
      toastShowing: false
    }
  },
  methods: {
    basicToast () {
      Toast.create('Lorem ipsum dolor sit amet, consectetur adipiscing elit')
    },
    basicToastWithLongMessage () {
      Toast.create({
        html: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        timeout: 9999999999
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
    toastWithStyle () {
      Toast.create({
        html: 'Styled Toast',
        color: 'white',
        bgColor: 'red'
      })
    },
    toastWithButtonAndStyle () {
      Toast.create({
        html: 'Styled Toast',
        color: 'white',
        bgColor: 'red',
        button: {
          label: 'Show Me',
          color: '#333',
          handler () {
            Toast.create('But, but... I just showed you..')
          }
        }
      })
    },
    showToast () {
      if (this.toastShowing) {
        return
      }

      var self = this

      this.toast = Toast.create({
        html: 'Dismiss this toast with nearby Dissmiss Toast button',
        timeout: 0,
        onDismiss () {
          self.toastShowing = false
        }
      })
      this.toastShowing = true
    },
    dismissToast () {
      this.toast.dismiss()
      this.toastShowing = false
    },
    showMultipleNotifiers () {
      for (let i = 1; i <= 5; i++) {
        Toast.create('Showing Toast #' + i)
      }
    }
  }
}
</script>
