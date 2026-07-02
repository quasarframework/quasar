import { computed, getCurrentInstance, h, ref, watch } from 'vue'

import QCircularProgress from '../circular-progress/QCircularProgress.js'
import TouchPan from '../../directives/touch-pan/TouchPan.js'

import { createComponent } from '../../utils/private.create/create.js'
import { position, stopAndPrevent } from '../../utils/event/event.js'
import { between, normalizeToInterval } from '../../utils/format/format.js'
import { hDir } from '../../utils/private.render/render.js'

import {
  useFormAttrs,
  useFormProps
} from '../../composables/use-form/private.use-form.js'
import { useCircularCommonProps } from '../circular-progress/circular-progress.js'

// PGDOWN, LEFT, DOWN, PGUP, RIGHT, UP
const keyCodes = [34, 37, 40, 33, 39, 38]
const commonPropsName = Object.keys(useCircularCommonProps)

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/knob
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QKnob',

  props: {
    ...useFormProps,
    ...useCircularCommonProps,

    /**
     * Any number to indicate the given value of the knob. Either use this property (along with a listener for 'update:modelValue' event) OR use the v-model directive
     *
     * @api prop model-value
     * @extends model-value
     * @syncable
     * @example # v-model="myValue"
     */
    modelValue: {
      type: Number,
      required: true
    },

    /**
     * Inner minimum value of the model; Use in case you need the model value to be inside of the track's min-max values; Needs to be higher or equal to 'min' prop; Defaults to 'min' prop
     *
     * @api prop inner-min
     * @type {Number}
     * @category model
     * @added-in v2.5.4
     */
    innerMin: Number,
    /**
     * Inner maximum value of the model; Use in case you need the model value to be inside of the track's min-max values; Needs to be lower or equal to 'max' prop; Defaults to 'max' prop
     *
     * @api prop inner-max
     * @type {Number}
     * @category model
     * @added-in v2.5.4
     */
    innerMax: Number,

    /**
     * A number representing steps in the value of the model, while adjusting the knob
     *
     * @api prop step
     * @type {Number}
     * @default 1
     * @category model
     */
    step: {
      type: Number,
      default: 1,
      validator: v => v >= 0
    },

    /**
     * @api prop tabindex
     * @extends tabindex
     * @default 0
     */
    tabindex: {
      type: [Number, String],
      default: 0
    },

    /**
     * @api prop disable
     * @extends disable
     */
    disable: Boolean,
    /**
     * @api prop readonly
     * @extends readonly
     */
    readonly: Boolean
  },

  emits: [
    /**
     * Emitted when the model changes
     *
     * @api event update:model-value
     * @extends update:model-value
     * @param {Number} value New model value
     */
    'update:modelValue',

    /**
     * Fires at the end of a knob's adjustment and offers the value of the model
     *
     * @api event change
     * @param {Number} value New model value
     */
    'change',

    /**
     * The value of the model while dragging is still in progress
     *
     * @api event drag-value
     * @param {Number} value New model value
     */
    'dragValue'
  ],

  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const model = ref(props.modelValue)
    const dragging = ref(false)

    const innerMin = computed(() =>
      !Number.isFinite(props.innerMin) || props.innerMin < props.min
        ? props.min
        : props.innerMin
    )
    const innerMax = computed(() =>
      !Number.isFinite(props.innerMax) || props.innerMax > props.max
        ? props.max
        : props.innerMax
    )

    let centerPosition

    function normalizeModel() {
      model.value =
        props.modelValue === null
          ? innerMin.value
          : between(props.modelValue, innerMin.value, innerMax.value)

      updateValue(true)
    }

    watch(
      () => `${props.modelValue}|${innerMin.value}|${innerMax.value}`,
      normalizeModel
    )

    normalizeModel()

    const editable = computed(() => !props.disable && !props.readonly)

    const classes = computed(
      () =>
        'q-knob non-selectable' +
        (editable.value
          ? ' q-knob--editable'
          : props.disable
            ? ' disabled'
            : '')
    )

    const decimals = computed(
      () => (String(props.step).trim().split('.')[1] || '').length
    )
    const step = computed(() => (props.step === 0 ? 1 : props.step))
    const instantFeedback = computed(
      () => props.instantFeedback || dragging.value
    )

    const onEvents = $q.platform.is.mobile
      ? computed(() => (editable.value ? { onClick } : {}))
      : computed(() =>
          editable.value
            ? {
                onMousedown,
                onClick,
                onKeydown,
                onKeyup
              }
            : {}
        )

    const attrs = computed(() =>
      editable.value
        ? { tabindex: props.tabindex }
        : {
            [`aria-${props.disable ? 'disabled' : 'readonly'}`]: 'true'
          }
    )

    const circularProps = computed(() => {
      const agg = {}
      commonPropsName.forEach(name => {
        agg[name] = props[name]
      })
      return agg
    })

    function pan(event) {
      if (event.isFinal) {
        updatePosition(event.evt, true)
        dragging.value = false
        return
      }

      if (event.isFirst) {
        updateCenterPosition()
        dragging.value = true
      }

      updatePosition(event.evt, false)
    }

    const directives = computed(() => [
      [TouchPan, pan, void 0, { prevent: true, stop: true, mouse: true }]
    ])

    function updateCenterPosition() {
      const { top, left, width, height } = proxy.$el.getBoundingClientRect()
      centerPosition = {
        top: top + height / 2,
        left: left + width / 2
      }
    }

    function onMousedown(evt) {
      updateCenterPosition()
      updatePosition(evt, false)
    }

    function onClick(evt) {
      updateCenterPosition()
      updatePosition(evt, true)
    }

    function onKeydown(evt) {
      if (!keyCodes.includes(evt.keyCode)) return

      stopAndPrevent(evt)

      const stepVal = ([34, 33].includes(evt.keyCode) ? 10 : 1) * step.value,
        offset = [34, 37, 40].includes(evt.keyCode) ? -stepVal : stepVal

      model.value = between(
        Number.parseFloat((model.value + offset).toFixed(decimals.value)),
        innerMin.value,
        innerMax.value
      )

      updateValue(false)
    }

    function updatePosition(evt, change) {
      const pos = position(evt),
        height = Math.abs(pos.top - centerPosition.top),
        distance = Math.hypot(height, pos.left - centerPosition.left)

      let angle = Math.asin(height / distance) * (180 / Math.PI)

      if (pos.top < centerPosition.top) {
        angle = centerPosition.left < pos.left ? 90 - angle : 270 + angle
      } else {
        angle = centerPosition.left < pos.left ? angle + 90 : 270 - angle
      }

      if ($q.lang.rtl) {
        angle = normalizeToInterval(-angle - props.angle, 0, 360)
      } else if (props.angle) {
        angle = normalizeToInterval(angle - props.angle, 0, 360)
      }

      if (props.reverse) angle = 360 - angle

      let newModel = props.min + (angle / 360) * (props.max - props.min)

      if (step.value !== 0) {
        const modulo = newModel % step.value

        newModel =
          newModel -
          modulo +
          (Math.abs(modulo) >= step.value / 2
            ? (modulo < 0 ? -1 : 1) * step.value
            : 0)

        newModel = Number.parseFloat(newModel.toFixed(decimals.value))
      }

      newModel = between(newModel, innerMin.value, innerMax.value)

      emit('dragValue', newModel)

      if (model.value !== newModel) {
        model.value = newModel
      }

      updateValue(change)
    }

    function onKeyup(evt) {
      if (keyCodes.includes(evt.keyCode)) {
        updateValue(true)
      }
    }

    function updateValue(change) {
      if (props.modelValue !== model.value) {
        emit('update:modelValue', model.value)
      }

      if (change) emit('change', model.value)
    }

    const formAttrs = useFormAttrs(props)

    function getNameInput() {
      return h('input', formAttrs.value)
    }

    return () => {
      const data = {
        class: classes.value,
        role: 'slider',
        'aria-valuemin': innerMin.value,
        'aria-valuemax': innerMax.value,
        'aria-valuenow': props.modelValue,
        ...attrs.value,
        ...circularProps.value,
        value: model.value,
        instantFeedback: instantFeedback.value,
        ...onEvents.value
      }

      const child = {
        default: slots.default
      }

      if (editable.value && props.name !== void 0) {
        child.internal = getNameInput
      }

      return hDir(
        QCircularProgress,
        data,
        child,
        'knob',
        editable.value,
        () => directives.value
      )
    }
  }
})
