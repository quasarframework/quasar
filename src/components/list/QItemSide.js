import { QIcon } from '../icon'

export default {
  name: 'q-item-side',
  props: {
    right: Boolean,

    icon: String,
    inverted: Boolean,

    avatar: String,
    letter: {
      type: String,
      validator: v => v.length === 1
    },
    image: String,
    stamp: String,

    color: String,
    tag: {
      type: String,
      default: 'div'
    }
  },
  computed: {
    classes () {
      return [
        `q-item-side-${this.right ? 'right' : 'left'}`,
        `${this.color ? `text-${this.color}` : ''}`,
        this.image ? 'q-item-image' : ''
      ]
    },
    subClasses () {
      return {
        'q-item-letter-inverted': this.inverted,
        [`bg-${this.color}`]: this.color && this.inverted
      }
    }
  },
  render (h) {
    const data = {
      staticClass: 'q-item-side q-item-section',
      'class': this.classes
    }

    if (this.image) {
      data.attrs = { src: this.image }
      return h('img', data)
    }

    return h(this.tag, data, [
      this.stamp
        ? h('div', { staticClass: 'q-item-stamp' }, [
          this.stamp
        ])
        : null,

      this.icon
        ? h(QIcon, {
          props: { name: this.icon },
          staticClass: 'q-item-icon',
          'class': this.subClasses
        })
        : null,

      this.avatar
        ? h('img', {
          staticClass: 'q-item-avatar',
          attrs: { src: this.avatar }
        })
        : null,

      this.letter
        ? h('div', {
          staticClass: 'q-item-letter',
          'class': this.subClasses
        }, [ this.letter ])
        : null,

      this.$slots.default
    ])
  }
}
