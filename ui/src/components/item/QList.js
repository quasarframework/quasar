import { computed, h, provide } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import useQuasar from '../../composables/use-quasar/use-quasar.js'
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
    const $q = useQuasar()
    const isDark = useDark(props, $q)

    // the list semantics that QItem children derive their default role from
    provide(
      listKey,
      computed(() => (props.role !== void 0 ? props.role : 'list'))
    )

    return () =>
      h(
        props.tag,
        {
          class:
            'q-list' +
            (props.bordered ? ' q-list--bordered' : '') +
            (props.dense ? ' q-list--dense' : '') +
            (props.separator ? ' q-list--separator' : '') +
            (isDark() ? ' q-list--dark' : '') +
            (props.padding ? ' q-list--padding' : ''),
          role:
            props.role !== void 0
              ? props.role
              : roleAttrExceptions.includes(props.tag)
                ? null // ul/ol already have an implicit list role
                : 'list'
        },
        hSlot(slots.default)
      )
  }
})
