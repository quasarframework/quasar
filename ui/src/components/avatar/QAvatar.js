import Vue from 'vue'

import slot from '../../utils/slot.js'

import WIcon from '../icon/QIcon.js'

export default Vue.extend({
  name: 'WAvatar',

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
        'rounded-borders': this.rounded
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
      return this.icon !== void 0
        ? [ h(WIcon, { props: { name: this.icon } }) ].concat(slot(this, 'default'))
        : slot(this, 'default')
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-avatar',
      style: this.style,
      on: this.$listeners
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
