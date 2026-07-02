import { computed, getCurrentInstance, h, ref, watch } from 'vue'

import { useFormAttrs } from '../../composables/use-form/private.use-form.js'

import useSlider, {
  keyCodes,
  useSliderEmits,
  useSliderProps
} from './use-slider.js'

import { createComponent } from '../../utils/private.create/create.js'
import { between } from '../../utils/format/format.js'
import { stopAndPrevent } from '../../utils/event/event.js'

const getNodeData = () => ({})

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/slider
 */
/**
 * What should the menu display after filtering options and none are left to be displayed; Suggestion: <div>
 *
 * @api slot marker-label
 * @scope marker {Object} Config for current marker label
 * @scope markerList {Array} Array of marker label configs
 * @scope markerMap {Object} Object with key-value where key is the model and the value is the marker label config
 * @scope classes {String} Required CSS classes to be applied to the marker element
 * @scope getStyle {Function} Get CSS style Object to apply to a marker element at respective model value; For perf reasons, use only if requested model value is not already part of markerMap
 */

/**
 * What should the menu display after filtering options and none are left to be displayed; Suggestion: <div>
 *
 * @api slot marker-label-group
 * @scope markerList {Array} Array of marker label configs
 * @scope markerMap {Object} Object with key-value where key is the model and the value is the marker label config
 * @scope classes {String} Required CSS classes to be applied to the marker element
 * @scope getStyle {Function} Get CSS style Object to apply to a marker element at respective model value; For perf reasons, use only if requested model value is not already part of markerMap
 */
export default createComponent({
  name: 'QSlider',

  props: {
    ...useSliderProps,

    /**
     * Model of the component (must be between min/max); Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive
     *
     * @api prop model-value
     * @type {Number|null|undefined}
     * @default null
     * @category model
     * @required
     * @syncable
     * @example # v-model="positionModel"
     */
    modelValue: {
      required: true,
      default: null,
      validator: v => typeof v === 'number' || v === null
    },

    /**
     * Override default label value
     *
     * @api prop label-value
     * @type {String|Number}
     * @category content
     * @example # :label-value="model + 'px'"
     */
    labelValue: [String, Number]
  },

  /**
   * @api event update:model-value
   * @extends update:model-value
   * @param {Number|null} value New model value
   */
  emits: useSliderEmits,

  setup(props, { emit }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()

    const { state, methods } = useSlider({
      updateValue,
      updatePosition,
      getDragging,
      formAttrs: useFormAttrs(props)
    })

    const rootRef = ref(null)
    const curRatio = ref(0)
    const model = ref(0)

    function normalizeModel() {
      model.value =
        props.modelValue === null
          ? state.innerMin.value
          : between(
              props.modelValue,
              state.innerMin.value,
              state.innerMax.value
            )
    }

    watch(
      () =>
        `${props.modelValue}|${state.innerMin.value}|${state.innerMax.value}`,
      normalizeModel,
      { immediate: true }
    )

    const modelRatio = computed(() => methods.convertModelToRatio(model.value))
    const ratio = computed(() =>
      state.active.value ? curRatio.value : modelRatio.value
    )

    const selectionBarStyle = computed(() => {
      const acc = {
        [state.positionProp.value]: `${100 * state.innerMinRatio.value}%`,
        [state.sizeProp.value]:
          `${100 * (ratio.value - state.innerMinRatio.value)}%`
      }
      if (props.selectionImg !== void 0) {
        acc.backgroundImage = `url(${props.selectionImg}) !important`
      }
      return acc
    })

    const getThumb = methods.getThumbRenderFn({
      focusValue: true,
      getNodeData,
      ratio,
      label: computed(() =>
        props.labelValue !== void 0 ? props.labelValue : model.value
      ),
      thumbColor: computed(() => props.thumbColor || props.color),
      labelColor: computed(() => props.labelColor),
      labelTextColor: computed(() => props.labelTextColor)
    })

    const trackContainerEvents = computed(() => {
      if (!state.editable.value) return {}

      return $q.platform.is.mobile
        ? { onClick: methods.onMobileClick }
        : {
            onMousedown: methods.onActivate,
            onFocus,
            onBlur: methods.onBlur,
            onKeydown,
            onKeyup: methods.onKeyup
          }
    })

    function updateValue(change) {
      if (model.value !== props.modelValue) {
        emit('update:modelValue', model.value)
      }

      if (change) emit('change', model.value)
    }

    function getDragging() {
      return rootRef.value.getBoundingClientRect()
    }

    function updatePosition(event, dragging = state.dragging.value) {
      const localRatio = methods.getDraggingRatio(event, dragging)

      model.value = methods.convertRatioToModel(localRatio)

      curRatio.value =
        !props.snap || props.step === 0
          ? localRatio
          : methods.convertModelToRatio(model.value)
    }

    function onFocus() {
      state.focus.value = true
    }

    function onKeydown(evt) {
      if (!keyCodes.includes(evt.keyCode)) return

      stopAndPrevent(evt)

      const stepVal =
          ([34, 33].includes(evt.keyCode) ? 10 : 1) * state.keyStep.value,
        offset =
          ([34, 37, 40].includes(evt.keyCode) ? -1 : 1) *
          (state.isReversed.value ? -1 : 1) *
          (props.vertical ? -1 : 1) *
          stepVal

      model.value = between(
        state.roundValueFn.value(model.value + offset),
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
        node => {
          node.push(getThumb())
        }
      )

      return h(
        'div',
        {
          ref: rootRef,
          class:
            state.classes.value +
            (props.modelValue === null ? ' q-slider--no-value' : ''),
          ...state.attributes.value,
          'aria-valuenow': props.modelValue
        },
        content
      )
    }
  }
})
