<template>
  <div class="timeline-item">
    <div class="timeline-badge">
      {{ step }}
    </div>
    <div class="timeline-title text-bold">
      {{{ title }}}
    </div>
    <div
      class="timeline-content"
      v-show="stepper && step === stepper.currentStep"
      transition="slide"
    >
      <slot></slot>
      <div class="group" style="margin-top: 1rem;">
        <button
          class="primary"
          :class="{disabled: !ready}"
          @click="nextStep()"
        >
          {{ stepper && step === stepper.steps ? 'Finish' : 'Next' }}
        </button>
        <button
          class="primary clear"
          v-if="step > 1"
          @click="previousStep()"
        >
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    ready: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      step: 0,
      stepper: {}
    }
  },
  watch: {
    visible () {
      this.notify('reset')
    },
    disabled () {
      this.notify('reset')
    }
  },
  methods: {
    nextStep () {
      if (this.ready) {
        this.notify('nextStep')
      }
    },
    previousStep () {
      this.notify('previousStep')
    },
    notify (event) {
      this.$dispatch('stepper::' + event)
    }
  },
  ready () {
    this.notify('reset')
  },
  destroyed () {
    this.notify('reset')
  }
}
</script>
