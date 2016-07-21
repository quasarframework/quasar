<template>
  <h5>Basic Notifiers</h5>
  <p>
    <button class="primary" @click="basicNotify()">
      Basic Notify
    </button>

    <button class="primary" @click="basicNotifyWithLongMessage()">
      Basic Notify with Long Message
    </button>
  </p>

  <h5>Types of Notifiers</h5>
  <p>
    <button
      v-for="type in types"
      :class="type"
      @click="notifyWithType(type)"
    >
      {{type | capitalize}} Notify
    </button>
  </p>

  <h5>Notifiers with Options</h5>
  <p>
    <button class="primary" @click="noTimeoutNotify()">
      Basic Notify with No Timeout
    </button>

    <button class="primary" @click="notifyWithIcon()">
      Notify With an Icon
    </button>

    <button class="primary" @click="notifyWithButton()">
      Notify With a Button
    </button>
  </p>

  <h5>Controlling Notifiers</h5>
  <p>
    <button
      class="secondary"
      @click="showNotify()"
      :class="{disabled: notifyShowing}"
    >
      Show Notify
    </button>
    <button
      class="secondary"
      @click="dismissNotify()"
      :class="{disabled: !notifyShowing}"
    >
      Hide Notify
    </button>
  </p>

  <h5>Simultaneous Multiple Notifiers</h5>
  <p>
    <button class="primary" @click="showMultipleNotifiers()">
      Show Multiple Notifiers
    </button>
  </p>
</template>

<script>
import { Notify, Utils } from 'quasar-framework'

export default {
  data () {
    return {
      types: ['positive', 'negative', 'info', 'warning'],
      notifyShowing: false
    }
  },
  methods: {
    basicNotify () {
      Notify.create('Lorem ipsum dolor sit amet, consectetur adipiscing elit')
    },
    basicNotifyWithLongMessage () {
      Notify.create('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
    },
    notifyWithType (type) {
      Notify.create[type]({
        html: Utils.capitalize(type) + ' notify'
      })
    },
    noTimeoutNotify () {
      Notify.create({
        html: 'This notify won\'t timeout. User must acknowledge it.',
        timeout: 0
      })
    },
    notifyWithIcon () {
      Notify.create({
        html: 'Notify with an icon',
        icon: 'camera_enhance'
      })
    },
    notifyWithButton () {
      Notify.create({
        html: 'Notify with an action button',
        button: {
          label: 'Undo',
          handler () {
            Notify.create.positive('Undone!')
          }
        }
      })
    },
    showNotify () {
      if (this.notifyShowing) {
        return
      }

      var self = this

      this.notify = Notify.create({
        html: 'Dismiss this notify with nearby Dissmiss Notify button',
        timeout: 0,
        onDismiss () {
          self.notifyShowing = false
        }
      })
      this.notifyShowing = true
    },
    dismissNotify () {
      this.notify.dismiss()
      this.notifyShowing = false
    },
    showMultipleNotifiers () {
      this.types.forEach((type) => {
        this.notifyWithType(type)
      })
    }
  }
}
</script>
