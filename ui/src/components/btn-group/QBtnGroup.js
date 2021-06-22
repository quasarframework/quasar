import { h, defineComponent, computed } from 'vue'

import { hSlot } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QBtnGroup',

  props: {
    unelevated: Boolean,
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    push: Boolean,
    stretch: Boolean,
    glossy: Boolean,
    spread: Boolean
  },

  setup (props, { slots }) {
    const classes = computed(() => {
      const cls = [ 'unelevated', 'outline', 'flat', 'rounded', 'push', 'stretch', 'glossy' ]
        .filter(t => props[ t ] === true)
        .map(t => `q-btn-group--${ t }`).join(' ')

      return `q-btn-group row no-wrap${ cls.length > 0 ? ' ' + cls : '' }`
        + (props.spread === true ? ' q-btn-group--spread' : ' inline')
    })

    return () => h('div', { class: classes.value }, hSlot(slots.default))
  }
})
