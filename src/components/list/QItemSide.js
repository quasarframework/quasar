import { QIcon } from '../icon'

export default {
  name: 'QItemSide',
  props: {
    right: Boolean,

    icon: String,
    letter: {
      type: String,
      validator: v => v.length === 1
    },
    inverted: Boolean, // for icon and letter only

    avatar: String,
    image: String,
    stamp: String,

    color: String,
    textColor: String // only for inverted icon/letter
  },
  computed: {
    type () {
      return ['icon', 'image', 'avatar', 'letter', 'stamp'].find(type => this[type])
    },
    classes () {
      const cls = [ `q-item-side-${this.right ? 'right' : 'left'}` ]

      if (this.color && (!this.icon && !this.letter)) {
        cls.push(`text-${this.color}`)
      }

      return cls
    },
    typeClasses () {
      const cls = [ `q-item-${this.type}` ]

      if (this.color) {
        if (this.inverted && (this.icon || this.letter)) {
          cls.push(`bg-${this.color}`)
        }
        else if (!this.textColor) {
          cls.push(`text-${this.color}`)
        }
      }
      this.textColor && cls.push(`text-${this.textColor}`)

      if (this.inverted && (this.icon || this.letter)) {
        cls.push('q-item-inverted')
        cls.push('flex')
        cls.push('flex-center')
      }

      return cls
    },
    imagePath () {
      return this.image || this.avatar
    }
  },
  render (h) {
    let child

    if (this.type) {
      if (this.icon) {
        child = h(QIcon, {
          'class': this.inverted ? null : this.typeClasses,
          props: { name: this.icon }
        })

        if (this.inverted) {
          child = h('div', {
            'class': this.typeClasses
          }, [ child ])
        }
      }
      else if (this.imagePath) {
        child = h('img', {
          'class': this.typeClasses,
          attrs: { src: this.imagePath }
        })
      }
      else {
        child = h('div', { 'class': this.typeClasses }, [ this.stamp || this.letter ])
      }
    }

    return h('div', {
      staticClass: 'q-item-side q-item-section',
      'class': this.classes
    }, [
      child,
      this.$slots.default
    ])
  }
}
