import { computed, h, ref, toRaw } from 'vue'

import QRadio from '../radio/QRadio.js'
import QCheckbox from '../checkbox/QCheckbox.js'
import QToggle from '../toggle/QToggle.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stopAndPrevent } from '../../utils/event/event.js'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import { isObject } from '../../utils/is/is.js'

const components = {
  radio: QRadio,
  checkbox: QCheckbox,
  toggle: QToggle
}

const typeValues = Object.keys(components)

function getPropValueFn(userPropName, defaultPropName) {
  if (typeof userPropName === 'function') return userPropName

  const propName = userPropName !== void 0 ? userPropName : defaultPropName

  return opt => opt[propName]
}

export default /*#__PURE__*/ createComponent({
  name: 'QOptionGroup',

  props: {
    ...useDarkProps,

    modelValue: {
      required: true
    },
    options: {
      type: Array,
      validator: opts => opts.every(isObject),
      default: () => []
    },

    optionValue: [Function, String],
    optionLabel: [Function, String],
    optionDisable: [Function, String],

    name: String,

    type: {
      type: String,
      default: 'radio',
      validator: v => typeValues.includes(v)
    },

    color: String,
    keepColor: Boolean,
    dense: Boolean,

    size: String,

    leftLabel: Boolean,
    inline: Boolean,
    disable: Boolean
  },

  emits: ['update:modelValue'],

  setup(props, { emit, slots }) {
    const $q = useQuasar()

    const arrayModel = Array.isArray(props.modelValue)

    if (props.type === 'radio') {
      if (arrayModel) {
        console.error('q-option-group: model should not be array')
      }
    } else if (!arrayModel) {
      console.error('q-option-group: model should be array in your case')
    }

    const isDark = useDark(props, $q)
    const component = computed(() => components[props.type])

    const rootRef = ref(null)

    const getOptionValue = computed(() =>
      getPropValueFn(props.optionValue, 'value')
    )
    const getOptionLabel = computed(() =>
      getPropValueFn(props.optionLabel, 'label')
    )
    const getOptionDisable = computed(() =>
      getPropValueFn(props.optionDisable, 'disable')
    )

    const innerOptions = computed(() =>
      props.options.map(opt => ({
        val: getOptionValue.value(opt),
        name: opt.name === void 0 ? props.name : opt.name,
        disable: props.disable || getOptionDisable.value(opt),
        leftLabel: opt.leftLabel === void 0 ? props.leftLabel : opt.leftLabel,
        color: opt.color === void 0 ? props.color : opt.color,
        checkedIcon: opt.checkedIcon,
        uncheckedIcon: opt.uncheckedIcon,
        dark: opt.dark === void 0 ? isDark.value : opt.dark,
        size: opt.size === void 0 ? props.size : opt.size,
        dense: props.dense,
        keepColor: opt.keepColor === void 0 ? props.keepColor : opt.keepColor
      }))
    )

    // the single tab stop of the radiogroup (roving tabindex):
    // the checked radio, or the first enabled one when there is
    // no (enabled) checked radio
    const tabStopIndex = computed(() => {
      const model = toRaw(props.modelValue)
      const list = innerOptions.value
      const index = list.findIndex(
        opt => !opt.disable && toRaw(opt.val) === model
      )

      return index !== -1 ? index : list.findIndex(opt => !opt.disable)
    })

    const classes = computed(
      () =>
        'q-option-group q-gutter-x-sm' +
        (props.inline ? ' q-option-group--inline' : '')
    )

    const attrs = computed(() => {
      const acc = { role: 'group' }

      if (props.type === 'radio') {
        acc.role = 'radiogroup'

        if (props.disable) {
          acc['aria-disabled'] = 'true'
        }
      }

      return acc
    })

    function onUpdateModelValue(value) {
      emit('update:modelValue', value)
    }

    // WAI-ARIA radiogroup pattern: arrow keys move focus inside
    // the group (wrapping, skipping disabled radios) and also
    // select the newly focused radio
    function onKeydown(e) {
      const dirKey =
        e.keyCode === 37 /* ArrowLeft */ || e.keyCode === 38 /* ArrowUp */
          ? -1
          : e.keyCode === 39 /* ArrowRight */ ||
              e.keyCode === 40 /* ArrowDown */
            ? 1
            : 0

      if (dirKey === 0) return

      const radioEls = rootRef.value.getElementsByClassName('q-radio')
      const startIndex = Array.prototype.indexOf.call(radioEls, e.target)
      if (startIndex === -1) return

      stopAndPrevent(e)

      const dir =
        (e.keyCode === 37 || e.keyCode === 39) && $q.lang.rtl === true
          ? -dirKey
          : dirKey

      const list = innerOptions.value
      const len = list.length

      let index = startIndex
      do {
        index = (index + dir + len) % len
      } while (index !== startIndex && list[index].disable)

      if (index !== startIndex) {
        radioEls[index].focus()

        if (toRaw(list[index].val) !== toRaw(props.modelValue)) {
          emit('update:modelValue', list[index].val)
        }
      }
    }

    return () =>
      h(
        'div',
        {
          ref: rootRef,
          class: classes.value,
          ...attrs.value,
          onKeydown: props.type === 'radio' ? onKeydown : void 0
        },
        props.options.map((opt, i) => {
          // TODO: (Qv3) Make the 'opt' a separate property instead of
          // the whole scope for consistency and flexibility
          // (e.g. { opt } instead of opt)
          const child =
            slots['label-' + i] !== void 0
              ? () => slots['label-' + i](opt)
              : slots.label !== void 0
                ? () => slots.label(opt)
                : void 0

          return h('div', [
            h(
              component.value,
              {
                label: child === void 0 ? getOptionLabel.value(opt) : null,
                modelValue: props.modelValue,
                'onUpdate:modelValue': onUpdateModelValue,
                ...innerOptions.value[i],
                tabindex:
                  props.type === 'radio'
                    ? i === tabStopIndex.value
                      ? 0
                      : -1
                    : void 0
              },
              child
            )
          ])
        })
      )
  }
})
