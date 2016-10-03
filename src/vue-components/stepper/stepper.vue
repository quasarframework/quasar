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
      this.redraw()
    },
    'stepper::nextStep' () {
      this.nextStep()
    },
    'stepper::previousStep' () {
      this.previousStep()
    },
    'stepper::finish' () {
      this.finish()
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
      this.redraw()
      this.config.currentStep = 1
    },
    nextStep () {
      this.config.currentStep++
      if (this.config.currentStep > this.config.steps) {
        this.$emit('finish')
      }
    },
    previousStep () {
      this.config.currentStep--
    },
    finish () {
      this.config.currentStep = this.config.steps + 1
      this.$emit('finish')
    },
    redraw () {
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
  created () {
    this.reset = Utils.debounce(this.reset, 50)
  }
}
</script>
