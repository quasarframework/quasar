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

  <h5>Types of Notifiers</h5>
  <p class="group">
    <button
      v-for="type in types"
      :class="type"
      @click="toastWithType(type)"
    >
      {{type | capitalize}} Toast
    </button>
  </p>

  <h5>Notifiers with Options</h5>
  <p class="group">
    <button class="primary" @click="noTimeoutToast()">
      Basic Toast with No Timeout
    </button>

    <button class="primary" @click="toastWithIcon()">
      Toast With an Icon
    </button>

    <button class="primary" @click="toastWithButton()">
      Toast With a Button
    </button>
  </p>

  <h5>Controlling Notifiers</h5>
  <p class="group">
    <button
      class="secondary"
      @click="showToast()"
      :class="{disabled: toastShowing}"
    >
      Show Toast
    </button>
    <button
      class="secondary"
      @click="dismissToast()"
      :class="{disabled: !toastShowing}"
    >
      Hide Toast
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
import { Toast, Utils } from 'quasar'

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
      Toast.create('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
    },
    toastWithType (type) {
      Toast.create[type]({
        html: Utils.capitalize(type) + ' toast'
      })
    },
    noTimeoutToast () {
      Toast.create({
        html: 'This toast won\'t timeout. User must acknowledge it.',
        timeout: 0
      })
    },
    toastWithIcon () {
      Toast.create({
        html: 'Toast with an icon',
        icon: 'camera_enhance'
      })
    },
    toastWithButton () {
      Toast.create({
        html: 'Toast with an action button',
        button: {
          label: 'Undo',
          handler () {
            Toast.create.positive('Undone!')
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
      this.types.forEach((type) => {
        this.toastWithType(type)
      })
    }
  }
}
</script>
