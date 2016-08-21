<template>
  <div class="quasar-stepper timeline primary">
    <slot></slot>
  </div>
</template>

<script>
import Utils from '../../utils'

export default {
  events: {
    'stepper::reset' () {
      this.reset()
    },
    'stepper::nextStep' () {
      this.config.currentStep++
      if (this.config.currentStep > this.config.steps) {
        this.$emit('finish')
      }
    },
    'stepper::previousStep' () {
      this.config.currentStep--
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
      let step = 1

      this.config.currentStep = this.config.currentStep || 1
      this.config.steps = this.$children.length
      this.$children.forEach(child => {
        child.$set('stepper', this.config)
        child.step = step
        step++
      })
    }
  },
  beforeCompile () {
    this.reset = Utils.debounce(this.reset, 50)
  }
}
</script>
