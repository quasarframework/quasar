import { QIcon } from '../icon'
import { QBtn } from '../btn'

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
    message: String,
    detail: String,
    icon: String,
    avatar: String,
    actions: Array
  },
  computed: {
    computedIcon () {
      return this.icon
        ? this.icon
        : this.$q.icon.type[this.type || this.color]
    },
    classes () {
      return `bg-${this.type || this.color} text-${this.textColor || 'white'}`
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
        staticClass: 'q-alert row no-wrap shadow-2',
        'class': this.classes
      }, [
        side.length
          ? h('div', { staticClass: 'q-alert-side row col-auto flex-center' }, side)
          : null,
        h('div', {
          staticClass: 'q-alert-content col self-center'
        }, [
          h('div', this.$slots.default || this.message),
          this.detail ? h('div', { staticClass: 'q-alert-detail' }, [ this.detail ]) : null
        ]),
        this.actions && this.actions.length
          ? h('div', {
            staticClass: 'q-alert-actions col-auto xs-gutter flex-center'
          },
          this.actions.map(action =>
            h('div', [
              h(QBtn, {
                props: {
                  flat: true,
                  compact: true,
                  icon: action.icon,
                  label: action.closeBtn === true
                    ? (typeof action.label === 'string' ? action.label : this.$q.i18n.label.close)
                    : action.label
                },
                on: {
                  click: () => action.handler()
                }
              })
            ])
          ))
          : null
      ])
    ])
  }
}
