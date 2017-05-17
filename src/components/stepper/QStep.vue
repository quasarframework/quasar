<template>
  <div
    class="q-stepper-step row items-center"
    :class="{
      'step-selected': selected,
      'step-editable': editable || isEditable,
      'step-done': done || isDone,
      'step-error': error,
    }"
    @click="select"
    v-ripple.mat
  >
    <div class="q-stepper-identity row items-center justify-center">
      <q-icon :name="stepIcon" v-if="stepIcon"></q-icon>
      <template v-else>{{ step }}</template>
    </div>
    <div class="q-stepper-label column">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { QIcon } from '../icon'
import Ripple from '../../directives/ripple'

export default {
  name: 'q-step',
  components: {
    QIcon
  },
  directives: {
    Ripple
  },
  props: {
    step: {
      type: [Number, String],
      required: true
    },
    done: Boolean,
    editable: Boolean,
    icon: String,
    error: Boolean
  },
  inject: ['data', 'goToStep', 'registerStep', 'unregisterStep'],
  data () {
    return {
      isEditable: false,
      isDone: false
    }
  },
  computed: {
    selected () {
      return this.data.step === this.step
    },
    stepIcon () {
      if (this.selected && this.data.selectedIcon !== false) {
        return this.data.selectedIcon || 'edit'
      }
      if (this.error && this.data.errorIcon !== false) {
        return this.data.errorIcon || 'warning'
      }
      if (this.done && this.data.doneIcon !== false) {
        return this.data.doneIcon || 'check'
      }

      return this.icon
    }
  },
  methods: {
    select () {
      if (this.editable || this.isEditable) {
        this.goToStep(this.step)
      }
    },
    setEditable (val = true) {
      this.isEditable = val
    },
    setDone (val = true) {
      this.done = val
    }
  },
  mounted () {
    this.registerStep(this)
  },
  beforeDestroy () {
    this.unregisterStep(this)
  }
}
</script>
