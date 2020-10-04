import { h, defineComponent } from 'vue'

import QIcon from '../icon/QIcon.js'

import SizeMixin from '../../mixins/size.js'

import { hMergeSlotSafely } from '../../utils/render.js'

export default defineComponent({
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
    classes () {
      return 'q-avatar' +
        (this.color ? ` bg-${this.color}` : '') +
        (this.textColor ? ` text-${this.textColor} q-chip--colored` : '') +
        (
          this.square === true
            ? ' q-avatar--square'
            : (this.rounded === true ? ' rounded-borders' : '')
        )
    },

    contentStyle () {
      if (this.fontSize) {
        return { fontSize: this.fontSize }
      }
    }
  },

  render () {
    const icon = this.icon !== void 0
      ? [ h(QIcon, { name: this.icon }) ]
      : void 0

    return h('div', {
      class: this.classes,
      style: this.sizeStyle
    }, [
      h('div', {
        class: 'q-avatar__content row flex-center overflow-hidden',
        style: this.contentStyle
      }, hMergeSlotSafely(icon, this, 'default'))
    ])
  }
})
