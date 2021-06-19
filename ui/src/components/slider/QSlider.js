import { h, defineComponent, ref, computed, watch, getCurrentInstance } from 'vue'

import { useFormInject, useFormProps, useFormAttrs } from '../../composables/private/use-form.js'

import useSlider, {
  useSliderProps,
  useSliderEmits,
  getRatio,
  getModel,
  keyCodes
} from './use-slider.js'

import { between } from '../../utils/format.js'
import { stopAndPrevent } from '../../utils/event.js'
import { hDir } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QSlider',

  props: {
    ...useSliderProps,
    ...useFormProps,

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

    const formAttrs = useFormAttrs(props)
    const injectFormInput = useFormInject(formAttrs)

    const rootRef = ref(null)
    const model = ref(props.modelValue === null ? props.min : props.modelValue)
    const curRatio = ref(0)

    const { state, methods } = useSlider({
      updateValue, updatePosition, getDragging
    })

    const modelRatio = computed(() => (
      state.minMaxDiff.value === 0 ? 0 : (model.value - props.min) / state.minMaxDiff.value
    ))
    const ratio = computed(() => (state.active.value === true ? curRatio.value : modelRatio.value))

    const trackStyle = computed(() => ({
      [ state.positionProp.value ]: 0,
      [ state.sizeProp.value ]: `${ 100 * ratio.value }%`
    }))

    const thumbStyle = computed(() => ({
      [ state.positionProp.value ]: `${ 100 * ratio.value }%`
    }))

    const thumbClass = computed(() => (
      state.preventFocus.value === false && state.focus.value === true
        ? ' q-slider--focus'
        : ''
    ))

    const pinClass = computed(() => (
      props.labelColor !== void 0
        ? `text-${ props.labelColor }`
        : ''
    ))

    const pinTextClass = computed(() =>
      'q-slider__pin-value-marker-text'
      + (props.labelTextColor !== void 0 ? ` text-${ props.labelTextColor }` : '')
    )

    const events = computed(() => {
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

    const label = computed(() => (
      props.labelValue !== void 0
        ? props.labelValue
        : model.value
    ))

    const pinStyle = computed(() => {
      const percent = (props.reverse === true ? -ratio.value : ratio.value - 1)
      return methods.getPinStyle(percent, ratio.value)
    })

    watch(() => props.modelValue, v => {
      model.value = v === null
        ? 0
        : between(v, props.min, props.max)
    })

    watch(() => props.min + props.max, () => {
      model.value = between(model.value, props.min, props.max)
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
      const ratio = getRatio(
        event,
        dragging,
        state.isReversed.value,
        props.vertical
      )

      model.value = getModel(ratio, props.min, props.max, props.step, state.decimals.value)
      curRatio.value = props.snap !== true || props.step === 0
        ? ratio
        : (
            state.minMaxDiff.value === 0 ? 0 : (model.value - props.min) / state.minMaxDiff.value
          )
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
        offset = [ 34, 37, 40 ].includes(evt.keyCode) ? -stepVal : stepVal

      model.value = between(
        parseFloat((model.value + offset).toFixed(state.decimals.value)),
        props.min,
        props.max
      )

      updateValue()
    }

    return () => {
      const child = [
        methods.getThumbSvg(),
        h('div', { class: 'q-slider__focus-ring' })
      ]

      if (props.label === true || props.labelAlways === true) {
        child.push(
          h('div', {
            class: `q-slider__pin q-slider__pin${ state.axis.value } absolute ` + pinClass.value,
            style: pinStyle.value.pin
          }, [
            h('div', {
              class: `q-slider__pin-text-container q-slider__pin-text-container${ state.axis.value }`,
              style: pinStyle.value.pinTextContainer
            }, [
              h('span', {
                class: 'q-slider__pin-text ' + pinTextClass.value
              }, [
                label.value
              ])
            ])
          ]),

          h('div', {
            class: `q-slider__arrow q-slider__arrow${ state.axis.value } ${ pinClass.value }`
          })
        )
      }

      if (props.name !== void 0 && props.disable !== true) {
        injectFormInput(child, 'push')
      }

      const track = [
        h('div', {
          class: `q-slider__track q-slider__track${ state.axis.value } absolute`,
          style: trackStyle.value
        })
      ]

      props.markers === true && track.push(
        h('div', {
          class: `q-slider__track-markers q-slider__track-markers${ state.axis.value } absolute-full fit`,
          style: state.markerStyle.value
        })
      )

      const content = [
        h('div', {
          class: `q-slider__track-container q-slider__track-container${ state.axis.value } absolute`
        }, track),

        h('div', {
          class: `q-slider__thumb-container q-slider__thumb-container${ state.axis.value } absolute non-selectable` + thumbClass.value,
          style: thumbStyle.value
        }, child)
      ]

      const data = {
        ref: rootRef,
        class: state.classes.value + (props.modelValue === null ? ' q-slider--no-value' : ''),
        ...state.attributes.value,
        'aria-valuenow': props.modelValue,
        tabindex: state.tabindex.value,
        ...events.value
      }

      return hDir('div', data, content, 'slide', state.editable.value, () => state.panDirective.value)
    }
  }
})
