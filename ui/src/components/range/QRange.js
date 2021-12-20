import { h, ref, computed, watch, getCurrentInstance } from 'vue'

import useSlider, {
  useSliderProps,
  useSliderEmits,
  keyCodes
} from '../slider/use-slider.js'

import { createComponent } from '../../utils/private/create.js'
import { stopAndPrevent } from '../../utils/event.js'
import { between } from '../../utils/format.js'

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
      default: () => ({
        min: null,
        max: null
      }),
      validator (val) {
        return 'min' in val && 'max' in val
      }
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

    const model = ref({
      min: props.modelValue.min === null ? state.innerMin.value : props.modelValue.min,
      max: props.modelValue.max === null ? state.innerMax.value : props.modelValue.max
    })

    const nextFocus = ref(null)

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

    const events = computed(() => {
      if (state.editable.value !== true) {
        return {}
      }

      if ($q.platform.is.mobile === true) {
        return { onClick: methods.onMobileClick }
      }

      const evt = { onMousedown: methods.onActivate }

      props.dragOnlyRange === true && Object.assign(evt, {
        onFocus: () => { onFocus('both') },
        onBlur: methods.onBlur,
        onKeydown,
        onKeyup: methods.onKeyup
      })

      return evt
    })

    const minThumbRef = ref(null)
    const minEvents = computed(() => (
      state.editable.value === true && $q.platform.is.mobile !== true && props.dragOnlyRange !== true
        ? {
            onFocus: () => { onFocus('min') },
            onBlur: methods.onBlur,
            onKeydown,
            onKeyup: methods.onKeyup
          }
        : {}
    ))
    const getMinThumb = methods.getThumbRenderFn({
      focusValue: 'min',
      nextFocus,
      getNodeData: () => ({
        ref: minThumbRef,
        ...minEvents.value,
        tabindex: props.dragOnlyRange !== true ? state.tabindex.value : null
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

    const maxEvents = computed(() => (
      state.editable.value === true && $q.platform.is.mobile !== true && props.dragOnlyRange !== true
        ? {
            onFocus: () => { onFocus('max') },
            onBlur: methods.onBlur,
            onKeydown,
            onKeyup: methods.onKeyup
          }
        : {}
    ))
    const getMaxThumb = methods.getThumbRenderFn({
      focusValue: 'max',
      nextFocus,
      getNodeData: () => ({
        ...maxEvents.value,
        tabindex: props.dragOnlyRange !== true ? state.tabindex.value : null
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

    watch(
      () => props.modelValue.min + props.modelValue.max + state.innerMin.value + state.innerMax.value,
      () => {
        model.value.min = props.modelValue.min === null
          ? state.innerMin.value
          : between(props.modelValue.min, state.innerMin.value, state.innerMax.value)

        model.value.max = props.modelValue.max === null
          ? state.innerMax.value
          : between(props.modelValue.max, state.innerMin.value, state.innerMax.value)
      }
    )

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

      let type
      const ratio = methods.getDraggingRatio(event, dragging)

      if (props.dragOnlyRange !== true && ratio < dragging.ratioMin + sensitivity) {
        type = dragType.MIN
      }
      else if (props.dragOnlyRange === true || ratio < dragging.ratioMax - sensitivity) {
        if (props.dragRange === true || props.dragOnlyRange === true) {
          type = dragType.RANGE
          Object.assign(dragging, {
            offsetRatio: ratio,
            offsetModel: methods.convertRatioToModel(ratio),
            rangeValue: dragging.valueMax - dragging.valueMin,
            rangeRatio: dragging.ratioMax - dragging.ratioMin
          })
        }
        else {
          type = dragging.ratioMax - ratio < ratio - dragging.ratioMin
            ? dragType.MAX
            : dragType.MIN
        }
      }
      else {
        type = dragType.MAX
      }

      dragging.type = type
      nextFocus.value = null

      return dragging
    }

    function updatePosition (event, dragging = state.dragging.value) {
      let pos
      const ratio = methods.getDraggingRatio(event, dragging)
      const localModel = methods.convertRatioToModel(ratio)

      switch (dragging.type) {
        case dragType.MIN:
          if (ratio <= dragging.ratioMax) {
            pos = {
              minR: ratio,
              maxR: dragging.ratioMax,
              min: localModel,
              max: dragging.valueMax
            }
            nextFocus.value = 'min'
          }
          else {
            pos = {
              minR: dragging.ratioMax,
              maxR: ratio,
              min: dragging.valueMax,
              max: localModel
            }
            nextFocus.value = 'max'
          }
          break

        case dragType.MAX:
          if (ratio >= dragging.ratioMin) {
            pos = {
              minR: dragging.ratioMin,
              maxR: ratio,
              min: dragging.valueMin,
              max: localModel
            }
            nextFocus.value = 'max'
          }
          else {
            pos = {
              minR: ratio,
              maxR: dragging.ratioMin,
              min: localModel,
              max: dragging.valueMin
            }
            nextFocus.value = 'min'
          }
          break

        case dragType.RANGE:
          const
            ratioDelta = ratio - dragging.offsetRatio,
            minR = between(dragging.ratioMin + ratioDelta, 0, 1 - dragging.rangeRatio),
            modelDelta = localModel - dragging.offsetModel,
            min = between(dragging.valueMin + modelDelta, props.min, props.max - dragging.rangeValue)

          pos = {
            minR,
            maxR: minR + dragging.rangeRatio,
            min: parseFloat(min.toFixed(state.decimals.value)),
            max: parseFloat((min + dragging.rangeValue).toFixed(state.decimals.value))
          }
          break
      }

      model.value = {
        min: pos.min,
        max: pos.max
      }

      // If either of the values to be emitted are null, set them to the defaults the user has entered.
      if (model.value.min === null || model.value.max === null) {
        model.value.min = pos.min || props.min
        model.value.max = pos.max || props.max
      }

      if (props.snap !== true || props.step === 0) {
        curMinRatio.value = pos.minR
        curMaxRatio.value = pos.maxR
      }
      else {
        curMinRatio.value = state.trackLen.value === 0 ? 0 : (model.value.min - props.min) / state.trackLen.value
        curMaxRatio.value = state.trackLen.value === 0 ? 0 : (model.value.max - props.min) / state.trackLen.value
      }
    }

    function onFocus (which) {
      state.focus.value = which
    }

    function onKeydown (evt) {
      if (!keyCodes.includes(evt.keyCode)) {
        return
      }

      stopAndPrevent(evt)

      const
        stepVal = ([ 34, 33 ].includes(evt.keyCode) ? 10 : 1) * props.step,
        offset = [ 34, 37, 40 ].includes(evt.keyCode) ? -stepVal : stepVal

      if (props.dragOnlyRange) {
        const interval = props.dragOnlyRange
          ? model.value.max - model.value.min
          : 0

        const min = between(
          parseFloat((model.value.min + offset).toFixed(state.decimals.value)),
          state.innerMin.value,
          state.innerMax.value - interval
        )

        model.value = {
          min,
          max: parseFloat((min + interval).toFixed(state.decimals.value))
        }
      }
      else if (state.focus.value === false) {
        return
      }
      else {
        const which = state.focus.value

        model.value = {
          ...model.value,
          [ which ]: between(
            parseFloat((model.value[ which ] + offset).toFixed(state.decimals.value)),
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
        events,
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
        'aria-valuenow': props.modelValue.min + '|' + props.modelValue.max,
        tabindex: props.dragOnlyRange === true && $q.platform.is.mobile !== true
          ? state.tabindex.value
          : null
      }, content)
    }
  }
})
