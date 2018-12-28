import Vue from 'vue'

import QIcon from '../icon/QIcon.js'
import Ripple from '../../directives/Ripple.js'

export default Vue.extend({
  name: 'StepHeader',

  directives: {
    Ripple
  },

  props: {
    stepper: {},
    step: {}
  },

  computed: {
    isActive () {
      return this.stepper.value === this.step.name
    },

    isDisable () {
      const opt = this.step.disable
      return opt === true || opt === ''
    },

    isError () {
      const opt = this.step.error
      return opt === true || opt === ''
    },

    isDone () {
      const opt = this.step.done
      return !this.isDisable && (opt === true || opt === '')
    },

    headerNav () {
      const
        opt = this.step.headerNav,
        nav = opt === true || opt === '' || opt === void 0

      return !this.isDisable && this.stepper.headerNav && (this.isActive || nav)
    },

    icon () {
      if (this.isActive) {
        return this.step.activeIcon || this.stepper.activeIcon || this.$q.icon.stepper.active
      }
      if (this.isError) {
        return this.step.errorIcon || this.stepper.errorIcon || this.$q.icon.stepper.error
      }
      if (!this.isDisable && this.isDone) {
        return this.step.doneIcon || this.stepper.doneIcon || this.$q.icon.stepper.done
      }

      return this.step.icon
    },

    color () {
      if (this.isActive) {
        return this.step.activeColor || this.stepper.activeColor || this.stepper.color
      }
      if (this.error) {
        return this.step.errorColor || this.stepper.errorColor
      }
      if (!this.disable && this.isDone) {
        return this.step.doneColor || this.stepper.doneColor || this.stepper.color
      }

      return this.step.color
    },

    classes () {
      return {
        [`text-${this.color}`]: this.color,
        'q-stepper__tab--error': this.isError,
        'q-stepper__tab--active': this.isActive,
        'q-stepper__tab--done': this.isDone,
        'q-stepper__tab--navigation q-focusable q-hoverable': this.headerNav,
        'q-stepper__tab--disabled': this.isDisable
      }
    }
  },

  methods: {
    activate () {
      this.$el.blur()
      !this.isActive && this.stepper.goTo(this.step.name)
    },
    keyup (e) {
      e.keyCode === 13 && !this.isActive && this.stepper.goTo(this.step.name)
    }
  },

  render (h) {
    const data = {
      staticClass: 'q-stepper__tab col-grow flex items-center no-wrap relative-position',
      class: this.classes,
      directives: this.stepper.headerNav ? [{
        name: 'ripple',
        value: this.headerNav
      }] : null
    }

    if (this.headerNav) {
      data.on = {
        click: this.activate,
        keyup: this.keyup
      }
      data.attrs = { tabindex: 0 }
    }

    return h('div', data, [
      h('div', { staticClass: 'q-focus-helper' }),

      h('div', { staticClass: 'q-stepper__dot row flex-center q-stepper__line relative-position' }, [
        h('span', { staticClass: 'row flex-center' }, [
          h(QIcon, { props: { name: this.icon } })
        ])
      ]),

      this.step.title
        ? h('div', {
          staticClass: 'q-stepper__label q-stepper__line relative-position'
        }, [
          h('div', { staticClass: 'q-stepper__title' }, [ this.step.title ]),
          this.step.caption
            ? h('div', { staticClass: 'q-stepper__caption' }, [ this.step.caption ])
            : null
        ])
        : null
    ])
  }
})
