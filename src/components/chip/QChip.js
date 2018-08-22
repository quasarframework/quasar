import QIcon from '../icon/QIcon.js'
import { getEventKey, stopAndPrevent } from '../../utils/event.js'

export default {
  name: 'QChip',
  props: {
    small: Boolean,
    dense: Boolean,
    tag: Boolean,
    square: Boolean,
    floating: Boolean,
    pointing: {
      type: String,
      validator: v => ['up', 'right', 'down', 'left'].includes(v)
    },
    color: String,
    textColor: String,
    icon: String,
    iconRight: String,
    avatar: String,
    closable: Boolean,
    detail: Boolean
  },
  computed: {
    classes () {
      const cls = []

      this.pointing && cls.push(`q-chip-pointing-${this.pointing}`)
      ;['tag', 'square', 'floating', 'pointing', 'small', 'dense'].forEach(prop => {
        this[prop] && cls.push(`q-chip-${prop}`)
      })
      if (this.floating) {
        !this.dense && cls.push('q-chip-dense')
        !this.square && cls.push('q-chip-square')
      }

      if (this.color) {
        cls.push(`bg-${this.color}`)
        !this.textColor && cls.push(`text-white`)
      }
      if (this.textColor) {
        cls.push(`text-${this.textColor}`)
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
    },
    __handleKeyDown (e) {
      if (this.closable && [8, 13, 32].includes(getEventKey(e))) {
        stopAndPrevent(e)
        this.$emit('hide')
      }
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-chip row no-wrap inline items-center',
      'class': this.classes,
      on: {
        mousedown: this.__onMouseDown,
        touchstart: this.__onMouseDown,
        click: this.__onClick,
        keydown: this.__handleKeyDown
      }
    }, [
      this.icon || this.avatar
        ? h('div', {
          staticClass: 'q-chip-side q-chip-left row flex-center',
          'class': { 'q-chip-detail': this.detail }
        }, [
          this.icon
            ? h(QIcon, { staticClass: 'q-chip-icon', props: { name: this.icon } })
            : (this.avatar ? h('img', { attrs: { src: this.avatar } }) : null)
        ])
        : null,

      h('div', { staticClass: 'q-chip-main ellipsis' }, this.$slots.default),

      this.iconRight
        ? h(QIcon, {
          props: { name: this.iconRight },
          'class': this.closable ? 'on-right q-chip-icon' : 'q-chip-side q-chip-right'
        })
        : null,

      this.closable
        ? h('div', { staticClass: 'q-chip-side q-chip-close q-chip-right row flex-center' }, [
          h(QIcon, {
            props: { name: this.$q.icon.chip.close },
            staticClass: 'cursor-pointer',
            nativeOn: {
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
