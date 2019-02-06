import Vue from 'vue'

import slot from '../../utils/slot.js'

export default Vue.extend({
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
      const side = this.avatar || this.side || this.thumbnail

      return {
        'q-item__section--top': this.top,
        'q-item__section--avatar': this.avatar,
        'q-item__section--thumbnail': this.thumbnail,
        'q-item__section--side': side,
        'q-item__section--nowrap': this.noWrap,
        [`q-item__section--main col`]: !side,
        [`justify-${this.top ? 'start' : 'center'}`]: true
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-item__section column',
      class: this.classes
    }, slot(this, 'default'))
  }
})
