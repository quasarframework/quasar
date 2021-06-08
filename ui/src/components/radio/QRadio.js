import { h, defineComponent, ref, computed, getCurrentInstance } from 'vue'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import useSize, { useSizeProps } from '../../composables/private/use-size.js'
import useRefocusTarget from '../../composables/private/use-refocus-target.js'
import { useFormProps, useFormInject } from '../../composables/private/use-form.js'

import optionSizes from '../../utils/private/option-sizes.js'
import { stopAndPrevent } from '../../utils/event.js'
import { hSlot, hMergeSlot } from '../../utils/private/render.js'

const svg = h('svg', {
  class: 'q-radio__bg absolute non-selectable',
  viewBox: '0 0 24 24',
  'aria-hidden': 'true'
}, [
  h('path', {
    d: 'M12,22a10,10 0 0 1 -10,-10a10,10 0 0 1 10,-10a10,10 0 0 1 10,10a10,10 0 0 1 -10,10m0,-22a12,12 0 0 0 -12,12a12,12 0 0 0 12,12a12,12 0 0 0 12,-12a12,12 0 0 0 -12,-12'
  }),

  h('path', {
    class: 'q-radio__check',
    d: 'M12,6a6,6 0 0 0 -6,6a6,6 0 0 0 6,6a6,6 0 0 0 6,-6a6,6 0 0 0 -6,-6'
  })
])

export default defineComponent({
  name: 'QRadio',

  props: {
    ...useDarkProps,
    ...useSizeProps,
    ...useFormProps,

    modelValue: {
      required: true
    },
    val: {
      required: true
    },

    label: String,
    leftLabel: Boolean,

    color: String,
    keepColor: Boolean,
    dense: Boolean,

    disable: Boolean,
    tabindex: [ String, Number ]
  },

  emits: [ 'update:modelValue' ],

  setup (props, { slots, emit }) {
    const { proxy } = getCurrentInstance()

    const isDark = useDark(props, proxy.$q)
    const sizeStyle = useSize(props, optionSizes)

    const rootRef = ref(null)
    const { refocusTargetEl, refocusTarget } = useRefocusTarget(props, rootRef)

    const isTrue = computed(() => props.modelValue === props.val)

    const classes = computed(() =>
      'q-radio cursor-pointer no-outline row inline no-wrap items-center'
      + (props.disable === true ? ' disabled' : '')
      + (isDark.value === true ? ' q-radio--dark' : '')
      + (props.dense === true ? ' q-radio--dense' : '')
      + (props.leftLabel === true ? ' reverse' : '')
    )

    const innerClass = computed(() => {
      const color = props.color !== void 0 && (
        props.keepColor === true
        || isTrue.value === true
      )
        ? ` text-${ props.color }`
        : ''

      return 'q-radio__inner relative-position '
        + `q-radio__inner--${ isTrue.value === true ? 'truthy' : 'falsy' }${ color }`
    })

    const tabindex = computed(() => (
      props.disable === true ? -1 : props.tabindex || 0
    ))

    const formAttrs = computed(() => {
      const prop = { type: 'radio' }

      props.name !== void 0 && Object.assign(prop, {
        name: props.name,
        value: props.val
      })

      return prop
    })

    const formDomProps = computed(() => (
      props.name !== void 0 && isTrue.value === true
        ? { checked: true }
        : {}
    ))

    const injectFormInput = useFormInject(formAttrs, formDomProps)

    function onClick (e) {
      if (e !== void 0) {
        stopAndPrevent(e)
        refocusTarget(e)
      }

      if (props.disable !== true && isTrue.value !== true) {
        emit('update:modelValue', props.val, e)
      }
    }

    function onKeydown (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        stopAndPrevent(e)
      }
    }

    function onKeyup (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        onClick(e)
      }
    }

    // expose public methods
    Object.assign(proxy, { set: onClick })

    return () => {
      const content = [ svg ]

      props.disable !== true && injectFormInput(
        content,
        'unshift',
        ' q-radio__native q-ma-none q-pa-none'
      )

      const child = [
        h('div', {
          class: innerClass.value,
          style: sizeStyle.value
        }, content)
      ]

      if (refocusTargetEl.value !== null) {
        child.push(refocusTargetEl.value)
      }

      const label = props.label !== void 0
        ? hMergeSlot(slots.default, [ props.label ])
        : hSlot(slots.default)

      label !== void 0 && child.push(
        h('div', {
          class: 'q-radio__label q-anchor--skip'
        }, label)
      )

      return h('div', {
        ref: rootRef,
        class: classes.value,
        tabindex: tabindex.value,
        role: 'radio',
        'aria-label': props.label,
        'aria-checked': isTrue.value === true ? 'true' : 'false',
        'aria-disabled': props.disable === true ? 'true' : void 0,
        onClick,
        onKeydown,
        onKeyup
      }, child)
    }
  }
})
