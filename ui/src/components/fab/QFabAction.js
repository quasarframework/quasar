import { computed, getCurrentInstance, h, inject } from 'vue'

import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'

import useFab, { getFabBtnProps, useFabProps } from './use-fab.js'

import { createComponent } from '../../utils/private.create/create.js'
import { fabKey } from '../../utils/private.symbols/symbols.js'
import { hMergeSlot } from '../../utils/private.render/render.js'
import { noop } from '../../utils/event/event.js'

const anchorMap = {
  start: 'self-end',
  center: 'self-center',
  end: 'self-start'
}

const anchorValues = Object.keys(anchorMap)

export default /*#__PURE__*/ createComponent({
  name: 'QFabAction',

  props: {
    ...useFabProps,

    icon: {
      type: String,
      default: ''
    },

    anchor: {
      type: String,
      validator: v => anchorValues.includes(v)
    },

    to: [String, Object],
    replace: Boolean
  },

  emits: ['click'],

  setup(props, { slots, emit }) {
    // the factory flag is required: without it Vue injects this function
    // as-is, leaving a QFabAction used outside a QFab with no fallback
    const $fab = inject(
      fabKey,
      () => ({
        showing: { value: true },
        onChildClick: noop
      }),
      true
    )

    const { formClass, stacked, labelProps } = useFab(props, $fab.showing)

    const classes = computed(() => {
      const align = anchorMap[props.anchor]
      return formClass.value + (align !== void 0 ? ` ${align}` : '')
    })

    const isDisabled = computed(() => props.disable || !$fab.showing.value)

    function click(e) {
      $fab.onChildClick(e)
      emit('click', e)
    }

    function getContent() {
      const child = []

      if (slots.icon !== void 0) {
        child.push(slots.icon())
      } else if (props.icon !== '') {
        child.push(h(QIcon, { name: props.icon }))
      }

      if (props.label !== '' || slots.label !== void 0) {
        child[labelProps.value.action](
          h(
            'div',
            labelProps.value.data,
            slots.label !== void 0 ? slots.label() : [props.label]
          )
        )
      }

      return hMergeSlot(slots.default, child)
    }

    // expose public methods
    const vm = getCurrentInstance()
    Object.assign(vm.proxy, { click })

    return () =>
      h(
        QBtn,
        {
          class: classes.value,
          ...getFabBtnProps(props),
          to: props.to,
          replace: props.replace,
          noWrap: true,
          stack: stacked.value,
          noCaps: true,
          fabMini: true,
          disable: isDisabled.value,
          onClick: click
        },
        getContent
      )
  }
})
