import { h, defineComponent } from 'vue'

import { hSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QItemSection',

  props: {
    avatar: Boolean,
    thumbnail: Boolean,
    side: Boolean,
    top: Boolean,
    noWrap: Boolean
  },

  computed: {
    classes () {
      return 'q-item__section column' +
        ` q-item__section--${this.avatar === true || this.side === true || this.thumbnail === true ? 'side' : 'main'}` +
        (this.top === true ? ' q-item__section--top justify-start' : ' justify-center') +
        (this.avatar === true ? ' q-item__section--avatar' : '') +
        (this.thumbnail === true ? ' q-item__section--thumbnail' : '') +
        (this.noWrap === true ? ' q-item__section--nowrap' : '')
    }
  },

  render () {
    return h('div', { class: this.classes }, hSlot(this, 'default'))
  }
})
