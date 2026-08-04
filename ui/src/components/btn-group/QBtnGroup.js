import { computed, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default /*#__PURE__*/ createComponent({
  name: 'QBtnGroup',

  props: {
    unelevated: Boolean,
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    square: Boolean,
    push: Boolean,
    stretch: Boolean,
    glossy: Boolean,
    spread: Boolean
  },

  setup(props, { slots }) {
    const classes = computed(() => {
      const cls = [
        'unelevated',
        'outline',
        'flat',
        'rounded',
        'square',
        'push',
        'stretch',
        'glossy'
      ]
        .filter(t => props[t])
        .map(t => `q-btn-group--${t}`)
        .join(' ')

      return (
        `q-btn-group row no-wrap${cls.length !== 0 ? ' ' + cls : ''}` +
        (props.spread ? ' q-btn-group--spread' : ' inline')
      )
    })

    return () => h('div', { class: classes.value }, hSlot(slots.default))
  }
})
