<template>
  <div
    class="q-stepper shadow-1"
    :class="{
      vertical: data.vertical,
      horizontal: !data.vertical
    }"
  >
    <slot></slot>
    <q-inner-loading :show="inProgress" />
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
    inProgress: Boolean,
    doneIcon: {
      type: [String, Boolean],
      default: 'check'
    },
    selectedIcon: {
      type: [String, Boolean],
      default: 'edit'
    },
    errorIcon: {
      type: [String, Boolean],
      default: 'warning'
    }
  },
  watch: {
    value (name) {
      this.goToStep(name)
    },
    doneIcon (i) {
      this.data.doneIcon = i
    },
    selectedIcon (i) {
      this.data.selectedIcon = i
    },
    errorIcon (i) {
      this.data.errorIcon = i
    }
  },
  data () {
    return {
      data: {
        step: 1,
        maxEditableStep: 1,
        vertical: true,
        doneIcon: this.doneIcon,
        selectedIcon: this.selectedIcon,
        errorIcon: this.errorIcon
      }
    }
  },
  provide () {
    return {
      data: this.data,
      goToStep: this.goToStep,
      setVerticality: this.__setVerticality
    }
  },
  methods: {
    goToStep (step) {
      if (this.data.step !== step) {
        this.data.step = step
        if (step > this.data.maxEditableStep) {
          this.data.maxEditableStep = step
        }
        this.$emit('input', step)
        this.$emit('step', step)
      }
    },
    previous () {
      if (this.data.step > 1) {
        this.goToStep(this.data.step - 1)
      }
    },
    next () {
      this.goToStep(this.data.step + 1)
    },
    __setVerticality (bool) {
      this.data.vertical = bool
    },
    reset () {
      this.data.maxEditableStep = 1
      this.data.step = 1
    }
  },
  mounted () {
    if (this.data.step === 0 && this.value) {
      this.goToStep(this.value)
    }
  }
}
</script>
