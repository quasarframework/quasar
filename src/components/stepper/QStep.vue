<template>
  <div class="q-stepper-step">
    <step-tab
      v-if="__stepper.vertical"
      :vm="this"
    ></step-tab>

    <q-slide-transition>
      <div v-if="active" class="q-stepper-step-content">
        <div class="q-stepper-step-inner">
          <slot></slot>
        </div>
      </div>
    </q-slide-transition>
  </div>
</template>

<script>
import { QSlideTransition } from '../slide-transition'
import StepTab from './StepTab.vue'
import uid from '../../utils/uid'

export default {
  name: 'q-step',
  components: {
    QSlideTransition,
    StepTab
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
    disable: Boolean
  },
  inject: ['__stepper'],
  watch: {
    order () {
      this.__stepper.__sortSteps()
    }
  },
  data () {
    return {
      innerOrder: 0
    }
  },
  computed: {
    stepIcon () {
      const data = this.__stepper

      if (this.active) {
        return this.activeIcon || data.activeIcon
      }
      if (this.error) {
        return this.errorIcon || data.errorIcon
      }
      if (this.done && !this.disable) {
        return this.doneIcon || data.doneIcon
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
      return !this.disable && this.__stepper.currentOrder > this.actualOrder
    },
    waiting () {
      return !this.disable && this.__stepper.currentOrder < this.actualOrder
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
  }
}
</script>
