import { computed, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default /*#__PURE__*/ createComponent({
  name: 'QTr',

  props: {
    props: Object,
    noHover: Boolean
  },

  setup(props, { slots }) {
    const classes = computed(
      () =>
        'q-tr' +
        (props.props === void 0 || props.props.header
          ? ''
          : ' ' + props.props.__trClass) +
        (props.noHover ? ' q-tr--no-hover' : '')
    )

    return () =>
      h(
        'tr',
        {
          style: props.props?.__trStyle,
          class: classes.value
        },
        hSlot(slots.default)
      )
  }
})
