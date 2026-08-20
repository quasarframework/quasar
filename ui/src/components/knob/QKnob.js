import { computed, getCurrentInstance, h, ref, watch } from 'vue'

import QCircularProgress from '../circular-progress/QCircularProgress.js'
import TouchPan from '../../directives/touch-pan/TouchPan.js'

import { createComponent } from '../../utils/private.create/create.js'
import { position, stopAndPrevent } from '../../utils/event/event.js'
import { between, normalizeToInterval } from '../../utils/format/format.js'
import { hDir } from '../../utils/private.render/render.js'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import {
  useFormAttrs,
  useFormProps
} from '../../composables/use-form/private.use-form.js'
import { useCircularCommonProps } from '../circular-progress/circular-progress.js'

// PGDOWN, LEFT, DOWN, PGUP, RIGHT, UP
const keyCodes = [34, 37, 40, 33, 39, 38]
const commonPropsName = Object.keys(useCircularCommonProps)

export default /*#__PURE__*/ createComponent({
  name: 'QKnob',

  props: {
    ...useFormProps,
    ...useCircularCommonProps,

    modelValue: {
      type: Number,
      required: true
    },

    innerMin: Number,
    innerMax: Number,

    step: {
      type: Number,
      default: 1,
      validator: v => v >= 0
    },

    tabindex: {
      type: [Number, String],
      default: 0
    },

    disable: Boolean,
    readonly: Boolean
  },

  emits: ['update:modelValue', 'change', 'dragValue'],

  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const $q = useQuasar()

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

    // dedups re-emissions towards a parent that does not sync the model
    // prop back; see QSlider's emittedValue
    let emittedValue = null

    // snapshotted when an interaction starts and compared at commit
    // time (see QSlider's changeBaseline): an interaction ending where
    // it started stays silent, and model normalization (mount, parent
    // writes, clamping) is not a user adjustment, so it never emits
    // change on its own
    let changeBaseline = null

    function armChangeBaseline() {
      if (changeBaseline === null) {
        changeBaseline = model.value
      }
    }

    function normalizeModel() {
      emittedValue = null
      model.value =
        props.modelValue === null
          ? innerMin.value
          : between(props.modelValue, innerMin.value, innerMax.value)

      // false: still pushes a clamped correction back through
      // update:modelValue, but must not touch the change lifecycle
      // (the parent syncing v-model mid-drag lands here)
      updateValue(false)
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

    // same wiring on every device; see QSlider's trackContainerEvents
    const onEvents = computed(() =>
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
        armChangeBaseline()
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
      armChangeBaseline()
      updateCenterPosition()
      updatePosition(evt, false)
    }

    function onClick(evt) {
      armChangeBaseline()
      updateCenterPosition()
      updatePosition(evt, true)
    }

    function onKeydown(evt) {
      if (!keyCodes.includes(evt.keyCode)) return

      stopAndPrevent(evt)
      armChangeBaseline()

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
      if (props.modelValue !== model.value && model.value !== emittedValue) {
        emittedValue = model.value
        emit('update:modelValue', model.value)
      }

      if (change) {
        if (changeBaseline !== null && changeBaseline !== model.value) {
          emit('change', model.value)
        }
        changeBaseline = null
      }
    }

    const formAttrs = useFormAttrs(props)

    function getNameInput() {
      return h('input', formAttrs())
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
