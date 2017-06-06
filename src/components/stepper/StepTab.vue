<template>
  <div
    class="q-stepper-tab col-grow flex no-wrap relative-position"
    :class="{
      'step-error': vm.error,
      'step-active': vm.active,
      'step-done': vm.done,
      'step-error': vm.error,
      'step-waiting': vm.waiting,
      'step-disabled': vm.disable,
      'step-colored': vm.active || vm.done,
      'items-center': !vm.__stepper.vertical,
      'items-start': vm.__stepper.vertical
    }"
    @click="__select"
    v-ripple.mat="vm.done"
  >
    <div class="q-stepper-dot row items-center justify-center q-stepper-line relative-position">
      <span class="row items-center justify-center">
        <q-icon v-if="vm.stepIcon" :name="vm.stepIcon"></q-icon>
        <span v-else>{{ vm.actualOrder + 1 }}</span>
      </span>
    </div>
    <div v-if="vm.title" class="q-stepper-label q-stepper-line relative-position">
      <div class="q-stepper-title" v-html="vm.title"></div>
      <div class="q-stepper-subtitle" v-html="vm.subtitle"></div>
    </div>
  </div>
</template>

<script>
import { QIcon } from '../icon'
import Ripple from '../../directives/ripple'

export default {
  name: 'q-step-header',
  components: {
    QIcon
  },
  directives: {
    Ripple
  },
  props: ['vm'],
  methods: {
    __select () {
      this.vm.select()
    }
  }
}
</script>
