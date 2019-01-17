import Vue from 'vue'

import QIcon from '../icon/QIcon.js'

export default Vue.extend({
  name: 'QAvatar',

  props: {
    size: String,
    fontSize: String,

    color: String,
    textColor: String,

    icon: String,
    square: Boolean,
    rounded: Boolean
  },

  computed: {
    contentClass () {
      return {
        [`bg-${this.color}`]: this.color,
        [`text-${this.textColor} q-chip--colored`]: this.textColor,
        'q-avatar__content--square': this.square,
        'generic-border-radius': this.rounded
      }
    },

    style () {
      if (this.size) {
        return { fontSize: this.size }
      }
    },

    contentStyle () {
      if (this.fontSize) {
        return { fontSize: this.fontSize }
      }
    }
  },

  methods: {
    __getContent (h) {
      return this.icon
        ? [ h(QIcon, { props: { name: this.icon } }) ].concat(this.$slots.default)
        : this.$slots.default
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-avatar relative-position',
      style: this.style
    }, [
      h('div', {
        staticClass: 'q-avatar__content row flex-center overflow-hidden',
        class: this.contentClass,
        style: this.contentStyle
      }, [
        this.__getContent(h)
      ])
    ])
  }
})
