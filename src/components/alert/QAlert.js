import typeIcon from '../../utils/type-icons'
import { QIcon } from '../icon'

export default {
  name: 'q-alert',
  props: {
    type: {
      type: String,
      validator: v => ['positive', 'negative', 'warning', 'info'].includes(v)
    },
    color: {
      type: String,
      default: 'negative'
    },
    textColor: String,
    icon: String,
    avatar: String,
    actions: Array,
    message: String
  },
  computed: {
    computedIcon () {
      return this.icon
        ? this.icon
        : typeIcon[this.type || this.color]
    },
    classes () {
      let cls = `bg-${this.type || this.color}`
      if (this.textColor) {
        cls += ` text-${this.textColor}`
      }
      return cls
    }
  },
  render (h) {
    const side = []

    if (this.avatar) {
      side.push(
        h('img', {
          staticClass: 'avatar',
          domProps: { src: this.avatar }
        })
      )
    }
    else if (this.icon || this.type) {
      side.push(
        h(QIcon, {
          props: { name: this.computedIcon }
        })
      )
    }

    return h('div', [
      h('div', {
        staticClass: 'q-alert row no-wrap shadow-4',
        'class': this.classes
      }, [
        side.length
          ? h('div', { staticClass: 'q-alert-side row col-auto flex-center' }, side)
          : null,
        h('div', {
          staticClass: 'q-alert-content col self-center'
        }, [
          this.$slots.default || this.message,
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
