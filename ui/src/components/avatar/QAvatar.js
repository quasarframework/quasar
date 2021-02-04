import Vue from 'vue'

import QIcon from '../icon/QIcon.js'

import SizeMixin from '../../mixins/size.js'
import ListenersMixin from '../../mixins/listeners.js'

import { mergeSlotSafely } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QAvatar',

  mixins: [ ListenersMixin, SizeMixin ],

  props: {
    fontSize: String,

    color: String,
    textColor: String,

    icon: String,
    square: Boolean,
    rounded: Boolean
  },

  computed: {
    classes () {
      return {
        [`bg-${this.color}`]: this.color,
        [`text-${this.textColor} q-chip--colored`]: this.textColor,
        'q-avatar--square': this.square,
        'rounded-borders': this.rounded
      }
    },

    contentStyle () {
      if (this.fontSize) {
        return { fontSize: this.fontSize }
      }
    }
  },

  render (h) {
    const icon = this.icon !== void 0
      ? [ h(QIcon, { props: { name: this.icon } }) ]
      : void 0

    return h('div', {
      staticClass: 'q-avatar',
      style: this.sizeStyle,
      class: this.classes,
      on: { ...this.qListeners }
    }, [
      h('div', {
        staticClass: 'q-avatar__content row flex-center overflow-hidden',
        style: this.contentStyle
      }, mergeSlotSafely(icon, this, 'default'))
    ])
  }
})
