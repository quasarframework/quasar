import { h, defineComponent, computed } from 'vue'

import { hSlot } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QItemSection',

  props: {
    avatar: Boolean,
    thumbnail: Boolean,
    side: Boolean,
    top: Boolean,
    noWrap: Boolean
  },

  setup (props, { slots }) {
    const classes = computed(() =>
      'q-item__section column'
      + ` q-item__section--${ props.avatar === true || props.side === true || props.thumbnail === true ? 'side' : 'main' }`
      + (props.top === true ? ' q-item__section--top justify-start' : ' justify-center')
      + (props.avatar === true ? ' q-item__section--avatar' : '')
      + (props.thumbnail === true ? ' q-item__section--thumbnail' : '')
      + (props.noWrap === true ? ' q-item__section--nowrap' : '')
    )

    return () => h('div', { class: classes.value }, hSlot(slots.default))
  }
})
