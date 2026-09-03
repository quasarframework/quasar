import { computed, h, nextTick, ref, watch, withDirectives } from 'vue'

import TouchPan from '../../directives/touch-pan/TouchPan.js'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import useId from '../../composables/use-id/use-id.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hMergeSlot, hSlot } from '../../utils/private.render/render.js'
import { stopAndPrevent } from '../../utils/event/event.js'

export default /*#__PURE__*/ createComponent({
  name: 'QSplitter',

  props: {
    ...useDarkProps,

    modelValue: {
      type: Number,
      required: true
    },
    reverse: Boolean,
    unit: {
      type: String,
      default: '%',
      validator: v => ['%', 'px'].includes(v)
    },

    limits: {
      type: Array,
      validator: v => {
        if (v.length !== 2) return false
        if (typeof v[0] !== 'number' || typeof v[1] !== 'number') return false
        return v[0] >= 0 && v[0] <= v[1]
      }
    },

    emitImmediately: Boolean,

    horizontal: Boolean,
    disable: Boolean,

    beforeClass: [Array, String, Object],
    afterClass: [Array, String, Object],

    separatorClass: [Array, String, Object],
    separatorStyle: [Array, String, Object],

    separatorAriaLabel: String
  },

  emits: ['update:modelValue'],

  setup(props, { slots, emit }) {
    const $q = useQuasar()
    const isDark = useDark(props, $q)

    const rootRef = ref(null)
    const sideRefs = {
      before: ref(null),
      after: ref(null)
    }

    const panelId = useId()

    const classes = computed(
      () =>
        'q-splitter no-wrap ' +
        `${props.horizontal ? 'q-splitter--horizontal column' : 'q-splitter--vertical row'}` +
        ` q-splitter--${props.disable ? 'disabled' : 'workable'}` +
        (isDark() ? ' q-splitter--dark' : '')
    )

    const propName = computed(() => (props.horizontal ? 'height' : 'width'))
    const side = computed(() => (props.reverse ? 'after' : 'before'))

    const computedLimits = computed(() =>
      props.limits !== void 0
        ? props.limits
        : props.unit === '%'
          ? [10, 90]
          : [50, Infinity]
    )

    function getCSSValue(value) {
      return (props.unit === '%' ? value : Math.round(value)) + props.unit
    }

    const styles = computed(() => ({
      [side.value]: {
        [propName.value]: getCSSValue(props.modelValue)
      }
    }))

    let __dir, __maxValue, __value, __multiplier, __normalized

    function pan(evt) {
      if (evt.isFirst) {
        const size = rootRef.value.getBoundingClientRect()[propName.value]

        __dir = props.horizontal ? 'up' : 'left'
        __maxValue = props.unit === '%' ? 100 : size
        __value = Math.min(
          __maxValue,
          computedLimits.value[1],
          Math.max(computedLimits.value[0], props.modelValue)
        )
        __multiplier =
          (props.reverse ? -1 : 1) *
          (props.horizontal ? 1 : $q.lang.rtl ? -1 : 1) *
          (props.unit === '%' ? (size === 0 ? 0 : 100 / size) : 1)

        rootRef.value.classList.add('q-splitter--active')
        return
      }

      if (evt.isFinal) {
        if (__normalized !== props.modelValue) {
          emit('update:modelValue', __normalized)
        }

        rootRef.value.classList.remove('q-splitter--active')
        return
      }

      const val =
        __value +
        __multiplier *
          (evt.direction === __dir ? -1 : 1) *
          evt.distance[props.horizontal ? 'y' : 'x']

      __normalized = Math.min(
        __maxValue,
        computedLimits.value[1],
        Math.max(computedLimits.value[0], val)
      )

      sideRefs[side.value].value.style[propName.value] =
        getCSSValue(__normalized)

      if (props.emitImmediately && props.modelValue !== __normalized) {
        emit('update:modelValue', __normalized)
      }
    }

    const sepDirective = computed(() => [
      [
        TouchPan,
        // TouchPan only acquires while its value is a function; detaching the
        // directive instead would re-create the separator content (#12668)
        props.disable ? void 0 : pan,
        void 0,
        {
          [props.horizontal ? 'vertical' : 'horizontal']: true,
          prevent: true,
          stop: true,
          mouse: true,
          mouseAllDir: true
        }
      ]
    ])

    const separatorAttrs = computed(() => {
      const acc = {
        role: 'separator',
        'aria-orientation': props.horizontal ? 'horizontal' : 'vertical',
        // a separator has presentational children, so it can only be
        // named through this attribute
        'aria-label': props.separatorAriaLabel || $q.lang.label.resize
      }

      if (props.disable) {
        acc['aria-disabled'] = 'true'
      } else {
        const limits = computedLimits.value

        acc.tabindex = 0
        acc['aria-controls'] = panelId.value
        acc['aria-valuemin'] = limits[0]
        if (limits[1] !== Infinity) {
          acc['aria-valuemax'] = limits[1]
        }
        acc['aria-valuenow'] = Math.round(props.modelValue * 100) / 100
      }

      return acc
    })

    let __restoreValue = null

    function onSeparatorKeydown(evt) {
      const { keyCode } = evt
      // 37 ArrowLeft, 39 ArrowRight (vertical splitter)
      // 38 ArrowUp, 40 ArrowDown (horizontal splitter)
      const arrowKeys = props.horizontal ? [38, 40] : [37, 39]

      if (
        keyCode !== 13 /* Enter */ &&
        keyCode !== 36 /* Home */ &&
        keyCode !== 35 /* End */ &&
        !arrowKeys.includes(keyCode)
      ) {
        return
      }

      stopAndPrevent(evt)

      const limits = computedLimits.value
      const maxValue =
        props.unit === '%'
          ? 100
          : rootRef.value.getBoundingClientRect()[propName.value]

      let val

      if (keyCode === 13) {
        // collapse the model-controlled panel to its minimum limit,
        // or restore its pre-collapse position
        if (props.modelValue !== limits[0]) {
          __restoreValue = props.modelValue
          val = limits[0]
        } else {
          val = __restoreValue !== null ? __restoreValue : props.modelValue
        }
      } else if (keyCode === 36) {
        val = limits[0]
      } else if (keyCode === 35) {
        val = limits[1]
      } else {
        const dir =
          (keyCode === arrowKeys[0] ? -1 : 1) *
          (props.reverse ? -1 : 1) *
          (props.horizontal ? 1 : $q.lang.rtl ? -1 : 1)

        val = props.modelValue + dir * (props.unit === '%' ? 1 : 10)
      }

      const normalized = Math.min(maxValue, limits[1], Math.max(limits[0], val))

      if (normalized !== props.modelValue) {
        emit('update:modelValue', normalized)
      }
    }

    function normalize(val, limits) {
      if (val < limits[0]) {
        emit('update:modelValue', limits[0])
      } else if (val > limits[1]) {
        emit('update:modelValue', limits[1])
      }
    }

    watch(
      () => props.modelValue,
      v => {
        normalize(v, computedLimits.value)
      }
    )

    watch(
      () => props.limits,
      () => {
        nextTick(() => {
          normalize(props.modelValue, computedLimits.value)
        })
      }
    )

    return () => {
      const child = [
        h(
          'div',
          {
            ref: sideRefs.before,
            id: side.value === 'before' ? panelId.value : void 0,
            class: [
              'q-splitter__panel q-splitter__before' +
                (props.reverse ? ' col' : ''),
              props.beforeClass
            ],
            style: styles.value.before
          },
          hSlot(slots.before)
        ),

        h(
          'div',
          {
            class: ['q-splitter__separator', props.separatorClass],
            style: props.separatorStyle,
            ...separatorAttrs.value,
            onKeydown: props.disable ? void 0 : onSeparatorKeydown
          },
          [
            withDirectives(
              h(
                'div',
                { class: 'q-splitter__separator-area absolute-full' },
                hSlot(slots.separator)
              ),
              sepDirective.value
            )
          ]
        ),

        h(
          'div',
          {
            ref: sideRefs.after,
            id: side.value === 'after' ? panelId.value : void 0,
            class: [
              'q-splitter__panel q-splitter__after' +
                (props.reverse ? '' : ' col'),
              props.afterClass
            ],
            style: styles.value.after
          },
          hSlot(slots.after)
        )
      ]

      return h(
        'div',
        {
          class: classes.value,
          ref: rootRef
        },
        hMergeSlot(slots.default, child)
      )
    }
  }
})
