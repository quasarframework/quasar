import QIcon from '../icon/QIcon.js'
import QBtn from '../btn/QBtn.js'

export default {
  name: 'QAlert',
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
    },
    contentClass () {
      const multiple = this.actions.length > 1
      return `col-${multiple ? '12' : 'auto'}${multiple ? ' q-pt-none q-pr-none' : ''}`
    }
  },
  render (h) {
    const
      side = [],
      detail = this.$slots.detail || this.detail

    if (this.avatar) {
      side.push(
        h('img', {
          staticClass: 'avatar',
          attrs: { src: this.avatar }
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
        staticClass: 'q-alert generic-border-radius row',
        'class': this.classes
      }, [
        (side.length && h('div', {
          staticClass: 'q-alert__side col-auto row flex-center'
        }, side)) || void 0,
        h('div', {
          staticClass: 'q-alert__main col row'
        }, [
          h('div', { staticClass: 'q-alert__content col' }, [
            h('div', this.$slots.default || this.message),
            detail ? h('div', { staticClass: 'q-alert__detail' }, [ detail ]) : null
          ]),
          this.actions && this.actions.length
            ? h('div', {
              staticClass: 'q-alert__actions gutter-xs row items-center justify-end',
              'class': this.contentClass
            },
            this.actions.map(action =>
              h('div', [
                h(QBtn, {
                  props: {
                    flat: true,
                    align: 'left',
                    color: action.color,
                    icon: action.icon,
                    size: '12px',
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
    ])
  }
}
