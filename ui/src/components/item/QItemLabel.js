import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

// reference-stable line-clamp style objects, shared across instances
const lineClampCache = new Map()

function getLineClampStyle(lines) {
  let style = lineClampCache.get(lines)

  if (style === void 0) {
    if (lineClampCache.size > 100) lineClampCache.clear()
    style = {
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': lines
    }
    lineClampCache.set(lines, style)
  }

  return style
}

export default /*#__PURE__*/ createComponent({
  name: 'QItemLabel',

  props: {
    overline: Boolean,
    caption: Boolean,
    header: Boolean,
    lines: [Number, String]
  },

  setup(props, { slots }) {
    return () => {
      const lines = Number.parseInt(props.lines, 10)

      return h(
        'div',
        {
          style:
            props.lines !== void 0 && lines > 1
              ? getLineClampStyle(lines)
              : null,
          class:
            'q-item__label' +
            (props.overline ? ' q-item__label--overline text-overline' : '') +
            (props.caption ? ' q-item__label--caption text-caption' : '') +
            (props.header ? ' q-item__label--header' : '') +
            (lines === 1 ? ' ellipsis' : '')
        },
        hSlot(slots.default)
      )
    }
  }
})
