<template>
  <div class="layout-padding">
    <q-btn class="primary raised fixed" style="right: 18px; bottom: 18px" @click="reset">Reset</q-btn>

    <q-btn style="margin-bottom: 25px" class="primary" @click="alert">Show Alert</q-btn>

    <q-transition
      enter="bounceInLeft"
      leave="bounceOutRight"
      appear
    >
      <q-alert
        color="brown"
        ref="alert"
        style="margin-bottom: 1.5rem"
      >
        <q-icon name="cloud" slot="left" />
        Lorem ipsum dolor sit amet.
      </q-alert>
    </q-transition>

    <q-alert
      type="negative"
      ref="destroyableAlert"
      dismissible
      @dismiss="$refs.destroyableAlert.destroy()"
      style="margin-bottom: 1.5rem"
    >
      Dest. Lorem ipsum dolor sit amet.
    </q-alert>

    <q-transition
      v-for="type in ['positive', 'info', 'negative', 'warning']"
      :key="type"
      enter="bounceInLeft"
      leave="bounceOutRight"
    >
      <q-alert
        :color="type"
        v-show="visible"
        v-model="visible"
        ref="alert"
        dismissible
        style="margin-bottom: 1.5rem"
      >
        Lorem ipsum dolor sit amet.
      </q-alert>
    </q-transition>

    <!--
    <q-alert style="margin-bottom: 1.5rem">
      <q-spinner color="white" :size="24" slot="left" />
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </q-alert>
    -->

    <q-alert
      v-for="type in ['positive', 'info', 'negative', 'warning']"
      :key="type"
      :color="type"
      ref="alert"
      style="margin-bottom: 1.5rem"
    >
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </q-alert>
  </div>
</template>

<script>
import { Alert } from 'quasar'
import 'animations/bounceInLeft.css'
import 'animations/bounceOutRight.css'
import 'animations/zoomIn.css'
import 'animations/zoomOut.css'

export default {
  data () {
    return {
      visible: true
    }
  },
  methods: {
    alert () {
      Alert.create({
        enter: 'zoomIn',
        leave: 'zoomOut',
        color: 'positive',
        icon: 'wifi',
        html: 'Some htmllllll',
        position: 'top',
        buttons: [
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
      // alert.dismiss()
    },
    reset () {
      this.$refs.alert.forEach(alert => {
        alert.show()
      })
    }
  }
}
</script>
