<template>
  <div
    class="q-stepper shadow-1"
    :class="{
      vertical: data.vertical,
      horizontal: !data.vertical
    }"
  >
    <slot></slot>
    <q-inner-loading :visible="loading" :size="50"></q-inner-loading>
  </div>
</template>

<script>
import { QInnerLoading } from '../inner-loading'

export default {
  name: 'q-stepper',
  components: {
    QInnerLoading
  },
  props: {
    value: Number,
    loading: Boolean,
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
        step: null,
        vertical: true,
        doneIcon: this.doneIcon,
        selectedIcon: this.selectedIcon,
        errorIcon: this.errorIcon
      },
      steps: []
    }
  },
  provide () {
    return {
      data: this.data,
      goToStep: this.goToStep,
      setVerticality: this.__setVerticality,
      registerStep: this.__registerStep,
      unregisterStep: this.__unregisterStep
    }
  },
  methods: {
    goToStep (step) {
      if (this.data.step === step || typeof step === 'undefined') {
        return
      }

      this.data.step = step

      if (this.value !== step) {
        this.$emit('input', step)
        this.$emit('step', step)
      }
    },
    next (step) {
      if (step) {
        this.goToStep(step)
        return
      }

      let index = this.__getStepIndex(this.data.step)
      if (index !== -1 && index + 1 < this.steps.length) {
        this.goToStep(this.steps[index + 1].step)
      }
    },
    previous () {
      let index = this.__getStepIndex(this.data.step)
      if (index !== -1 && index > 0) {
        this.goToStep(this.steps[index - 1].step)
      }
    },
    reset () {
      if (this.steps.length > 0) {
        this.goToStep(this.steps[0].name)
      }
    },

    __setVerticality (bool) {
      this.data.vertical = bool
    },
    __registerStep (vm) {
      this.steps.push(vm)
    },
    __unregisterStep (vm) {
      this.steps.splice(this.steps.indexOf(vm), 1)
    },
    __getStepIndex (step) {
      return this.steps.findIndex(vm => vm.step === step)
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.value) {
        this.goToStep(this.value)
        return
      }
      this.reset()
    })
  }
}
</script>
