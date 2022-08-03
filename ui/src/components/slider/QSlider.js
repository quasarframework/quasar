import { h, ref, computed, watch, getCurrentInstance } from 'vue'

import { useFormAttrs } from '../../composables/private/use-form.js'

import useSlider, {
  useSliderProps,
  useSliderEmits,
  keyCodes
} from './use-slider.js'

import { createComponent } from '../../utils/private/create.js'
import { between } from '../../utils/format.js'
import { stopAndPrevent } from '../../utils/event.js'

const getNodeData = () => ({})

export default createComponent({
  name: 'QSlider',

  props: {
    ...useSliderProps,

    modelValue: {
      required: true,
      default: null,
      validator: v => typeof v === 'number' || v === null
    },

    labelValue: [ String, Number ]
  },

  emits: useSliderEmits,

  setup (props, { emit }) {
    const { proxy: { $q } } = getCurrentInstance()

    const { state, methods } = useSlider({
      updateValue, updatePosition, getDragging,
      formAttrs: useFormAttrs(props)
    })

    const rootRef = ref(null)
    const curRatio = ref(0)
    const model = ref(0)

    function normalizeModel () {
      model.value = props.modelValue === null
        ? state.innerMin.value
        : between(props.modelValue, state.innerMin.value, state.innerMax.value)
    }

    watch(
      () => `${ props.modelValue }|${ state.innerMin.value }|${ state.innerMax.value }`,
      normalizeModel
    )

    normalizeModel()

    const modelRatio = computed(() => methods.convertModelToRatio(model.value))
    const ratio = computed(() => (state.active.value === true ? curRatio.value : modelRatio.value))

    const selectionBarStyle = computed(() => {
      const acc = {
        [ state.positionProp.value ]: `${ 100 * state.innerMinRatio.value }%`,
        [ state.sizeProp.value ]: `${ 100 * (ratio.value - state.innerMinRatio.value) }%`
      }
      if (props.selectionImg !== void 0) {
        acc.backgroundImage = `url(${ props.selectionImg }) !important`
      }
      return acc
    })

    const getThumb = methods.getThumbRenderFn({
      focusValue: true,
      getNodeData,
      ratio,
      label: computed(() => (
        props.labelValue !== void 0
          ? props.labelValue
          : model.value
      )),
      thumbColor: computed(() => props.thumbColor || props.color),
      labelColor: computed(() => props.labelColor),
      labelTextColor: computed(() => props.labelTextColor)
    })

    const trackContainerEvents = computed(() => {
      if (state.editable.value !== true) {
        return {}
      }

      return $q.platform.is.mobile === true
        ? { onClick: methods.onMobileClick }
        : {
            onMousedown: methods.onActivate,
            onFocus,
            onBlur: methods.onBlur,
            onKeydown,
            onKeyup: methods.onKeyup
          }
    })

    function updateValue (change) {
      if (model.value !== props.modelValue) {
        emit('update:modelValue', model.value)
      }
      change === true && emit('change', model.value)
    }

    function getDragging () {
      return rootRef.value.getBoundingClientRect()
    }

    function updatePosition (event, dragging = state.dragging.value) {
      const ratio = methods.getDraggingRatio(event, dragging)

      model.value = methods.convertRatioToModel(ratio)

      curRatio.value = props.snap !== true || props.step === 0
        ? ratio
        : methods.convertModelToRatio(model.value)
    }

    function onFocus () {
      state.focus.value = true
    }

    function onKeydown (evt) {
      if (!keyCodes.includes(evt.keyCode)) {
        return
      }

      stopAndPrevent(evt)

      const
        stepVal = ([ 34, 33 ].includes(evt.keyCode) ? 10 : 1) * state.step.value,
        offset = ([ 34, 37, 40 ].includes(evt.keyCode) ? -1 : 1) * (state.isReversed.value === true ? -1 : 1) * stepVal

      model.value = between(
        parseFloat((model.value + offset).toFixed(state.decimals.value)),
        state.innerMin.value,
        state.innerMax.value
      )

      updateValue()
    }

    return () => {
      const content = methods.getContent(
        selectionBarStyle,
        state.tabindex,
        trackContainerEvents,
        node => { node.push(getThumb()) }
      )

      return h('div', {
        ref: rootRef,
        class: state.classes.value + (props.modelValue === null ? ' q-slider--no-value' : ''),
        ...state.attributes.value,
        'aria-valuenow': props.modelValue
      }, content)
    }
  }
})
