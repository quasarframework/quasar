import { QIcon } from '../icon'

export default {
  name: 'q-chip',
  props: {
    small: Boolean,
    tag: Boolean,
    square: Boolean,
    floating: Boolean,
    pointing: {
      type: String,
      validator: v => ['up', 'right', 'down', 'left'].includes(v)
    },
    color: String,
    icon: String,
    iconRight: String,
    avatar: String,
    closable: Boolean,
    detail: Boolean
  },
  computed: {
    classes () {
      const cls = [{
        tag: this.tag,
        square: this.square,
        floating: this.floating,
        pointing: this.pointing,
        small: this.small || this.floating
      }]
      this.pointing && cls.push(`pointing-${this.pointing}`)
      if (this.color) {
        cls.push(`bg-${this.color}`)
        cls.push(`text-white`)
      }
      return cls
    }
  },
  methods: {
    __onClick (e) {
      this.$emit('click', e)
    },
    __onMouseDown (e) {
      this.$emit('focus', e)
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-chip row no-wrap inline items-center',
      'class': this.classes,
      on: {
        mousedown: this.__onMouseDown,
        touchstart: this.__onMouseDown,
        click: this.__onClick
      }
    }, [
      this.icon || this.avatar
        ? h('div', {
          staticClass: 'q-chip-side chip-left row flex-center',
          'class': { 'chip-detail': this.detail }
        }, [
          this.icon
            ? h(QIcon, { props: { name: this.icon } })
            : (this.avatar ? h('img', { domProps: { src: this.avatar } }) : null)
        ])
        : null,

      h('div', { staticClass: 'q-chip-main' }, [
        this.$slots.default
      ]),

      this.iconRight
        ? h(QIcon, {
          props: { name: this.iconRight },
          staticClass: 'on-right'
        })
        : null,

      this.closable
        ? h('div', { staticClass: 'q-chip-side chip-right row flex-center' }, [
          h(QIcon, {
            props: { name: this.$q.icon.chip.close },
            staticClass: 'cursor-pointer',
            on: {
              click: e => {
                e && e.stopPropagation()
                this.$emit('hide')
              }
            }
          })
        ])
        : null
    ])
  }
}
