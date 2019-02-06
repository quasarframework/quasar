import Vue from 'vue'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QBanner',

  props: {
    inlineActions: Boolean,
    dense: Boolean,
    rounded: Boolean
  },

  render (h) {
    const actions = slot(this, 'action')

    return h('div', {
      staticClass: 'q-banner row items-center',
      class: {
        'q-banner--top-padding': actions !== void 0 && !this.inlineActions,
        'q-banner--dense': this.dense,
        'rounded-borders': this.rounded
      }
    }, [

      h('div', {
        staticClass: 'q-banner__avatar col-auto row items-center'
      }, slot(this, 'avatar')),

      h('div', {
        staticClass: 'q-banner__content col text-body2'
      }, slot(this, 'default')),

      actions !== void 0
        ? h('div', {
          staticClass: 'q-banner__actions row items-center justify-end',
          class: this.inlineActions ? 'col-auto' : 'col-12'
        }, actions)
        : null

    ])
  }
})
