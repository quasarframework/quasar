import { h, computed } from 'vue'

import { createComponent } from '../../utils/private/create.js'
import { hMergeSlot } from '../../utils/private/render.js'

const alignValues = [ 'top', 'middle', 'bottom' ]

export default createComponent({
  name: 'QBadge',

  props: {
    color: String,
    textColor: String,

    floating: Boolean,
    transparent: Boolean,
    multiLine: Boolean,
    outline: Boolean,
    rounded: Boolean,

    label: [ Number, String ],

    align: {
      type: String,
      validator: v => alignValues.includes(v)
    }
  },

  setup (props, { slots }) {
    const style = computed(() => {
      return props.align !== void 0
        ? { verticalAlign: props.align }
        : null
    })

    const classes = computed(() => {
      const text = props.outline === true
        ? props.color || props.textColor
        : props.textColor

      return 'q-badge flex inline items-center no-wrap'
        + ` q-badge--${ props.multiLine === true ? 'multi' : 'single' }-line`
        + (props.outline === true
          ? ' q-badge--outline'
          : (props.color !== void 0 ? ` bg-${ props.color }` : '')
        )
        + (text !== void 0 ? ` text-${ text }` : '')
        + (props.floating === true ? ' q-badge--floating' : '')
        + (props.rounded === true ? ' q-badge--rounded' : '')
        + (props.transparent === true ? ' q-badge--transparent' : '')
    })

    return () => h('div', {
      class: classes.value,
      style: style.value,
      role: 'status',
      'aria-label': props.label
    }, hMergeSlot(slots.default, props.label !== void 0 ? [ props.label ] : []))
  }
})
