import { computed, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default /*#__PURE__*/ createComponent({
  name: 'QItemLabel',

  props: {
    overline: Boolean,
    caption: Boolean,
    header: Boolean,
    lines: [Number, String]
  },

  setup(props, { slots }) {
    const parsedLines = computed(() => Number.parseInt(props.lines, 10))

    const classes = computed(
      () =>
        'q-item__label' +
        (props.overline ? ' q-item__label--overline text-overline' : '') +
        (props.caption ? ' q-item__label--caption text-caption' : '') +
        (props.header ? ' q-item__label--header' : '') +
        (parsedLines.value === 1 ? ' ellipsis' : '')
    )

    const style = computed(() =>
      props.lines !== void 0 && parsedLines.value > 1
        ? {
            overflow: 'hidden',
            display: '-webkit-box',
            '-webkit-box-orient': 'vertical',
            '-webkit-line-clamp': parsedLines.value
          }
        : null
    )

    return () =>
      h(
        'div',
        {
          style: style.value,
          class: classes.value
        },
        hSlot(slots.default)
      )
  }
})
