import { getCurrentInstance, h } from 'vue'

import QIcon from '../icon/QIcon.js'

import useRadio, { useRadioEmits, useRadioProps } from './use-radio.js'
import { createComponent } from '../../utils/private.create/create.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import { hMergeSlot, hSlot } from '../../utils/private.render/render.js'

const createSvg = () =>
  h(
    'svg',
    {
      key: 'svg',
      class: 'q-radio__bg absolute non-selectable',
      viewBox: '0 0 24 24'
    },
    [
      h('path', {
        d: 'M12,22a10,10 0 0 1 -10,-10a10,10 0 0 1 10,-10a10,10 0 0 1 10,10a10,10 0 0 1 -10,10m0,-22a12,12 0 0 0 -12,12a12,12 0 0 0 12,12a12,12 0 0 0 12,-12a12,12 0 0 0 -12,-12'
      }),

      h('path', {
        class: 'q-radio__check',
        d: 'M12,6a6,6 0 0 0 -6,6a6,6 0 0 0 6,6a6,6 0 0 0 6,-6a6,6 0 0 0 -6,-6'
      })
    ]
  )

function onKeydown(e) {
  if (e.keyCode === 13 || e.keyCode === 32) {
    stopAndPrevent(e)
  }
}

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/radio
 */
/**
 * Default slot can be used as label, unless 'label' prop is specified; Suggestion: string
 *
 * @api slot default
 */
export default createComponent({
  name: 'QRadio',

  props: useRadioProps,

  emits: useRadioEmits,

  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const radio = useRadio(props, proxy, emit)

    // expose public methods
    Object.assign(proxy, { set: radio.onClick })

    const svg = createSvg()

    return () => {
      const content =
        radio.icon.value !== null
          ? [
              h(
                'div',
                {
                  key: 'icon',
                  class:
                    'q-radio__icon-container absolute-full flex flex-center no-wrap'
                },
                [
                  h(QIcon, {
                    class: 'q-radio__icon',
                    name: radio.icon.value
                  })
                ]
              )
            ]
          : [svg]

      if (!props.disable) {
        radio.injectFormInput(
          content,
          'unshift',
          ' q-radio__native q-ma-none q-pa-none'
        )
      }

      const child = [
        h(
          'div',
          {
            class: radio.innerClass.value,
            style: radio.sizeStyle.value,
            'aria-hidden': 'true'
          },
          content
        )
      ]

      if (radio.refocusTargetEl.value !== null) {
        child.push(radio.refocusTargetEl.value)
      }

      const label =
        props.label !== void 0
          ? hMergeSlot(slots.default, [props.label])
          : hSlot(slots.default)

      if (label !== void 0) {
        child.push(
          h(
            'div',
            {
              class: 'q-radio__label q-anchor--skip'
            },
            label
          )
        )
      }

      return h(
        'div',
        {
          ref: radio.rootRef,
          class: radio.classes.value,
          tabindex: radio.tabindex.value,
          role: 'radio',
          'aria-label': props.label,
          'aria-checked': radio.isTrue.value ? 'true' : 'false',
          'aria-disabled': props.disable ? 'true' : void 0,
          onClick: radio.onClick,
          onKeydown,
          onKeyup: radio.onKeyup
        },
        child
      )
    }
  }
})
