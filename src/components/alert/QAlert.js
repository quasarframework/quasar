import typeIcon from '../../utils/type-icons'
import { QIcon } from '../icon'

export default {
  name: 'q-alert',
  props: {
    color: {
      type: String,
      default: 'negative'
    },
    textColor: String,
    icon: String,
    actions: Array
  },
  computed: {
    alertIcon () {
      return this.icon || typeIcon[this.color] || typeIcon.warning
    },
    classes () {
      let cls = `bg-${this.color}`
      if (this.textColor) {
        cls += ` text-${this.textColor}`
      }
      return cls
    }
  },
  render (h) {
    return h('div', [
      h('div', {
        staticClass: 'q-alert row no-wrap shadow-2',
        'class': this.classes
      }, [
        h('div', {
          staticClass: 'q-alert-side row col-auto flex-center'
        }, [
          h(QIcon, {
            props: { name: this.alertIcon }
          })
        ]),
        h('div', {
          staticClass: 'q-alert-content col self-center'
        }, [
          this.$slots.default,
          this.actions && this.actions.length
            ? h('div', { staticClass: 'q-alert-actions row items-center' },
              this.actions.map(action =>
                h('span', {
                  on: {
                    click: () => action.handler()
                  }
                }, [ action.label ])
              )
            )
            : null
        ])
      ])
    ])
  }
}
