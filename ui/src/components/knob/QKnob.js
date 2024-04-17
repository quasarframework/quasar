import { h, ref, computed, watch, getCurrentInstance } from 'vue'

import QCircularProgress from '../circular-progress/QCircularProgress.js'
import TouchPan from '../../directives/touch-pan/TouchPan.js'

import { createComponent } from '../../utils/private.create/create.js'
import { position, stopAndPrevent } from '../../utils/event/event.js'
import { between, normalizeToInterval } from '../../utils/format/format.js'
import { hDir } from '../../utils/private.render/render.js'

import { useFormProps, useFormAttrs } from '../../composables/use-form/private.use-form.js'
import { useCircularCommonProps } from '../circular-progress/circular-progress.js'

// PGDOWN, LEFT, DOWN, PGUP, RIGHT, UP
const keyCodes = [ 34, 37, 40, 33, 39, 38 ]
const commonPropsName = Object.keys(useCircularCommonProps)

export default createComponent({
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
      type: [ Number, String ],
      default: 0
    },

    disable: Boolean,
    readonly: Boolean
  },

  emits: [ 'update:modelValue', 'change', 'dragValue' ],

  setup (props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const model = ref(props.modelValue)
    const dragging = ref(false)

    const innerMin = computed(() => (
      isNaN(props.innerMin) === true || props.innerMin < props.min
        ? props.min
        : props.innerMin
    ))
    const innerMax = computed(() => (
      isNaN(props.innerMax) === true || props.innerMax > props.max
        ? props.max
        : props.innerMax
    ))

    let centerPosition

    function normalizeModel () {
      model.value = props.modelValue === null
        ? innerMin.value
        : between(props.modelValue, innerMin.value, innerMax.value)

      updateValue(true)
    }

    watch(
      () => `${ props.modelValue }|${ innerMin.value }|${ innerMax.value }`,
      normalizeModel
    )

    normalizeModel()

    const editable = computed(() => props.disable === false && props.readonly === false)

    const classes = computed(() =>
      'q-knob non-selectable' + (
        editable.value === true
          ? ' q-knob--editable'
          : (props.disable === true ? ' disabled' : '')
      )
    )

    const decimals = computed(() => (String(props.step).trim().split('.')[ 1 ] || '').length)
    const step = computed(() => (props.step === 0 ? 1 : props.step))
    const instantFeedback = computed(() => props.instantFeedback === true || dragging.value === true)

    const onEvents = $q.platform.is.mobile === true
      ? computed(() => (editable.value === true ? { onClick } : {}))
      : computed(() => (
        editable.value === true
          ? {
              onMousedown,
              onClick,
              onKeydown,
              onKeyup
            }
          : {}
      ))

    const attrs = computed(() => (
      editable.value === true
        ? { tabindex: props.tabindex }
        : { [ `aria-${ props.disable === true ? 'disabled' : 'readonly' }` ]: 'true' }
    ))

    const circularProps = computed(() => {
      const agg = {}
      commonPropsName.forEach(name => {
        agg[ name ] = props[ name ]
      })
      return agg
    })

    function pan (event) {
      if (event.isFinal) {
        updatePosition(event.evt, true)
        dragging.value = false
      }
      else if (event.isFirst) {
        updateCenterPosition()
        dragging.value = true
        updatePosition(event.evt)
      }
      else {
        updatePosition(event.evt)
      }
    }

    const directives = computed(() => {
      return [ [
        TouchPan,
        pan,
        void 0,
        { prevent: true, stop: true, mouse: true }
      ] ]
    })

    function updateCenterPosition () {
      const { top, left, width, height } = proxy.$el.getBoundingClientRect()
      centerPosition = {
        top: top + height / 2,
        left: left + width / 2
      }
    }

    function onMousedown (evt) {
      updateCenterPosition()
      updatePosition(evt)
    }

    function onClick (evt) {
      updateCenterPosition()
      updatePosition(evt, true)
    }

    function onKeydown (evt) {
      if (!keyCodes.includes(evt.keyCode)) {
        return
      }

      stopAndPrevent(evt)

      const
        stepVal = ([ 34, 33 ].includes(evt.keyCode) ? 10 : 1) * step.value,
        offset = [ 34, 37, 40 ].includes(evt.keyCode) ? -stepVal : stepVal

      model.value = between(
        parseFloat((model.value + offset).toFixed(decimals.value)),
        innerMin.value,
        innerMax.value
      )

      updateValue()
    }

    function updatePosition (evt, change) {
      const
        pos = position(evt),
        height = Math.abs(pos.top - centerPosition.top),
        distance = Math.sqrt(
          height ** 2
          + Math.abs(pos.left - centerPosition.left) ** 2
        )

      let angle = Math.asin(height / distance) * (180 / Math.PI)

      if (pos.top < centerPosition.top) {
        angle = centerPosition.left < pos.left ? 90 - angle : 270 + angle
      }
      else {
        angle = centerPosition.left < pos.left ? angle + 90 : 270 - angle
      }

      if ($q.lang.rtl === true) {
        angle = normalizeToInterval(-angle - props.angle, 0, 360)
      }
      else if (props.angle) {
        angle = normalizeToInterval(angle - props.angle, 0, 360)
      }

      if (props.reverse === true) {
        angle = 360 - angle
      }

      let newModel = props.min + (angle / 360) * (props.max - props.min)

      if (step.value !== 0) {
        const modulo = newModel % step.value

        newModel = newModel - modulo
          + (Math.abs(modulo) >= step.value / 2 ? (modulo < 0 ? -1 : 1) * step.value : 0)

        newModel = parseFloat(newModel.toFixed(decimals.value))
      }

      newModel = between(newModel, innerMin.value, innerMax.value)

      emit('dragValue', newModel)

      if (model.value !== newModel) {
        model.value = newModel
      }

      updateValue(change)
    }

    function onKeyup (evt) {
      if (keyCodes.includes(evt.keyCode)) {
        updateValue(true)
      }
    }

    function updateValue (change) {
      props.modelValue !== model.value && emit('update:modelValue', model.value)
      change === true && emit('change', model.value)
    }

    const formAttrs = useFormAttrs(props)

    function getNameInput () {
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

      if (editable.value === true && props.name !== void 0) {
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
