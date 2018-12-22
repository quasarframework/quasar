import Vue from 'vue'

export default Vue.extend({
  name: 'QBanner',

  props: {
    inlineActions: Boolean,
    dense: Boolean,
    rounded: Boolean
  },

  render (h) {
    const actions = this.$slots.action

    return h('div', {
      staticClass: 'q-banner row items-center',
      class: {
        'q-banner--top-padding': actions !== void 0 && !this.inlineActions,
        'q-banner--dense': this.dense,
        'generic-border-radius': this.rounded
      }
    }, [

      h('div', {
        staticClass: 'q-banner__avatar col-auto row items-center'
      }, this.$slots.avatar),

      h('div', {
        staticClass: 'q-banner__content col text-body2'
      }, this.$slots.default),

      actions !== void 0
        ? h('div', {
          staticClass: 'q-banner__actions row items-center justify-end',
          class: this.inlineActions ? 'col-auto' : 'col-12'
        }, actions)
        : null

    ])
  }
})
