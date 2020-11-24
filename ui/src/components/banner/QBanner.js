import { h, defineComponent } from 'vue'

import DarkMixin from '../../mixins/dark.js'

import { hSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QBanner',

  mixins: [DarkMixin],

  props: {
    inlineActions: Boolean,
    dense: Boolean,
    rounded: Boolean
  },

  computed: {
    classes () {
      return 'q-banner row items-center' +
        (this.dense === true ? ' q-banner--dense' : '') +
        (this.isDark === true ? ' q-banner--dark q-dark' : '') +
        (this.rounded === true ? ' rounded-borders' : '')
    },

    actionClass () {
      return 'q-banner__actions row items-center justify-end' +
        ` col-${this.inlineActions === true ? 'auto' : 'all'}`
    }
  },

  render () {
    const child = [
      h('div', {
        class: 'q-banner__avatar col-auto row items-center self-start'
      }, hSlot(this, 'avatar')),

      h('div', {
        class: 'q-banner__content col text-body2'
      }, hSlot(this, 'default'))
    ]

    const actions = hSlot(this, 'action')
    actions !== void 0 && child.push(
      h('div', { class: this.actionClass }, actions)
    )

    return h('div', {
      class: this.classes +
        (this.inlineActions === false && actions !== void 0 ? ' q-banner--top-padding' : ''),
      role: 'alert'
    }, child)
  }
})
