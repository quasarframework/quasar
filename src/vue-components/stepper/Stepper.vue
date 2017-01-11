<template>
  <div class="q-stepper timeline" :class="color">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    backLabel: {
      type: String,
      default: 'Back'
    },
    nextLabel: {
      type: String,
      default: 'Continue'
    },
    finishLabel: {
      type: String,
      default: 'Finish'
    }
  },
  data () {
    return {
      config: {
        steps: 0,
        currentStep: 0
      }
    }
  },
  methods: {
    reset () {
      this.config.currentStep = 1
      this.$emit('step', this.config.currentStep)
    },
    nextStep () {
      this.config.currentStep++
      this.$emit('step', this.config.currentStep)
      if (this.config.currentStep > this.config.steps) {
        this.$emit('finish')
      }
    },
    previousStep () {
      this.config.currentStep--
      this.$emit('step', this.config.currentStep)
    },
    finish () {
      this.config.currentStep = this.config.steps + 1
      this.$emit('step', this.config.currentStep)
      this.$emit('finish')
    }
  },
  mounted () {
    let step = 1
    this.config.currentStep = this.config.currentStep || 1
    this.config.steps = this.$children.length
    this.$emit('step', this.config.currentStep)
    this.$children.forEach(child => {
      child.step = step
      step++
    })
  }
}
</script>
