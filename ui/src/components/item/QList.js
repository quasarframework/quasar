import { computed, getCurrentInstance, h, provide } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import { listKey } from '../../utils/private.symbols/symbols.js'
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

    role: String,

    tag: {
      type: String,
      default: 'div'
    }
  },

  setup(props, { slots }) {
    const vm = getCurrentInstance()
    const isDark = useDark(props, vm.proxy.$q)

    const role = computed(() =>
      props.role !== void 0
        ? props.role
        : roleAttrExceptions.includes(props.tag)
          ? null // ul/ol already have an implicit list role
          : 'list'
    )

    // the list semantics that QItem children derive their default role from
    provide(
      listKey,
      computed(() => (props.role !== void 0 ? props.role : 'list'))
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
