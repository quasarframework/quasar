<template>
  <div
    class="timeline-item"
    :class="{incomplete: step > stepper.currentStep}"
  >
    <div class="timeline-badge">
      <i v-if="step < stepper.currentStep">
        done
      </i>
      <span v-else>
        {{ step }}
      </span>
    </div>
    <div class="timeline-title text-bold" v-html="title"></div>
    <div
      class="timeline-content"
      v-show="stepper && step === stepper.currentStep"
      transition="slide"
    >
      <slot></slot>
      <div class="group" style="margin-top: 1rem; margin-left: -5px;">
        <button
          class="primary"
          :class="{disabled: !ready}"
          @click="nextStep()"
        >
          {{ stepper && step === stepper.steps ? 'Finish' : 'Continue' }}
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
      this.__notify('reset')
    },
    disabled () {
      this.__notify('reset')
    }
  },
  methods: {
    nextStep () {
      if (this.ready) {
        this.__notify('nextStep')
      }
    },
    previousStep () {
      this.__notify('previousStep')
    },
    finish () {
      this.__notify('finish')
    },
    __notify (event) {
      this.$dispatch('stepper::' + event)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.__notify('reset')
    })
  },
  destroyed () {
    this.__notify('reset')
  }
}
</script>
