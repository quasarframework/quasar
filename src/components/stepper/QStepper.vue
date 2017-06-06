<template>
  <div
    class="q-stepper column overflow-hidden"
    :class="classes"
  >
    <div
      v-if="!vertical"
      class="q-stepper-header row items-stretch justify-between shadow-1"
      :class="{'alternative-labels': alternativeLabels}"
    >
      <step-tab
        v-for="(step, index) in steps"
        :key="step"
        :vm="step"
      ></step-tab>
    </div>

    <slot></slot>
  </div>
</template>

<script>
import StepTab from './StepTab.vue'
import { frameDebounce } from '../../utils/debounce'

export default {
  name: 'q-stepper',
  components: {
    StepTab
  },
  props: {
    value: [Number, String],
    color: String,
    vertical: Boolean,
    alternativeLabels: Boolean,
    contractable: Boolean,
    doneIcon: {
      type: [String, Boolean],
      default: 'check'
    },
    activeIcon: {
      type: [String, Boolean],
      default: 'edit'
    },
    errorIcon: {
      type: [String, Boolean],
      default: 'warning'
    }
  },
  data () {
    return {
      step: this.value || null,
      steps: []
    }
  },
  provide () {
    return {
      __stepper: this
    }
  },
  watch: {
    value (v) {
      this.goToStep(v)
    }
  },
  computed: {
    classes () {
      const cls = [
        `q-stepper-${this.vertical ? 'vertical' : 'horizontal'}`
      ]
      if (this.color) {
        cls.push(`text-${this.color}`)
      }
      if (this.contractable) {
        cls.push(`q-stepper-contractable`)
      }
      return cls
    },
    hasSteps () {
      return this.steps.length > 0
    },
    currentStep () {
      if (this.hasSteps) {
        return this.steps.find(step => step.name === this.step)
      }
    },
    currentOrder () {
      if (this.currentStep) {
        return this.currentStep.actualOrder
      }
    },
    length () {
      return this.steps.length
    }
  },
  methods: {
    goToStep (step) {
      if (this.step === step || step === void 0) {
        return
      }

      this.step = step

      if (this.value !== step) {
        this.$emit('input', step)
        this.$emit('step', step)
      }
    },
    next () {
      if (this.currentOrder < this.length - 1) {
        this.__go(1)
      }
    },
    previous () {
      if (this.currentOrder > 0) {
        this.__go(-1)
      }
    },
    reset () {
      if (this.hasSteps) {
        this.goToStep(this.steps[0].name)
      }
    },

    __go (offset) {
      let
        name,
        index = this.currentOrder

      if (index === void 0) {
        if (!this.hasSteps) {
          return
        }
        name = this.steps[0].name
      }
      else {
        do {
          index += offset
        } while (index >= 0 && index < this.length - 1 && this.steps[index].disable)
        if (index < 0 || index > this.length || this.steps[index].disable) {
          return
        }
        name = this.steps[index].name
      }

      this.goToStep(name)
    },
    __sortSteps () {
      this.steps.sort((a, b) => {
        return a.actualOrder - b.actualOrder
      })
      this.steps.forEach((step, index) => {
        step.innerOrder = index
      })
    },
    __registerStep (vm) {
      this.steps.push(vm)
      this.__sortSteps()
      return this
    },
    __unregisterStep (vm) {
      this.steps = this.steps.filter(step => step !== vm)
    }
  },
  created () {
    this.__sortSteps = frameDebounce(this.__sortSteps)
  }
}
</script>
