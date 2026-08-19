import { computed, h, ref, watch } from 'vue'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import { useFormAttrs } from '../../composables/use-form/private.use-form.js'
import useSplitAttrs from '../../composables/use-split-attrs/use-split-attrs.js'

import useSlider, {
  keyCodes,
  useSliderEmits,
  useSliderProps
} from './use-slider.js'

import { createComponent } from '../../utils/private.create/create.js'
import { between } from '../../utils/format/format.js'
import { stopAndPrevent } from '../../utils/event/event.js'

const getNodeData = () => ({})

export default /*#__PURE__*/ createComponent({
  name: 'QSlider',

  props: {
    ...useSliderProps,

    modelValue: {
      required: true,
      default: null,
      validator: v => typeof v === 'number' || v === null
    },

    labelValue: [String, Number]
  },

  emits: useSliderEmits,

  // fall-through attributes (aria-label & friends) are routed to the
  // focusable track container, which carries the slider role; only
  // class/style (and listeners) stay on the root element
  inheritAttrs: false,

  setup(props, { emit, attrs }) {
    const $q = useQuasar()

    const splitAttrs = useSplitAttrs()

    const { state, methods } = useSlider({
      updateValue,
      updatePosition,
      getDragging,
      formAttrs: useFormAttrs(props)
    })

    const rootRef = ref(null)
    const curRatio = ref(0)
    const model = ref(0)

    // "change" reports what an interaction actually changed: the value is
    // snapshotted when the interaction starts (pointer via getDragging,
    // keyboard on its first keydown) and compared at commit time, so an
    // interaction that ends where it started stays silent
    let changeBaseline = null

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

      // one wiring for every device: dragging is TouchPan's job either way,
      // taps land through onClick (the compatibility mousedown/mouseup pair
      // a tap also fires converges to the same state, with the change event
      // de-duplicated by changeBaseline), a mouse/pen press reacts
      // immediately through onActivate, and the keyboard works everywhere,
      // not only on desktop UAs (the track is focusable everywhere)
      return {
        onClick: methods.onMobileClick,
        onMousedown: methods.onActivate,
        onFocus,
        onBlur: methods.onBlur,
        onKeydown,
        onKeyup: methods.onKeyup
      }
    })

    // the WAI-ARIA slider is the track container — the same element
    // that is focusable and handles the keyboard
    const trackContainerAriaAttrs = computed(() => {
      const acc = {
        role: 'slider',
        'aria-orientation': state.orientation.value,
        'aria-valuemin': state.innerMin.value,
        'aria-valuemax': state.innerMax.value,
        // the slider role requires aria-valuenow; a null model still renders
        // a thumb, parked at the minimum (see normalizeModel), so expose that
        'aria-valuenow':
          props.modelValue === null ? state.innerMin.value : props.modelValue,
        'data-step': props.step
      }

      if (props.labelValue !== void 0) {
        acc['aria-valuetext'] = props.labelValue
      } else if (props.modelValue === null) {
        // aria-valuenow has to report a number, so spell out what that
        // number means: nothing has been picked yet
        acc['aria-valuetext'] = $q.lang.label.noValue
      }

      if (props.disable) {
        acc['aria-disabled'] = 'true'
      } else if (props.readonly) {
        acc['aria-readonly'] = 'true'
      }

      return acc
    })

    const trackContainerData = computed(() => ({
      ...trackContainerAriaAttrs.value,
      // consumer-supplied attributes (aria-label etc.) win
      ...splitAttrs.attributes.value,
      ...trackContainerEvents.value
    }))

    function updateValue(change) {
      if (model.value !== props.modelValue) {
        emit('update:modelValue', model.value)
      }

      if (change) {
        if (changeBaseline !== null && changeBaseline !== model.value) {
          emit('change', model.value)
        }
        changeBaseline = null
      }
    }

    function getDragging() {
      changeBaseline = model.value
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

      if (changeBaseline === null) {
        changeBaseline = model.value
      }

      // HOME/END jump straight to the limits (never direction-reversed)
      if (evt.keyCode === 36 || evt.keyCode === 35) {
        model.value =
          evt.keyCode === 36 ? state.innerMin.value : state.innerMax.value

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
        trackContainerData,
        node => {
          node.push(getThumb())
        }
      )

      return h(
        'div',
        {
          ref: rootRef,
          class: [
            state.classes.value +
              (props.modelValue === null ? ' q-slider--no-value' : ''),
            attrs.class
          ],
          style: attrs.style,
          ...splitAttrs.listeners.value
        },
        content
      )
    }
  }
})
