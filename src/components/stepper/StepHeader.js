import Vue from 'vue'

import QIcon from '../icon/QIcon.js'
import Ripple from '../../directives/ripple.js'

export default Vue.extend({
  directives: {
    Ripple
  },

  props: {
    stepper: {},
    step: {}
  },

  computed: {
    isDisable () {
      const opt = this.step.disable
      return opt === true || opt === ''
    },
    isError () {
      const opt = this.step.error
      return opt === true || opt === ''
    },
    isActive () {
      return this.stepper.value === this.step.name
    },
    headerNavigation () {
      return !this.isDisable && this.stepper.headerNavigation
    },
    icon () {
      if (this.isActive) {
        return this.step.activeIcon || this.stepper.activeIcon || this.$q.icon.stepper.active
      }
      if (this.isError) {
        return this.step.errorIcon || this.stepper.errorIcon || this.$q.icon.stepper.error
      }

      return this.step.icon
    },

    classes () {
      return {
        [`items-${this.stepper.vertical ? 'start' : 'center'}`]: true,
        'q-stepper__tab--error': this.isError,
        'q-stepper__tab--active': this.isActive,
        'q-stepper__tab--navigation q-focusable q-hoverable': this.headerNavigation,
        'q-stepper__tab--disabled': this.isDisable
      }
    }
  },

  methods: {
    activate () {
      this.stepper.goTo(this.step.name)
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-stepper__tab col-grow flex no-wrap relative-position',
      'class': this.classes,
      on: this.headerNavigation
        ? { click: this.activate }
        : null,
      directives: this.headerNavigation
        ? [{ name: 'ripple' }]
        : null
    }, [
      h('div', { staticClass: 'q-focus-helper' }),

      h('div', { staticClass: 'q-stepper__dot row flex-center q-stepper__line relative-position' }, [
        h('span', { staticClass: 'row flex-center' }, [
          h(QIcon, { props: { name: this.icon } })
        ])
      ]),

      this.step.title
        ? h('div', {
          staticClass: 'q-stepper-label q-stepper__line relative-position'
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
