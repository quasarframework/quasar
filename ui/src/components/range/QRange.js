import { h, ref, computed, watch, getCurrentInstance } from 'vue'

import useSlider, {
  useSliderProps,
  useSliderEmits,
  keyCodes
} from '../slider/use-slider.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import { between } from '../../utils/format/format.js'

const dragType = {
  MIN: 0,
  RANGE: 1,
  MAX: 2
}

export default createComponent({
  name: 'QRange',

  props: {
    ...useSliderProps,

    modelValue: {
      type: Object,
      default: () => ({ min: null, max: null }),
      validator: v => 'min' in v && 'max' in v
    },

    minRange: {
      type: Number,
      default: 0,
      validator: v => v >= 0
    },
    maxRange: {
      type: Number,
      default: null,
      validator: v => v === null || v >= 0
    },

    dragRange: Boolean,
    dragOnlyRange: Boolean,

    leftLabelColor: String,
    leftLabelTextColor: String,
    rightLabelColor: String,
    rightLabelTextColor: String,

    leftLabelValue: [ String, Number ],
    rightLabelValue: [ String, Number ],

    leftThumbColor: String,
    rightThumbColor: String
  },

  emits: useSliderEmits,

  setup (props, { emit }) {
    const { proxy: { $q } } = getCurrentInstance()

    const { state, methods } = useSlider({
      updateValue, updatePosition, getDragging,
      formAttrs: computed(() => ({
        type: 'hidden',
        name: props.name,
        value: `${ props.modelValue.min }|${ props.modelValue.max }`
      }))
    })

    const rootRef = ref(null)
    const curMinRatio = ref(0)
    const curMaxRatio = ref(0)
    const model = ref({ min: 0, max: 0 })

    function normalizeModel () {
      let min = props.modelValue.min === null
        ? state.innerMin.value
        : between(props.modelValue.min, state.innerMin.value, state.innerMax.value)

      let max = props.modelValue.max === null
        ? state.innerMax.value
        : between(props.modelValue.max, state.innerMin.value, state.innerMax.value)

      // Calculate effective constraints (handle edge cases where constraints don't fit)
      const sliderRange = state.innerMax.value - state.innerMin.value
      const effectiveMinRange = Math.min(props.minRange, sliderRange)
      const effectiveMaxRange = props.maxRange !== null
        ? Math.min(props.maxRange, sliderRange)
        : null

      // Apply minRange constraint - if range is too narrow, expand it
      const currentRange = max - min
      if (currentRange < effectiveMinRange) {
        const deficit = effectiveMinRange - currentRange

        // Try to expand max first
        const maxExpansion = Math.min(deficit, state.innerMax.value - max)
        max += maxExpansion

        // If still need more, expand min downward
        const remainingDeficit = effectiveMinRange - (max - min)
        if (remainingDeficit > 0) {
          min = Math.max(state.innerMin.value, max - effectiveMinRange)
        }
      }

      // Apply maxRange constraint - if range is too wide, shrink it
      if (effectiveMaxRange !== null && currentRange > effectiveMaxRange) {
        const excess = currentRange - effectiveMaxRange

        // Try to shrink max first (move it down)
        const maxShrink = Math.min(excess, max - state.innerMin.value - effectiveMaxRange)
        max -= maxShrink

        // If still need more shrinking, move min up
        const remainingExcess = (max - min) - effectiveMaxRange
        if (remainingExcess > 0) {
          min = Math.min(state.innerMax.value - effectiveMaxRange, max - effectiveMaxRange)
        }
      }

      model.value.min = min
      model.value.max = max
    }

    watch(
      () => `${ props.modelValue.min }|${ props.modelValue.max }|${ state.innerMin.value }|${ state.innerMax.value }`,
      normalizeModel
    )

    normalizeModel()

    const modelMinRatio = computed(() => methods.convertModelToRatio(model.value.min))
    const modelMaxRatio = computed(() => methods.convertModelToRatio(model.value.max))

    const ratioMin = computed(() => (
      state.active.value === true ? curMinRatio.value : modelMinRatio.value
    ))
    const ratioMax = computed(() => (
      state.active.value === true ? curMaxRatio.value : modelMaxRatio.value
    ))

    const selectionBarStyle = computed(() => {
      const acc = {
        [ state.positionProp.value ]: `${ 100 * ratioMin.value }%`,
        [ state.sizeProp.value ]: `${ 100 * (ratioMax.value - ratioMin.value) }%`
      }
      if (props.selectionImg !== void 0) {
        acc.backgroundImage = `url(${ props.selectionImg }) !important`
      }
      return acc
    })

    const trackContainerEvents = computed(() => {
      if (state.editable.value !== true) {
        return {}
      }

      if ($q.platform.is.mobile === true) {
        return { onClick: methods.onMobileClick }
      }

      const evt = { onMousedown: methods.onActivate }

      if (props.dragRange === true || props.dragOnlyRange === true) {
        Object.assign(evt, {
          onFocus: () => { state.focus.value = 'both' },
          onBlur: methods.onBlur,
          onKeydown,
          onKeyup: methods.onKeyup
        })
      }

      return evt
    })

    function getEvents (side) {
      return $q.platform.is.mobile !== true && state.editable.value === true && props.dragOnlyRange !== true
        ? {
            onFocus: () => { state.focus.value = side },
            onBlur: methods.onBlur,
            onKeydown,
            onKeyup: methods.onKeyup
          }
        : {}
    }

    const thumbTabindex = computed(() => (props.dragOnlyRange !== true ? state.tabindex.value : null))
    const trackContainerTabindex = computed(() => (
      $q.platform.is.mobile !== true && (props.dragRange || props.dragOnlyRange === true)
        ? state.tabindex.value
        : null
    ))

    const minThumbRef = ref(null)
    const minEvents = computed(() => getEvents('min'))
    const getMinThumb = methods.getThumbRenderFn({
      focusValue: 'min',
      getNodeData: () => ({
        ref: minThumbRef,
        key: 'tmin',
        ...minEvents.value,
        tabindex: thumbTabindex.value
      }),
      ratio: ratioMin,
      label: computed(() => (
        props.leftLabelValue !== void 0
          ? props.leftLabelValue
          : model.value.min
      )),
      thumbColor: computed(() => props.leftThumbColor || props.thumbColor || props.color),
      labelColor: computed(() => props.leftLabelColor || props.labelColor),
      labelTextColor: computed(() => props.leftLabelTextColor || props.labelTextColor)
    })

    const maxEvents = computed(() => getEvents('max'))
    const getMaxThumb = methods.getThumbRenderFn({
      focusValue: 'max',
      getNodeData: () => ({
        ...maxEvents.value,
        key: 'tmax',
        tabindex: thumbTabindex.value
      }),
      ratio: ratioMax,
      label: computed(() => (
        props.rightLabelValue !== void 0
          ? props.rightLabelValue
          : model.value.max
      )),
      thumbColor: computed(() => props.rightThumbColor || props.thumbColor || props.color),
      labelColor: computed(() => props.rightLabelColor || props.labelColor),
      labelTextColor: computed(() => props.rightLabelTextColor || props.labelTextColor)
    })

    function updateValue (change) {
      if (model.value.min !== props.modelValue.min || model.value.max !== props.modelValue.max) {
        emit('update:modelValue', { ...model.value })
      }
      change === true && emit('change', { ...model.value })
    }

    function getDragging (event) {
      const
        { left, top, width, height } = rootRef.value.getBoundingClientRect(),
        sensitivity = props.dragOnlyRange === true
          ? 0
          : (props.vertical === true
              ? minThumbRef.value.offsetHeight / (2 * height)
              : minThumbRef.value.offsetWidth / (2 * width)
            )

      const dragging = {
        left,
        top,
        width,
        height,
        valueMin: model.value.min,
        valueMax: model.value.max,
        ratioMin: modelMinRatio.value,
        ratioMax: modelMaxRatio.value
      }

      const ratio = methods.getDraggingRatio(event, dragging)

      if (props.dragOnlyRange !== true && ratio < dragging.ratioMin + sensitivity) {
        dragging.type = dragType.MIN
      }
      else if (props.dragOnlyRange === true || ratio < dragging.ratioMax - sensitivity) {
        if (props.dragRange === true || props.dragOnlyRange === true) {
          dragging.type = dragType.RANGE
          Object.assign(dragging, {
            offsetRatio: ratio,
            offsetModel: methods.convertRatioToModel(ratio),
            rangeValue: dragging.valueMax - dragging.valueMin,
            rangeRatio: dragging.ratioMax - dragging.ratioMin
          })
        }
        else {
          dragging.type = dragging.ratioMax - ratio < ratio - dragging.ratioMin
            ? dragType.MAX
            : dragType.MIN
        }
      }
      else {
        dragging.type = dragType.MAX
      }

      return dragging
    }

    function updatePosition (event, dragging = state.dragging.value) {
      let pos
      const ratio = methods.getDraggingRatio(event, dragging)
      const localModel = methods.convertRatioToModel(ratio)

      const sliderRange = state.innerMax.value - state.innerMin.value
      const effectiveMinRange = Math.min(props.minRange, sliderRange)
      const effectiveMaxRange = props.maxRange !== null
        ? Math.min(props.maxRange, sliderRange)
        : null

      switch (dragging.type) {
        case dragType.MIN:
          if (ratio <= dragging.ratioMax) {
            // Moving min thumb towards left
            const maxAllowedMin = dragging.valueMax - effectiveMinRange
            const minAllowedMin = effectiveMaxRange !== null
              ? Math.max(dragging.valueMax - effectiveMaxRange, state.innerMin.value)
              : state.innerMin.value

            let constrainedMin = between(localModel, minAllowedMin, maxAllowedMin)

            // Ensure we don't go below slider min
            constrainedMin = Math.max(constrainedMin, state.innerMin.value)

            // If this would push max beyond slider max, adjust min
            if (constrainedMin + effectiveMinRange > state.innerMax.value) {
              constrainedMin = state.innerMax.value - effectiveMinRange
            }

            pos = {
              minR: methods.convertModelToRatio(constrainedMin),
              maxR: dragging.ratioMax,
              min: constrainedMin,
              max: dragging.valueMax
            }
            state.focus.value = 'min'
          }
          else {
            // Thumb crossed over
            const minAllowedMax = dragging.valueMax + effectiveMinRange
            const maxAllowedMax = effectiveMaxRange !== null
              ? Math.min(dragging.valueMax + effectiveMaxRange, state.innerMax.value)
              : state.innerMax.value

            let constrainedMax = between(localModel, minAllowedMax, maxAllowedMax)

            // Ensure we don't go above slider max
            constrainedMax = Math.min(constrainedMax, state.innerMax.value)

            // If this would push min below slider min, adjust max
            if (constrainedMax - effectiveMinRange < state.innerMin.value) {
              constrainedMax = state.innerMin.value + effectiveMinRange
            }

            pos = {
              minR: dragging.ratioMax,
              maxR: methods.convertModelToRatio(constrainedMax),
              min: dragging.valueMax,
              max: constrainedMax
            }
            state.focus.value = 'max'
          }
          break

        case dragType.MAX:
          if (ratio >= dragging.ratioMin) {
            // Moving max thumb towards right
            const minAllowedMax = dragging.valueMin + effectiveMinRange
            const maxAllowedMax = effectiveMaxRange !== null
              ? Math.min(dragging.valueMin + effectiveMaxRange, state.innerMax.value)
              : state.innerMax.value

            let constrainedMax = between(localModel, minAllowedMax, maxAllowedMax)

            // Ensure we don't go above slider max
            constrainedMax = Math.min(constrainedMax, state.innerMax.value)

            // If this would push min below slider min, adjust max
            if (constrainedMax - effectiveMinRange < state.innerMin.value) {
              constrainedMax = state.innerMin.value + effectiveMinRange
            }

            pos = {
              minR: dragging.ratioMin,
              maxR: methods.convertModelToRatio(constrainedMax),
              min: dragging.valueMin,
              max: constrainedMax
            }
            state.focus.value = 'max'
          }
          else {
            // Thumb crossed over
            const maxAllowedMin = dragging.valueMin - effectiveMinRange
            const minAllowedMin = effectiveMaxRange !== null
              ? Math.max(dragging.valueMin - effectiveMaxRange, state.innerMin.value)
              : state.innerMin.value

            let constrainedMin = between(localModel, minAllowedMin, maxAllowedMin)

            // Ensure we don't go below slider min
            constrainedMin = Math.max(constrainedMin, state.innerMin.value)

            // If this would push max above slider max, adjust min
            if (constrainedMin + effectiveMinRange > state.innerMax.value) {
              constrainedMin = state.innerMax.value - effectiveMinRange
            }

            pos = {
              minR: methods.convertModelToRatio(constrainedMin),
              maxR: dragging.ratioMin,
              min: constrainedMin,
              max: dragging.valueMin
            }
            state.focus.value = 'min'
          }
          break

        case dragType.RANGE:
          const
            ratioDelta = ratio - dragging.offsetRatio,
            minR = between(dragging.ratioMin + ratioDelta, state.innerMinRatio.value, state.innerMaxRatio.value - dragging.rangeRatio),
            modelDelta = localModel - dragging.offsetModel,
            min = between(dragging.valueMin + modelDelta, state.innerMin.value, state.innerMax.value - dragging.rangeValue)

          pos = {
            minR,
            maxR: minR + dragging.rangeRatio,
            min: state.roundValueFn.value(min),
            max: state.roundValueFn.value(min + dragging.rangeValue)
          }

          state.focus.value = 'both'
          break
      }

      // If either of the values to be emitted are null, set them to the defaults the user has entered.
      model.value = model.value.min === null || model.value.max === null
        ? { min: pos.min || props.min, max: pos.max || props.max }
        : { min: pos.min, max: pos.max }

      if (props.snap !== true || props.step === 0) {
        curMinRatio.value = pos.minR
        curMaxRatio.value = pos.maxR
      }
      else {
        curMinRatio.value = methods.convertModelToRatio(model.value.min)
        curMaxRatio.value = methods.convertModelToRatio(model.value.max)
      }
    }

    function onKeydown (evt) {
      if (keyCodes.includes(evt.keyCode) === false) return

      stopAndPrevent(evt)

      const
        stepVal = ([ 34, 33 ].includes(evt.keyCode) ? 10 : 1) * state.keyStep.value,
        offset = (
          ([ 34, 37, 40 ].includes(evt.keyCode) ? -1 : 1)
          * (state.isReversed.value === true ? -1 : 1)
          * (props.vertical === true ? -1 : 1) * stepVal
        )

      if (state.focus.value === 'both') {
        const interval = model.value.max - model.value.min
        const min = between(
          state.roundValueFn.value(model.value.min + offset),
          state.innerMin.value,
          state.innerMax.value - interval
        )

        model.value = {
          min,
          max: state.roundValueFn.value(min + interval)
        }
      }
      else if (state.focus.value === false) {
        return
      }
      else {
        const which = state.focus.value
        const proposedValue = state.roundValueFn.value(model.value[ which ] + offset)

        const sliderRange = state.innerMax.value - state.innerMin.value
        const effectiveMinRange = Math.min(props.minRange, sliderRange)
        const effectiveMaxRange = props.maxRange !== null
          ? Math.min(props.maxRange, sliderRange)
          : null

        let constrainedValue
        if (which === 'min') {
          // Moving min thumb - ensure range stays between minRange and maxRange
          let maxAllowed = model.value.max - effectiveMinRange
          let minAllowed = effectiveMaxRange !== null
            ? model.value.max - effectiveMaxRange
            : state.innerMin.value

          // Ensure bounds don't go outside slider range
          minAllowed = Math.max(minAllowed, state.innerMin.value)

          // If minRange can't fit, adjust maxAllowed
          if (maxAllowed < state.innerMin.value) {
            maxAllowed = state.innerMin.value
          }

          constrainedValue = between(proposedValue, minAllowed, maxAllowed)
        } else {
          // Moving max thumb - ensure range stays between minRange and maxRange
          let minAllowed = model.value.min + effectiveMinRange
          let maxAllowed = effectiveMaxRange !== null
            ? model.value.min + effectiveMaxRange
            : state.innerMax.value

          // Ensure bounds don't go outside slider range
          maxAllowed = Math.min(maxAllowed, state.innerMax.value)

          // If minRange can't fit, adjust minAllowed
          if (minAllowed > state.innerMax.value) {
            minAllowed = state.innerMax.value
          }

          constrainedValue = between(proposedValue, minAllowed, maxAllowed)
        }

        model.value = {
          ...model.value,
          [ which ]: constrainedValue
        }
      }

      updateValue()
    }

    return () => {
      const content = methods.getContent(
        selectionBarStyle,
        trackContainerTabindex,
        trackContainerEvents,
        node => {
          node.push(
            getMinThumb(),
            getMaxThumb()
          )
        }
      )

      return h('div', {
        ref: rootRef,
        class: 'q-range ' + state.classes.value + (
          props.modelValue.min === null || props.modelValue.max === null
            ? ' q-slider--no-value'
            : ''
        ),
        ...state.attributes.value,
        'aria-valuenow': props.modelValue.min + '|' + props.modelValue.max
      }, content)
    }
  }
})
