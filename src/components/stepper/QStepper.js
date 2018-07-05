import StepTab from './StepTab.js'
import frameDebounce from '../../utils/frame-debounce.js'

export default {
  name: 'QStepper',
  components: {
    StepTab
  },
  props: {
    value: [Number, String],
    color: {
      type: String,
      default: 'primary'
    },
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
        `q-stepper-${this.vertical ? 'vertical' : 'horizontal'}`,
        `text-${this.color}`
      ]
      this.contractable && cls.push(`q-stepper-contractable`)
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
      this.$nextTick(() => {
        if (JSON.stringify(value) !== JSON.stringify(this.value)) {
          this.$emit('change', value)
        }
      })
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
      staticClass: 'q-stepper column overflow-hidden relative-position',
      'class': this.classes
    }, [
      this.vertical
        ? null
        : h('div', {
          staticClass: 'q-stepper-header row items-stretch justify-between shadow-1',
          'class': { 'alternative-labels': this.alternativeLabels }
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
}
