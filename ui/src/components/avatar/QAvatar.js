import Vue from 'vue'

import SizeMixin from '../../mixins/size.js'
import QIcon from '../icon/QIcon.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QAvatar',

  mixins: [ SizeMixin ],

  props: {
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

    contentStyle () {
      if (this.fontSize) {
        return { fontSize: this.fontSize }
      }
    }
  },

  methods: {
    __getContent (h) {
      const def = slot(this, 'default')
      return this.icon !== void 0
        ? [ h(QIcon, { props: { name: this.icon } }) ].concat(def)
        : def
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-avatar',
      style: this.sizeStyle,
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
