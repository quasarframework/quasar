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
      model.value.min = props.modelValue.min === null
        ? state.innerMin.value
        : between(props.modelValue.min, state.innerMin.value, state.innerMax.value)

      model.value.max = props.modelValue.max === null
        ? state.innerMax.value
        : between(props.modelValue.max, state.innerMin.value, state.innerMax.value)
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

      switch (dragging.type) {
        case dragType.MIN:
          if (ratio <= dragging.ratioMax) {
            pos = {
              minR: ratio,
              maxR: dragging.ratioMax,
              min: localModel,
              max: dragging.valueMax
            }
            state.focus.value = 'min'
          }
          else {
            pos = {
              minR: dragging.ratioMax,
              maxR: ratio,
              min: dragging.valueMax,
              max: localModel
            }
            state.focus.value = 'max'
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
            state.focus.value = 'max'
          }
          else {
            pos = {
              minR: ratio,
              maxR: dragging.ratioMin,
              min: localModel,
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
      if (!keyCodes.includes(evt.keyCode)) {
        return
      }

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

        model.value = {
          ...model.value,
          [ which ]: between(
            state.roundValueFn.value(model.value[ which ] + offset),
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
