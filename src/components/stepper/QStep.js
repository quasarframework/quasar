import Vue from 'vue'

import QSlideTransition from '../slide-transition/QSlideTransition.js'
import { PanelChildMixin } from '../../mixins/panel.js'
import StepHeader from './StepHeader.js'

export default Vue.extend({
  name: 'QStep',

  inject: {
    stepper: {
      default () {
        console.error('QStep needs to be child of QStepper')
      }
    }
  },

  mixins: [ PanelChildMixin ],

  props: {
    icon: String,
    title: {
      type: String,
      required: true
    },
    caption: String,

    activeIcon: String,
    errorIcon: String,

    error: Boolean
  },

  computed: {
    isActive () {
      return this.stepper.value === this.name
    },

    stepIcon () {
      if (this.isActive) {
        return this.activeIcon || this.stepper.activeIcon || this.$q.icon.stepper.active
      }
      if (this.error) {
        return this.errorIcon || this.stepper.errorIcon || this.$q.icon.stepper.error
      }

      return this.icon
    }
  },

  render (h) {
    const content = this.isActive
      ? h('div', {
        staticClass: 'q-stepper__step-content'
      }, [
        h('div', {
          staticClass: 'q-stepper__step-inner'
        }, this.$slots.default)
      ])
      : null

    return h('div', {
      staticClass: 'q-stepper__step'
    }, [
      this.stepper.vertical
        ? h(StepHeader, {
          props: {
            stepper: this.stepper,
            step: this
          }
        })
        : null,

      this.stepper.vertical && this.stepper.animated
        ? h(QSlideTransition, [ content ])
        : content
    ])
  }
})
