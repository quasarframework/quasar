import { h, ref, computed, watch, nextTick, getCurrentInstance } from 'vue'

import TouchPan from '../../directives/touch-pan/TouchPan.js'

import useDark, { useDarkProps } from '../../composables/private.use-dark/use-dark.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot, hMergeSlot, hDir } from '../../utils/private.render/render.js'

export default createComponent({
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
      validator: v => [ '%', 'px' ].includes(v)
    },

    limits: {
      type: Array,
      validator: v => {
        if (v.length !== 2) return false
        if (typeof v[ 0 ] !== 'number' || typeof v[ 1 ] !== 'number') return false
        return v[ 0 ] >= 0 && v[ 0 ] <= v[ 1 ]
      }
    },

    emitImmediately: Boolean,

    horizontal: Boolean,
    disable: Boolean,

    beforeClass: [ Array, String, Object ],
    afterClass: [ Array, String, Object ],

    separatorClass: [ Array, String, Object ],
    separatorStyle: [ Array, String, Object ]
  },

  emits: [ 'update:modelValue' ],

  setup (props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance()
    const isDark = useDark(props, $q)

    const rootRef = ref(null)
    const sideRefs = {
      before: ref(null),
      after: ref(null)
    }

    const classes = computed(() =>
      'q-splitter no-wrap '
      + `${ props.horizontal === true ? 'q-splitter--horizontal column' : 'q-splitter--vertical row' }`
      + ` q-splitter--${ props.disable === true ? 'disabled' : 'workable' }`
      + (isDark.value === true ? ' q-splitter--dark' : '')
    )

    const propName = computed(() => (props.horizontal === true ? 'height' : 'width'))
    const side = computed(() => (props.reverse !== true ? 'before' : 'after'))

    const computedLimits = computed(() => (
      props.limits !== void 0
        ? props.limits
        : (props.unit === '%' ? [ 10, 90 ] : [ 50, Infinity ])
    ))

    function getCSSValue (value) {
      return (props.unit === '%' ? value : Math.round(value)) + props.unit
    }

    const styles = computed(() => ({
      [ side.value ]: {
        [ propName.value ]: getCSSValue(props.modelValue)
      }
    }))

    let __dir, __maxValue, __value, __multiplier, __normalized

    function pan (evt) {
      if (evt.isFirst === true) {
        const size = rootRef.value.getBoundingClientRect()[ propName.value ]

        __dir = props.horizontal === true ? 'up' : 'left'
        __maxValue = props.unit === '%' ? 100 : size
        __value = Math.min(__maxValue, computedLimits.value[ 1 ], Math.max(computedLimits.value[ 0 ], props.modelValue))
        __multiplier = (props.reverse !== true ? 1 : -1)
          * (props.horizontal === true ? 1 : ($q.lang.rtl === true ? -1 : 1))
          * (props.unit === '%' ? (size === 0 ? 0 : 100 / size) : 1)

        rootRef.value.classList.add('q-splitter--active')
        return
      }

      if (evt.isFinal === true) {
        if (__normalized !== props.modelValue) {
          emit('update:modelValue', __normalized)
        }

        rootRef.value.classList.remove('q-splitter--active')
        return
      }

      const val = __value
        + __multiplier
        * (evt.direction === __dir ? -1 : 1)
        * evt.distance[ props.horizontal === true ? 'y' : 'x' ]

      __normalized = Math.min(__maxValue, computedLimits.value[ 1 ], Math.max(computedLimits.value[ 0 ], val))

      sideRefs[ side.value ].value.style[ propName.value ] = getCSSValue(__normalized)

      if (props.emitImmediately === true && props.modelValue !== __normalized) {
        emit('update:modelValue', __normalized)
      }
    }

    const sepDirective = computed(() => {
      // if props.disable !== true
      return [ [
        TouchPan,
        pan,
        void 0,
        {
          [ props.horizontal === true ? 'vertical' : 'horizontal' ]: true,
          prevent: true,
          stop: true,
          mouse: true,
          mouseAllDir: true
        }
      ] ]
    })

    function normalize (val, limits) {
      if (val < limits[ 0 ]) {
        emit('update:modelValue', limits[ 0 ])
      }
      else if (val > limits[ 1 ]) {
        emit('update:modelValue', limits[ 1 ])
      }
    }

    watch(() => props.modelValue, v => {
      normalize(v, computedLimits.value)
    })

    watch(() => props.limits, () => {
      nextTick(() => {
        normalize(props.modelValue, computedLimits.value)
      })
    })

    return () => {
      const child = [
        h('div', {
          ref: sideRefs.before,
          class: [
            'q-splitter__panel q-splitter__before' + (props.reverse === true ? ' col' : ''),
            props.beforeClass
          ],
          style: styles.value.before
        }, hSlot(slots.before)),

        h('div', {
          class: [
            'q-splitter__separator',
            props.separatorClass
          ],
          style: props.separatorStyle,
          'aria-disabled': props.disable === true ? 'true' : void 0
        }, [
          hDir(
            'div',
            { class: 'q-splitter__separator-area absolute-full' },
            hSlot(slots.separator),
            'sep',
            props.disable !== true,
            () => sepDirective.value
          )
        ]),

        h('div', {
          ref: sideRefs.after,
          class: [
            'q-splitter__panel q-splitter__after' + (props.reverse === true ? '' : ' col'),
            props.afterClass
          ],
          style: styles.value.after
        }, hSlot(slots.after))
      ]

      return h('div', {
        class: classes.value,
        ref: rootRef
      }, hMergeSlot(slots.default, child))
    }
  }
})
