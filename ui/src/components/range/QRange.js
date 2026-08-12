import { computed, getCurrentInstance, h, ref, watch } from 'vue'

import useSlider, {
  keyCodes,
  useSliderEmits,
  useSliderProps
} from '../slider/use-slider.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import { between } from '../../utils/format/format.js'

const dragType = {
  MIN: 0,
  RANGE: 1,
  MAX: 2
}

const emptyModel = { min: null, max: null }

export default /*#__PURE__*/ createComponent({
  name: 'QRange',

  props: {
    ...useSliderProps,

    modelValue: {
      type: Object,
      default: () => ({ min: null, max: null }),
      validator: v => 'min' in v && 'max' in v
    },

    dragRange: Boolean,
    dragOnlyRange: Boolean,

    leftLabelColor: String,
    leftLabelTextColor: String,
    rightLabelColor: String,
    rightLabelTextColor: String,

    leftLabelValue: [String, Number],
    rightLabelValue: [String, Number],

    leftThumbColor: String,
    rightThumbColor: String,

    leftThumbAriaLabel: String,
    rightThumbAriaLabel: String
  },

  emits: useSliderEmits,

  setup(props, { emit }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()

    // the model can also be null, which means the same thing
    // as having no value on either end of the range
    const modelProp = computed(() => props.modelValue || emptyModel)

    const { state, methods } = useSlider({
      updateValue,
      updatePosition,
      getDragging,
      formAttrs: computed(() => ({
        type: 'hidden',
        name: props.name,
        value: `${modelProp.value.min}|${modelProp.value.max}`
      }))
    })

    const rootRef = ref(null)
    const curMinRatio = ref(0)
    const curMaxRatio = ref(0)
    const model = ref({ min: 0, max: 0 })

    function normalizeModel() {
      model.value.min =
        modelProp.value.min === null
          ? state.innerMin.value
          : between(
              modelProp.value.min,
              state.innerMin.value,
              state.innerMax.value
            )

      model.value.max =
        modelProp.value.max === null
          ? state.innerMax.value
          : between(
              modelProp.value.max,
              state.innerMin.value,
              state.innerMax.value
            )
    }

    watch(
      () =>
        `${modelProp.value.min}|${modelProp.value.max}|${state.innerMin.value}|${state.innerMax.value}`,
      normalizeModel
    )

    normalizeModel()

    const modelMinRatio = computed(() =>
      methods.convertModelToRatio(model.value.min)
    )
    const modelMaxRatio = computed(() =>
      methods.convertModelToRatio(model.value.max)
    )

    const ratioMin = computed(() =>
      state.active.value ? curMinRatio.value : modelMinRatio.value
    )
    const ratioMax = computed(() =>
      state.active.value ? curMaxRatio.value : modelMaxRatio.value
    )

    const selectionBarStyle = computed(() => {
      const acc = {
        [state.positionProp.value]: `${100 * ratioMin.value}%`,
        [state.sizeProp.value]: `${100 * (ratioMax.value - ratioMin.value)}%`
      }
      if (props.selectionImg !== void 0) {
        acc.backgroundImage = `url(${props.selectionImg}) !important`
      }
      return acc
    })

    function getEditableAriaState() {
      return props.disable
        ? { 'aria-disabled': 'true' }
        : props.readonly
          ? { 'aria-readonly': 'true' }
          : {}
    }

    // one WAI-ARIA slider per thumb (unless drag-only-range, where the
    // track container is the single focusable acting on the whole window)
    function getThumbAriaAttrs(which) {
      if (props.dragOnlyRange) return {}

      const isMin = which === 'min',
        labelValue = props[isMin ? 'leftLabelValue' : 'rightLabelValue']

      return {
        role: 'slider',
        'aria-label':
          props[isMin ? 'leftThumbAriaLabel' : 'rightThumbAriaLabel'] ||
          $q.lang.label[isMin ? 'minimum' : 'maximum'],
        'aria-orientation': state.orientation.value,
        // each thumb is clamped against the other one (see onKeydown),
        // so its effective limits are what gets exposed
        'aria-valuemin': isMin ? state.innerMin.value : model.value.min,
        'aria-valuemax': isMin ? model.value.max : state.innerMax.value,
        'aria-valuenow': model.value[which],
        ...(labelValue !== void 0 ? { 'aria-valuetext': labelValue } : {}),
        ...getEditableAriaState()
      }
    }

    const minThumbAriaAttrs = computed(() => getThumbAriaAttrs('min'))
    const maxThumbAriaAttrs = computed(() => getThumbAriaAttrs('max'))

    const rootAttrs = computed(() => ({
      role: 'group',
      'data-step': props.step,
      ...getEditableAriaState()
    }))

    const trackContainerAriaAttrs = computed(() => {
      if ($q.platform.is.mobile || (!props.dragRange && !props.dragOnlyRange)) {
        return {}
      }

      const min = model.value.min,
        max = model.value.max,
        minLabel = props.leftLabelValue !== void 0 ? props.leftLabelValue : min,
        maxLabel =
          props.rightLabelValue !== void 0 ? props.rightLabelValue : max

      return {
        role: 'slider',
        'aria-label': $q.lang.label.range,
        'aria-orientation': state.orientation.value,
        'aria-valuemin': state.innerMin.value,
        'aria-valuemax': state.innerMax.value,
        'aria-valuenow': min,
        'aria-valuetext': `${minLabel}–${maxLabel}`,
        ...getEditableAriaState()
      }
    })

    const trackContainerEvents = computed(() => {
      if (!state.editable.value) return {}

      if ($q.platform.is.mobile) {
        return { onClick: methods.onMobileClick }
      }

      const evt = { onMousedown: methods.onActivate }

      if (props.dragRange || props.dragOnlyRange) {
        Object.assign(evt, {
          onFocus: () => {
            state.focus.value = 'both'
          },
          onBlur: methods.onBlur,
          onKeydown,
          onKeyup: methods.onKeyup
        })
      }

      return evt
    })

    const trackContainerData = computed(() => ({
      ...trackContainerAriaAttrs.value,
      ...trackContainerEvents.value
    }))

    function getEvents(side) {
      return !$q.platform.is.mobile &&
        state.editable.value &&
        !props.dragOnlyRange
        ? {
            onFocus: () => {
              state.focus.value = side
            },
            onBlur: methods.onBlur,
            onKeydown,
            onKeyup: methods.onKeyup
          }
        : {}
    }

    const thumbTabindex = computed(() =>
      props.dragOnlyRange ? null : state.tabindex.value
    )
    const trackContainerTabindex = computed(() =>
      !$q.platform.is.mobile && (props.dragRange || props.dragOnlyRange)
        ? state.tabindex.value
        : null
    )

    const minThumbRef = ref(null)
    const minEvents = computed(() => getEvents('min'))
    const getMinThumb = methods.getThumbRenderFn({
      focusValue: 'min',
      getNodeData: () => ({
        ref: minThumbRef,
        key: 'tmin',
        ...minEvents.value,
        tabindex: thumbTabindex.value,
        ...minThumbAriaAttrs.value
      }),
      ratio: ratioMin,
      label: computed(() =>
        props.leftLabelValue !== void 0 ? props.leftLabelValue : model.value.min
      ),
      thumbColor: computed(
        () => props.leftThumbColor || props.thumbColor || props.color
      ),
      labelColor: computed(() => props.leftLabelColor || props.labelColor),
      labelTextColor: computed(
        () => props.leftLabelTextColor || props.labelTextColor
      )
    })

    const maxEvents = computed(() => getEvents('max'))
    const getMaxThumb = methods.getThumbRenderFn({
      injectFormInput: false,
      focusValue: 'max',
      getNodeData: () => ({
        ...maxEvents.value,
        key: 'tmax',
        tabindex: thumbTabindex.value,
        ...maxThumbAriaAttrs.value
      }),
      ratio: ratioMax,
      label: computed(() =>
        props.rightLabelValue !== void 0
          ? props.rightLabelValue
          : model.value.max
      ),
      thumbColor: computed(
        () => props.rightThumbColor || props.thumbColor || props.color
      ),
      labelColor: computed(() => props.rightLabelColor || props.labelColor),
      labelTextColor: computed(
        () => props.rightLabelTextColor || props.labelTextColor
      )
    })

    function updateValue(change) {
      if (
        model.value.min !== modelProp.value.min ||
        model.value.max !== modelProp.value.max
      ) {
        emit('update:modelValue', { ...model.value })
      }

      if (change) emit('change', { ...model.value })
    }

    function getDragging(event) {
      const { left, top, width, height } =
          rootRef.value.getBoundingClientRect(),
        sensitivity = props.dragOnlyRange
          ? 0
          : props.vertical
            ? minThumbRef.value.offsetHeight / (2 * height)
            : minThumbRef.value.offsetWidth / (2 * width)

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

      if (!props.dragOnlyRange && ratio < dragging.ratioMin + sensitivity) {
        dragging.type = dragType.MIN
      } else if (
        props.dragOnlyRange ||
        ratio < dragging.ratioMax - sensitivity
      ) {
        if (props.dragRange || props.dragOnlyRange) {
          dragging.type = dragType.RANGE
          Object.assign(dragging, {
            offsetRatio: ratio,
            offsetModel: methods.convertRatioToModel(ratio),
            rangeValue: dragging.valueMax - dragging.valueMin,
            rangeRatio: dragging.ratioMax - dragging.ratioMin
          })
        } else {
          dragging.type =
            dragging.ratioMax - ratio < ratio - dragging.ratioMin
              ? dragType.MAX
              : dragType.MIN
        }
      } else {
        dragging.type = dragType.MAX
      }

      return dragging
    }

    function updatePosition(event, dragging = state.dragging.value) {
      let pos
      const ratio = methods.getDraggingRatio(event, dragging)
      const localModel = methods.convertRatioToModel(ratio)

      switch (dragging.type) {
        case dragType.MIN: {
          if (ratio <= dragging.ratioMax) {
            pos = {
              minR: ratio,
              maxR: dragging.ratioMax,
              min: localModel,
              max: dragging.valueMax
            }
            state.focus.value = 'min'
          } else {
            pos = {
              minR: dragging.ratioMax,
              maxR: ratio,
              min: dragging.valueMax,
              max: localModel
            }
            state.focus.value = 'max'
          }
          break
        }

        case dragType.MAX: {
          if (ratio >= dragging.ratioMin) {
            pos = {
              minR: dragging.ratioMin,
              maxR: ratio,
              min: dragging.valueMin,
              max: localModel
            }
            state.focus.value = 'max'
          } else {
            pos = {
              minR: ratio,
              maxR: dragging.ratioMin,
              min: localModel,
              max: dragging.valueMin
            }
            state.focus.value = 'min'
          }
          break
        }

        case dragType.RANGE: {
          const ratioDelta = ratio - dragging.offsetRatio,
            minR = between(
              dragging.ratioMin + ratioDelta,
              state.innerMinRatio.value,
              state.innerMaxRatio.value - dragging.rangeRatio
            ),
            modelDelta = localModel - dragging.offsetModel,
            min = between(
              dragging.valueMin + modelDelta,
              state.innerMin.value,
              state.innerMax.value - dragging.rangeValue
            )

          pos = {
            minR,
            maxR: minR + dragging.rangeRatio,
            min: state.roundValueFn.value(min),
            max: state.roundValueFn.value(min + dragging.rangeValue)
          }

          state.focus.value = 'both'
          break
        }
      }

      // If either of the values to be emitted are null, set them to the defaults the user has entered.
      model.value =
        model.value.min === null || model.value.max === null
          ? { min: pos.min ?? props.min, max: pos.max ?? props.max }
          : { min: pos.min, max: pos.max }

      if (!props.snap || props.step === 0) {
        curMinRatio.value = pos.minR
        curMaxRatio.value = pos.maxR
      } else {
        curMinRatio.value = methods.convertModelToRatio(model.value.min)
        curMaxRatio.value = methods.convertModelToRatio(model.value.max)
      }
    }

    function onKeydown(evt) {
      if (!keyCodes.includes(evt.keyCode)) return

      stopAndPrevent(evt)

      // HOME/END jump straight to the focused thumb's limits
      // (never direction-reversed)
      if (evt.keyCode === 36 || evt.keyCode === 35) {
        const toStart = evt.keyCode === 36

        if (state.focus.value === 'both') {
          // the whole window moves to the edge, preserving its width
          const interval = model.value.max - model.value.min
          const min = toStart
            ? state.innerMin.value
            : state.innerMax.value - interval

          model.value = {
            min,
            max: state.roundValueFn.value(min + interval)
          }
        } else if (!state.focus.value) {
          return
        } else if (state.focus.value === 'min') {
          model.value = {
            ...model.value,
            min: toStart ? state.innerMin.value : model.value.max
          }
        } else {
          model.value = {
            ...model.value,
            max: toStart ? model.value.min : state.innerMax.value
          }
        }

        updateValue()
        return
      }

      const stepVal =
          ([34, 33].includes(evt.keyCode) ? 10 : 1) * state.keyStep.value,
        offset =
          ([34, 37, 40].includes(evt.keyCode) ? -1 : 1) *
          (state.isReversed.value ? -1 : 1) *
          (props.vertical ? -1 : 1) *
          stepVal

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
      } else if (!state.focus.value) {
        return
      } else {
        const which = state.focus.value

        model.value = {
          ...model.value,
          [which]: between(
            state.roundValueFn.value(model.value[which] + offset),
            which === 'min' ? state.innerMin.value : model.value.min,
            which === 'max' ? state.innerMax.value : model.value.max
          )
        }
      }

      updateValue()
    }

    return () => {
      const content = methods.getContent(
        selectionBarStyle,
        trackContainerTabindex,
        trackContainerData,
        node => {
          node.push(getMinThumb(), getMaxThumb())
        }
      )

      return h(
        'div',
        {
          ref: rootRef,
          class:
            'q-range ' +
            state.classes.value +
            (modelProp.value.min === null || modelProp.value.max === null
              ? ' q-slider--no-value'
              : ''),
          ...rootAttrs.value
        },
        content
      )
    }
  }
})
