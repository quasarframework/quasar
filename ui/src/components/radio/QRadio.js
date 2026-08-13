import { getCurrentInstance, h, ref, toRaw } from 'vue'

import QIcon from '../icon/QIcon.js'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import { useSizeProps } from '../../composables/private.use-size/use-size.js'
import useRefocusTarget from '../../composables/private.use-refocus-target/use-refocus-target.js'
import {
  useFormInject,
  useFormProps
} from '../../composables/use-form/private.use-form.js'

import { createComponent } from '../../utils/private.create/create.js'
import { getOptionSizeStyle } from '../../utils/private.option-sizes/option-sizes.js'
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

export default /*#__PURE__*/ createComponent({
  name: 'QRadio',

  props: {
    ...useDarkProps,
    ...useSizeProps,
    ...useFormProps,

    modelValue: { required: true },
    val: { required: true },

    label: String,
    leftLabel: Boolean,

    checkedIcon: String,
    uncheckedIcon: String,

    color: String,
    keepColor: Boolean,
    dense: Boolean,

    disable: Boolean,
    tabindex: [String, Number]
  },

  emits: ['update:modelValue'],

  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const $q = useQuasar()

    const isDark = useDark(props, $q)

    const rootRef = ref(null)
    const { refocusTargetEl, refocusTarget } = useRefocusTarget(props, rootRef)

    function isTrue() {
      return toRaw(props.modelValue) === toRaw(props.val)
    }

    const formAttrs = () => {
      const prop = { type: 'radio' }

      if (props.name !== void 0) {
        Object.assign(prop, {
          // see https://vuejs.org/guide/extras/render-function.html#creating-vnodes (.prop)
          '.checked': isTrue(),
          '^checked': isTrue() ? 'checked' : void 0,
          name: props.name,
          value: props.val
        })
      }

      return prop
    }

    const injectFormInput = useFormInject(formAttrs)

    function onClick(e) {
      if (e !== void 0) {
        stopAndPrevent(e)
        refocusTarget(e)
      }

      if (!props.disable && !isTrue()) {
        emit('update:modelValue', props.val, e)
      }
    }

    function onKeyup(e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        onClick(e)
      }
    }

    // expose public methods
    Object.assign(proxy, { set: onClick })

    const svg = createSvg()

    return () => {
      const trueState = isTrue()
      const icon = (trueState ? props.checkedIcon : props.uncheckedIcon) || null

      const content =
        icon !== null
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
                    name: icon
                  })
                ]
              )
            ]
          : [svg]

      // the native input carries the value for a form submission (when a name
      // is supplied), but it is also what makes a wrapping <label> forward its
      // clicks to us, so it must be rendered even without a name
      if (!props.disable) {
        injectFormInput(
          content,
          'unshift',
          ' q-radio__native q-ma-none q-pa-none'
        )
      }

      const child = [
        h(
          'div',
          {
            class:
              'q-radio__inner relative-position ' +
              `q-radio__inner--${trueState ? 'truthy' : 'falsy'}` +
              (props.color !== void 0 && (props.keepColor || trueState)
                ? ` text-${props.color}`
                : ''),
            style: getOptionSizeStyle(props.size),
            'aria-hidden': 'true'
          },
          content
        )
      ]

      if (refocusTargetEl.value !== null) {
        child.push(refocusTargetEl.value)
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
          ref: rootRef,
          class:
            'q-radio cursor-pointer no-outline row inline no-wrap items-center' +
            (props.disable ? ' disabled' : '') +
            (isDark() ? ' q-radio--dark' : '') +
            (props.dense ? ' q-radio--dense' : '') +
            (props.leftLabel ? ' reverse' : ''),
          tabindex: props.disable ? -1 : props.tabindex || 0,
          role: 'radio',
          'aria-label': props.label,
          'aria-checked': trueState ? 'true' : 'false',
          'aria-disabled': props.disable ? 'true' : void 0,
          onClick,
          onKeydown,
          onKeyup
        },
        child
      )
    }
  }
})
