import { QIcon } from '../icon'
import Ripple from '../../directives/ripple'

export default {
  name: 'q-step-header',
  components: {
    QIcon
  },
  directives: {
    Ripple
  },
  props: ['vm'],
  computed: {
    classes () {
      return {
        'step-error': this.vm.error,
        'step-active': this.vm.active,
        'step-done': this.vm.done,
        'step-waiting': this.vm.waiting,
        'step-disabled': this.vm.disable,
        'step-colored': this.vm.active || this.vm.done,
        'items-center': !this.vm.__stepper.vertical,
        'items-start': this.vm.__stepper.vertical,
        'q-stepper-first': this.vm.first,
        'q-stepper-last': this.vm.last
      }
    }
  },
  methods: {
    __select () {
      this.vm.select()
    }
  },
  render (h) {
    const icon = this.vm.stepIcon
      ? h(QIcon, { props: { name: this.vm.stepIcon } })
      : h('span', [ (this.vm.innerOrder + 1) ])

    return h('div', {
      staticClass: 'q-stepper-tab col-grow flex no-wrap relative-position',
      'class': this.classes,
      on: {
        click: this.__select
      },
      directives: __THEME__ === 'mat'
        ? [{
          name: 'ripple',
          value: this.vm.done
        }]
        : null
    }, [
      h('div', { staticClass: 'q-stepper-dot row flex-center q-stepper-line relative-position' }, [
        h('span', { staticClass: 'row flex-center' }, [ icon ])
      ]),
      this.vm.title
        ? h('div', {
          staticClass: 'q-stepper-label q-stepper-line relative-position'
        }, [
          h('div', { staticClass: 'q-stepper-title' }, [ this.vm.title ]),
          h('div', { staticClass: 'q-stepper-subtitle' }, [ this.vm.subtitle ])
        ])
        : null
    ])
  }
}
