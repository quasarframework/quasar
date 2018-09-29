import QIcon from '../icon/QIcon.js'
import Ripple from '../../directives/ripple.js'

import Vue from 'vue'
export default Vue.extend({
  name: 'QStepTab',

  directives: {
    Ripple
  },

  props: ['vm'],

  computed: {
    hasNavigation () {
      return !this.vm.__stepper.noHeaderNavigation
    },
    classes () {
      return {
        [`items-${this.vm.__stepper.vertical ? 'start' : 'center'}`]: true,
        'q-stepper__tab--error': this.vm.error,
        'q-stepper__tab--active': this.vm.active,
        'q-stepper__tab--done': this.vm.done,
        'q-stepper__tab--navigation q-focusable q-hoverable': this.vm.done && this.hasNavigation,
        'q-stepper__tab--waiting': this.vm.waiting,
        'q-stepper__tab--disabled': this.vm.disable,
        'q-stepper__tab--colored': this.vm.active || this.vm.done,
        'q-stepper__tab--first': this.vm.first,
        'q-stepper__tab--last': this.vm.last
      }
    }
  },

  methods: {
    __select () {
      if (this.hasNavigation) {
        this.vm.select()
      }
    }
  },

  render (h) {
    const icon = this.vm.stepIcon
      ? h(QIcon, { props: { name: this.vm.stepIcon } })
      : h('span', [ (this.vm.innerOrder + 1) ])

    return h('div', {
      staticClass: 'q-stepper__tab col-grow flex no-wrap relative-position',
      'class': this.classes,
      on: {
        click: this.__select
      },
      directives: this.hasNavigation
        ? [{
          name: 'ripple',
          value: this.vm.done
        }]
        : null
    }, [
      h('div', { staticClass: 'q-focus-helper' }),

      h('div', { staticClass: 'q-stepper__dot row flex-center q-stepper__line relative-position' }, [
        h('span', { staticClass: 'row flex-center' }, [ icon ])
      ]),

      this.vm.title
        ? h('div', {
          staticClass: 'q-stepper-label q-stepper__line relative-position'
        }, [
          h('div', { staticClass: 'q-stepper__title' }, [ this.vm.title ]),
          h('div', { staticClass: 'q-stepper__subtitle' }, [ this.vm.subtitle ])
        ])
        : null
    ])
  }
})
