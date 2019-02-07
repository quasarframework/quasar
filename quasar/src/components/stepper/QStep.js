import Vue from 'vue'

import QSlideTransition from '../slide-transition/QSlideTransition.js'
import { PanelChildMixin } from '../../mixins/panel.js'
import StepHeader from './StepHeader.js'

import slot from '../../utils/slot.js'

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
    color: String,
    title: {
      type: String,
      required: true
    },
    caption: String,

    doneIcon: String,
    doneColor: String,
    activeIcon: String,
    activeColor: String,
    errorIcon: String,
    errorColor: String,

    headerNav: {
      type: Boolean,
      default: true
    },
    done: Boolean,
    error: Boolean
  },

  computed: {
    isActive () {
      return this.stepper.value === this.name
    }
  },

  render (h) {
    const content = this.isActive
      ? h('div', {
        staticClass: 'q-stepper__step-content'
      }, [
        h('div', {
          staticClass: 'q-stepper__step-inner'
        }, slot(this, 'default'))
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
