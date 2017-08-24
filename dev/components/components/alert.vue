<template>
  <div class="layout-padding">

    <div style="margin-bottom: 25px">
      <q-btn color="primary" @click="alertAsMethod">Show Alert as Method</q-btn>
      <q-btn color="primary" @click="reset">Reset First 2 Alerts</q-btn>
    </div>

    <q-alert
      color="brown"
      icon="cloud"
      enter="bounceInLeft"
      leave="bounceOutRight"
      appear
      style="margin-bottom: 1.5rem"
      v-model="visible"
      dismissible
    >
      Lorem ipsum dolor sit amet.
    </q-alert>

    <q-alert
      type="negative"
      ref="destroyableAlert"
      v-model="visible2"
      dismissible
      style="margin-bottom: 1.5rem"
      :actions="[{label: 'Snooze', handler () {}}]"
    >
      Lorem ipsum dolor sit amet.
    </q-alert>

    <q-toggle v-model="diss" label="Dismiss next one" />
    <q-alert
      type="negative"
      style="margin-bottom: 1.5rem"
      dismissible
      v-model="diss"
      @dismiss="dismissed"
      :actions="actions"
    >
      No anim, dismiss test.
    </q-alert>

    <q-alert
      v-for="type in ['positive', 'info', 'negative', 'warning']"
      :key="type"
      :color="type"
      dismissible
      style="margin-bottom: 1.5rem"
    >
      Lorem ipsum dolor sit amet.
    </q-alert>

    <q-alert
      v-for="type in ['positive', 'info', 'negative', 'warning']"
      :key="type"
      :color="type"
      style="margin-bottom: 1.5rem"
    >
      Non dismissible. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </q-alert>
  </div>
</template>

<script>
import { Alert } from 'quasar'
// import 'quasar-extras/animate/bounceInLeft.css'
// import 'quasar-extras/animate/bounceInRight.css'
// import 'quasar-extras/animate/bounceOutRight.css'

Alert.create({html: 'Warning, warning Will Robinson!'})

export default {

  data () {
    return {
      visible: true,
      visible2: true,
      diss: true,
      actions: [{
        label: 'Snooze',
        handler () {
          console.log('dismissed')
        }
      }]
    }
  },
  methods: {
    dismissed () {
      console.log('@dismiss')
    },
    alertAsMethod () {
      Alert.create({
        enter: 'bounceInRight',
        leave: 'bounceOutRight',
        color: 'warning',
        icon: 'wifi',
        html: `A text with your alert's<br><strong>awesome</strong> message`,
        position: 'top-right',
        actions: [
          {
            label: 'Snooze',
            handler () {
              console.log('acting')
            }
          },
          {
            label: 'Abort',
            handler () {
              console.log('aborting')
            }
          }
        ]
      })
    },
    reset () {
      this.visible = true
      this.visible2 = true
    }
  }
}
</script>
