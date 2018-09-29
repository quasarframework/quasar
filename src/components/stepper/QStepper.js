import StepTab from './StepTab.js'
import frameDebounce from '../../utils/frame-debounce.js'

import Vue from 'vue'
export default Vue.extend({
  name: 'QStepper',

  props: {
    value: [Number, String],

    color: String,
    dark: Boolean,

    flat: Boolean,
    bordered: Boolean,
    vertical: Boolean,
    alternativeLabels: Boolean,
    noHeaderNavigation: Boolean,
    contractable: Boolean,

    doneIcon: Boolean,
    activeIcon: Boolean,
    errorIcon: Boolean
  },

  data () {
    return {
      animation: null,
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
    },

    step (cur, old) {
      if (!this.vertical) {
        const
          curIndex = this.steps.findIndex(step => step.name === cur),
          oldIndex = this.steps.findIndex(step => step.name === old)

        this.animation = curIndex < oldIndex
          ? 'animate-fade-left'
          : (curIndex > oldIndex ? 'animate-fade-right' : null)
      }
    }
  },

  computed: {
    classes () {
      return {
        [`q-stepper--${this.vertical ? 'vertical' : 'horizontal'}`]: true,
        [`text-${this.color}`]: this.color,
        'q-stepper--flat no-shadow': this.flat || this.dark,
        'q-stepper--bordered': this.bordered || (this.dark && !this.flat),
        'q-stepper--contractable': this.contractable,
        'q-stepper--dark': this.dark
      }
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
        return this.currentStep.innerOrder
      }
    },

    length () {
      return this.steps.length
    }
  },

  methods: {
    goToStep (value) {
      if (this.step === value || value === void 0) {
        return
      }

      this.step = value

      this.$emit('input', value)
      this.$emit('step', value)
    },

    next () {
      this.__go(1)
    },

    previous () {
      this.__go(-1)
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
        if (index < 0 || index > this.length - 1 || this.steps[index].disable) {
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
      const last = this.steps.length - 1
      this.steps.forEach((step, index) => {
        step.innerOrder = index
        step.first = index === 0
        step.last = index === last
      })
      this.$nextTick(() => {
        if (!this.steps.some(step => step.active)) {
          this.goToStep(this.steps[0].name)
        }
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
  },

  render (h) {
    return h('div', {
      staticClass: 'q-stepper generic-border-radius column overflow-hidden relative-position',
      'class': this.classes
    }, [
      this.vertical
        ? null
        : h('div', {
          staticClass: 'q-stepper__header row items-stretch justify-between',
          'class': {
            'q-stepper__header--border': !this.flat || this.bordered,
            'q-stepper--alternative-labels': this.alternativeLabels
          }
        },
        this.steps.map(step => h(StepTab, {
          key: step.name,
          props: {
            vm: step
          }
        }))),
      this.$slots.default
    ])
  }
})
