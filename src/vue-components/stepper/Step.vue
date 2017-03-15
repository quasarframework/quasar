<template>
  <div
    class="q-stepper-step row items-center"
    :class="{
      'step-selected': selected,
      'step-inactive': inactive,
      'step-done': done,
      disabled: disabled,
      'step-error': error,
      'cursor-pointer': editable,
      'cursor-not-allowed': !editable
    }"
    @click="select"
    v-ripple.mat
  >
    <div class="q-stepper-identity flex items-center justify-center">
      <i v-if="stepIcon">{{ stepIcon }}</i>
      <template v-else>{{ step }}</template>
    </div>
    <div class="q-stepper-label column">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      required: true
    },
    icon: String,
    error: Boolean,
    disabled: Boolean
  },
  inject: ['data', 'goToStep'],
  computed: {
    selected () {
      return this.data.step === this.step
    },
    inactive () {
      return this.data.step < this.step
    },
    done () {
      return this.data.step > this.step
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
    },
    editable () {
      return this.data.maxEditableStep >= this.step
    }
  },
  methods: {
    select () {
      if (!this.disabled && this.editable) {
        this.goToStep(this.step)
      }
    }
  }
}
</script>
