import { computed, getCurrentInstance, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import { hSlot } from '../../utils/private.render/render.js'

const roleAttrExceptions = ['ul', 'ol']

export default /*#__PURE__*/ createComponent({
  name: 'QList',

  props: {
    ...useDarkProps,

    bordered: Boolean,
    dense: Boolean,
    separator: Boolean,
    padding: Boolean,

    tag: {
      type: String,
      default: 'div'
    }
  },

  setup(props, { slots }) {
    const vm = getCurrentInstance()
    const isDark = useDark(props, vm.proxy.$q)

    const role = computed(() =>
      roleAttrExceptions.includes(props.tag) ? null : 'list'
    )

    const classes = computed(
      () =>
        'q-list' +
        (props.bordered ? ' q-list--bordered' : '') +
        (props.dense ? ' q-list--dense' : '') +
        (props.separator ? ' q-list--separator' : '') +
        (isDark.value ? ' q-list--dark' : '') +
        (props.padding ? ' q-list--padding' : '')
    )

    return () =>
      h(
        props.tag,
        { class: classes.value, role: role.value },
        hSlot(slots.default)
      )
  }
})
