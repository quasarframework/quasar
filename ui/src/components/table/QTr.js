import { h, computed } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default createComponent({
  name: 'QTr',

  props: {
    props: Object,
    noHover: Boolean
  },

  setup (props, { slots }) {
    const classes = computed(() =>
      'q-tr'
      + (props.props === void 0 || props.props.header === true ? '' : ' ' + props.props.__trClass)
      + (props.noHover === true ? ' q-tr--no-hover' : '')
    )

    return () => h('tr', { class: classes.value }, hSlot(slots.default))
  }
})
