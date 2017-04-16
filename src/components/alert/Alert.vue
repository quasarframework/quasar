<template>
  <div>
    <q-transition
      :name="name"
      :enter="enter"
      :leave="leave"
      :duration="duration"
      @after-leave="dismissed"
      appear
    >
      <q-alert
        v-show="visible"
        ref="alert"
        :color="color"
        @dismiss="dismiss"
        style="margin: 18px"
        :dismissible="!buttons || !buttons.length"
        :position="position"
        :buttons="buttons"
      >
        <q-icon v-if="icon" slot="left" :name="icon"></q-icon>
        <span v-html="html"></span>
      </q-alert>
    </q-transition>
  </div>
</template>

<script>
import { QTransition } from '../transition'
import QAlert from './QAlert.vue'
import { QIcon } from '../icon'
import { QBtn } from '../btn'

export default {
  components: {
    QTransition,
    QAlert,
    QIcon,
    QBtn
  },
  methods: {
    dismiss (fn) {
      this.visible = false
      if (typeof fn === 'function') {
        this.onDismiss = fn
      }
    },
    dismissed () {
      this.$emit('dismissed')
      this.onDismiss && this.onDismiss()
    }
  }
}
</script>
