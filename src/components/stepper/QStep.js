import QSlideTransition from '../slide-transition/QSlideTransition.js'
import StepTab from './StepTab.js'
import uid from '../../utils/uid.js'

export default {
  name: 'QStep',
  inject: {
    __stepper: {
      default () {
        console.error('QStep needs to be child of QStepper')
      }
    }
  },
  props: {
    name: {
      type: [Number, String],
      default () {
        return uid()
      }
    },
    default: Boolean,
    title: {
      type: String,
      required: true
    },
    subtitle: String,
    icon: String,
    order: [Number, String],
    error: Boolean,
    activeIcon: String,
    errorIcon: String,
    doneIcon: String,
    disable: Boolean
  },
  watch: {
    order () {
      this.__stepper.__sortSteps()
    }
  },
  data () {
    return {
      innerOrder: 0,
      first: false,
      last: false
    }
  },
  computed: {
    stepIcon () {
      const data = this.__stepper

      if (this.active) {
        return this.activeIcon || data.activeIcon || this.$q.icon.stepper.active
      }
      if (this.error) {
        return this.errorIcon || data.errorIcon || this.$q.icon.stepper.error
      }
      if (this.done && !this.disable) {
        return this.doneIcon || data.doneIcon || this.$q.icon.stepper.done
      }

      return this.icon
    },
    actualOrder () {
      return parseInt(this.order || this.innerOrder, 10)
    },
    active () {
      return this.__stepper.step === this.name
    },
    done () {
      return !this.disable && this.__stepper.currentOrder > this.innerOrder
    },
    waiting () {
      return !this.disable && this.__stepper.currentOrder < this.innerOrder
    },
    style () {
      const ord = this.actualOrder
      return {
        '-webkit-box-ordinal-group': ord,
        '-ms-flex-order': ord,
        order: ord
      }
    }
  },
  methods: {
    select () {
      if (this.done) {
        this.__stepper.goToStep(this.name)
      }
    }
  },
  mounted () {
    this.__stepper.__registerStep(this)
    if (this.default) {
      this.select()
    }
  },
  beforeDestroy () {
    this.__stepper.__unregisterStep(this)
  },
  render (h) {
    return h('div', {
      staticClass: 'q-stepper-step',
      style: this.style
    }, [
      this.__stepper.vertical
        ? h(StepTab, { props: { vm: this } })
        : null,
      h(QSlideTransition, [
        this.active
          ? h('div', {
            staticClass: 'q-stepper-step-content'
          }, [
            h('div', {
              staticClass: 'q-stepper-step-inner'
            }, this.$slots.default)
          ])
          : null
      ])
    ])
  }
}
