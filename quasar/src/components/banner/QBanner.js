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
    const avatar = slot(this, 'avatar')
    const avatarRight = slot(this, 'avatar-right')

    return h('div', {
      staticClass: 'q-banner row items-center',
      class: {
        'q-banner--top-padding': actions !== void 0 && !this.inlineActions,
        'q-banner--dense': this.dense,
        'rounded-borders': this.rounded
      },
      on: this.$listeners
    }, [

      avatar !== void 0
        ? h('div', {
          staticClass: 'q-banner__avatar col-auto row items-center'
        }, slot(this, 'avatar'))
        : null,

      h('div', {
        staticClass: 'q-banner__content text-body2',
        class: avatarRight !== void 0 ? 'col' : 'col-auto'
      }, slot(this, 'default')),

      avatarRight !== void 0
        ? h('div', {
          staticClass: 'q-banner__avatar-right col-auto row items-center'
        }, avatarRight)
        : null,

      actions !== void 0
        ? h('div', {
          staticClass: 'q-banner__actions row items-center justify-end',
          class: this.inlineActions ? 'col' : 'col-all'
        }, actions)
        : null
    ])
  }
})
