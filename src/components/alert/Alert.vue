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
        class="fixed shadow-2"
        :class="`fixed-${position}`"
        :color="color"
        @dismiss="dismiss"
        style="margin: 18px"
        :dismissible="!buttons || !buttons.length"
      >
        <q-icon v-if="icon" slot="left" :name="icon"></q-icon>
        <span v-html="html"></span>
        <div class="q-alert-actions row items-center justify-between">
          <span
            v-for="btn in buttons"
            :key="btn"
            @click="dismiss(btn.handler)"
            v-html="btn.label"
            class="uppercase"
          ></span>
        </div>
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
