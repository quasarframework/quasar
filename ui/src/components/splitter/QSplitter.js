import { computed, getCurrentInstance, h, nextTick, ref, watch } from 'vue'

import TouchPan from '../../directives/touch-pan/TouchPan.js'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hDir, hMergeSlot, hSlot } from '../../utils/private.render/render.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/splitter
 */
/**
 * Default slot in the devland unslotted content of the component; Suggestion: QTooltip, QMenu
 *
 * @api slot default
 */

/**
 * Content of the panel on left/top
 *
 * @api slot before
 */

/**
 * Content of the panel on right/bottom
 *
 * @api slot after
 */

/**
 * Content to be placed inside the separator; By default it is centered
 *
 * @api slot separator
 */
export default createComponent({
  name: 'QSplitter',

  props: {
    ...useDarkProps,

    /**
     * Model of the component defining the size of first panel (or second if using reverse) in the unit specified (for '%' it's the split ratio percent - 0.0 < x < 100.0; for 'px' it's the size in px); Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive
     *
     * @api prop model-value
     * @extends model-value
     * @syncable
     * @example # v-model="ratio"
     */
    modelValue: {
      type: Number,
      required: true
    },
    /**
     * Apply the model size to the second panel (by default it applies to the first)
     *
     * @api prop reverse
     * @type {Boolean}
     * @category model
     */
    reverse: Boolean,
    /**
     * CSS unit for the model
     *
     * @api prop unit
     * @type {String}
     * @default '%'
     * @category model
     */
    unit: {
      type: String,
      default: '%',
      validator: v => ['%', 'px'].includes(v)
    },

    /**
     * An array of two values representing the minimum and maximum split size of the two panels; When 'px' unit is set then you can use Infinity as the second value to make it unbound on the other side; Default value: for '%' unit it is [10, 90], while for 'px' unit it is [50, Infinity]
     *
     * @api prop limits
     * @type {Array}
     * @default # [10, 90]/[50, Infinity]
     * @category content|model
     * @example [30, 70]
     * @example [0, Infinity]
     */
    limits: {
      type: Array,
      validator: v => {
        if (v.length !== 2) return false
        if (typeof v[0] !== 'number' || typeof v[1] !== 'number') return false
        return v[0] >= 0 && v[0] <= v[1]
      }
    },

    /**
     * Emit model while user is panning on the separator
     *
     * @api prop emit-immediately
     * @type {Boolean}
     * @category model
     */
    emitImmediately: Boolean,

    /**
     * Allows the splitter to split its two panels horizontally, instead of vertically
     *
     * @api prop horizontal
     * @type {Boolean}
     * @category content
     */
    horizontal: Boolean,
    /**
     * @api prop disable
     * @extends disable
     */
    disable: Boolean,

    /**
     * Class definitions to be attributed to the 'before' panel
     *
     * @api prop before-class
     * @type {String|Array|Object}
     * @ts-type VueClassProp
     * @category style
     * @example 'bg-deep-orange'
     * @example { 'my-special-class': true }
     */
    beforeClass: [Array, String, Object],
    /**
     * Class definitions to be attributed to the 'after' panel
     *
     * @api prop after-class
     * @type {String|Array|Object}
     * @ts-type VueClassProp
     * @category style
     * @example 'bg-deep-orange'
     * @example { 'my-special-class': true }
     */
    afterClass: [Array, String, Object],

    /**
     * Class definitions to be attributed to the splitter separator
     *
     * @api prop separator-class
     * @type {String|Array|Object}
     * @ts-type VueClassProp
     * @category style
     * @example 'bg-deep-orange'
     * @example { 'my-special-class': true }
     */
    separatorClass: [Array, String, Object],
    /**
     * Style definitions to be attributed to the splitter separator
     *
     * @api prop separator-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category style
     * @example 'background-color: #ff0000'
     * @example { backgroundColor: '#ff0000' }
     */
    separatorStyle: [Array, String, Object]
  },

  emits: ['update:modelValue'],

  setup(props, { slots, emit }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()
    const isDark = useDark(props, $q)

    const rootRef = ref(null)
    const sideRefs = {
      before: ref(null),
      after: ref(null)
    }

    const classes = computed(
      () =>
        'q-splitter no-wrap ' +
        `${props.horizontal ? 'q-splitter--horizontal column' : 'q-splitter--vertical row'}` +
        ` q-splitter--${props.disable ? 'disabled' : 'workable'}` +
        (isDark.value ? ' q-splitter--dark' : '')
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
        pan,
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
            'aria-disabled': props.disable ? 'true' : void 0
          },
          [
            hDir(
              'div',
              { class: 'q-splitter__separator-area absolute-full' },
              hSlot(slots.separator),
              'sep',
              !props.disable,
              () => sepDirective.value
            )
          ]
        ),

        h(
          'div',
          {
            ref: sideRefs.after,
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
