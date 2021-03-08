import { h, defineComponent, ref, computed, watch, getCurrentInstance } from 'vue'

import { useFormInject, useFormProps } from '../../composables/private/use-form.js'

import useSlider, {
  useSliderProps,
  useSliderEmits,
  getRatio,
  getModel,
  keyCodes
} from '../slider/use-slider.js'

import { stopAndPrevent } from '../../utils/event.js'
import { between } from '../../utils/format.js'
import { hDir } from '../../utils/private/render.js'

const dragType = {
  MIN: 0,
  RANGE: 1,
  MAX: 2
}

export default defineComponent({
  name: 'QRange',

  props: {
    ...useFormProps,
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

    name: String,

    dragRange: Boolean,
    dragOnlyRange: Boolean,

    leftLabelColor: String,
    leftLabelTextColor: String,
    rightLabelColor: String,
    rightLabelTextColor: String,

    leftLabelValue: [ String, Number ],
    rightLabelValue: [ String, Number ]
  },

  emits: useSliderEmits,

  setup (props, { emit }) {
    const { proxy: { $q } } = getCurrentInstance()

    const formAttrs = computed(() => {
      return {
        type: 'hidden',
        name: props.name,
        value: `${ props.modelValue.min }|${ props.modelValue.max }`
      }
    })

    const injectFormInput = useFormInject(formAttrs)

    const rootRef = ref(null)
    const model = ref({
      min: props.modelValue.min === null ? props.min : props.modelValue.min,
      max: props.modelValue.max === null ? props.max : props.modelValue.max
    })

    const nextFocus = ref(null)

    const curMinRatio = ref(0)
    const curMaxRatio = ref(0)

    const { state, methods } = useSlider({
      updateValue, updatePosition, getDragging
    })

    const modelMinRatio = computed(() => (
      state.minMaxDiff.value === 0 ? 0 : (model.value.min - props.min) / state.minMaxDiff.value
    ))

    const ratioMin = computed(() => (
      state.active.value === true ? curMinRatio.value : modelMinRatio.value
    ))

    const modelMaxRatio = computed(() => (
      state.minMaxDiff.value === 0 ? 0 : (model.value.max - props.min) / state.minMaxDiff.value
    ))

    const ratioMax = computed(() => (
      state.active.value === true ? curMaxRatio.value : modelMaxRatio.value
    ))

    const trackStyle = computed(() => ({
      [ state.positionProp.value ]: `${ 100 * ratioMin.value }%`,
      [ state.sizeProp.value ]: `${ 100 * (ratioMax.value - ratioMin.value) }%`
    }))

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

    const minProps = {
      domRef: ref(null),

      events: computed(() => (
        state.editable.value === true && $q.platform.is.mobile !== true && props.dragOnlyRange !== true
          ? {
              onFocus: () => { onFocus('min') },
              onBlur: methods.onBlur,
              onKeydown,
              onKeyup: methods.onKeyup
            }
          : {}
      )),

      thumbStyle: computed(() => ({
        [ state.positionProp.value ]: `${ 100 * ratioMin.value }%`,
        'z-index': nextFocus.value === 'min' ? 2 : void 0
      })),

      thumbClass: computed(() => (
        state.preventFocus.value === false && state.focus.value === 'min'
          ? ' q-slider--focus'
          : ''
      )),

      pinClass: computed(() => {
        const color = props.leftLabelColor || props.labelColor
        return color ? ` text-${ color }` : ''
      }),

      pinTextClass: computed(() => {
        const color = props.leftLabelTextColor || props.labelTextColor
        return color ? ` text-${ color }` : ''
      }),

      pinStyle: computed(() => {
        const percent = (props.reverse === true ? -ratioMin.value : ratioMin.value - 1)
        return methods.getPinStyle(percent, ratioMin.value)
      }),

      label: computed(() => (
        props.leftLabelValue !== void 0
          ? props.leftLabelValue
          : model.value.min
      ))
    }

    const maxProps = {
      domRef: ref(null),

      events: computed(() => (
        state.editable.value === true && $q.platform.is.mobile !== true && props.dragOnlyRange !== true
          ? {
              onFocus: () => { onFocus('max') },
              onBlur: methods.onBlur,
              onKeydown,
              onKeyup: methods.onKeyup
            }
          : {}
      )),

      thumbStyle: computed(() => ({
        [ state.positionProp.value ]: `${ 100 * ratioMax.value }%`
      })),

      thumbClass: computed(() => (
        state.preventFocus.value === false && state.focus.value === 'max'
          ? ' q-slider--focus'
          : ''
      )),

      pinClass: computed(() => {
        const color = props.rightLabelColor || props.labelColor
        return color ? ` text-${ color }` : ''
      }),

      pinTextClass: computed(() => {
        const color = props.rightLabelTextColor || props.labelTextColor
        return color ? ` text-${ color }` : ''
      }),

      pinStyle: computed(() => {
        const percent = (props.reverse === true ? -ratioMax.value : ratioMax.value - 1)
        return methods.getPinStyle(percent, ratioMax.value)
      }),

      label: computed(() => (
        props.rightLabelValue !== void 0
          ? props.rightLabelValue
          : model.value.max
      ))
    }

    watch(() => props.modelValue.min, val => {
      model.value.min = val === null
        ? props.min
        : val
    })

    watch(() => props.modelValue.max, val => {
      model.value.max = val === null
        ? props.max
        : val
    })

    watch(() => props.min, value => {
      if (model.value.min < value) {
        model.value.min = value
      }
      if (model.value.max < value) {
        model.value.max = value
      }
    })

    watch(() => props.max, value => {
      if (model.value.min > value) {
        model.value.min = value
      }
      if (model.value.max > value) {
        model.value.max = value
      }
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
              ? minProps.domRef.value.offsetHeight / (2 * height)
              : minProps.domRef.value.offsetWidth / (2 * width)
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

      const ratio = getRatio(event, dragging, state.isReversed.value, props.vertical)
      let type

      if (props.dragOnlyRange !== true && ratio < dragging.ratioMin + sensitivity) {
        type = dragType.MIN
      }
      else if (props.dragOnlyRange === true || ratio < dragging.ratioMax - sensitivity) {
        if (props.dragRange === true || props.dragOnlyRange === true) {
          type = dragType.RANGE
          Object.assign(dragging, {
            offsetRatio: ratio,
            offsetModel: getModel(ratio, props.min, props.max, props.step, state.decimals.value),
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
      const
        ratio = getRatio(event, dragging, state.isReversed.value, props.vertical),
        localModel = getModel(ratio, props.min, props.max, props.step, state.decimals.value)
      let pos

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
        curMinRatio.value = state.minMaxDiff.value === 0 ? 0 : (model.value.min - props.min) / state.minMaxDiff.value
        curMaxRatio.value = state.minMaxDiff.value === 0 ? 0 : (model.value.max - props.min) / state.minMaxDiff.value
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
          props.min,
          props.max - interval
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
            which === 'min' ? props.min : model.value.min,
            which === 'max' ? props.max : model.value.max
          )
        }
      }

      updateValue()
    }

    function getThumb (sideProps) {
      const child = [
        methods.getThumbSvg(),
        h('div', { class: 'q-slider__focus-ring' })
      ]

      if (props.label === true || props.labelAlways === true) {
        child.push(
          h('div', {
            class: `q-slider__pin q-slider__pin${ state.axis.value } absolute` + sideProps.pinClass.value,
            style: sideProps.pinStyle.value.pin
          }, [
            h('div', {
              class: `q-slider__pin-text-container q-slider__pin-text-container${ state.axis.value }`,
              style: sideProps.pinStyle.value.pinTextContainer
            }, [
              h('span', {
                class: 'q-slider__pin-text' + sideProps.pinTextClass.value
              }, sideProps.label.value)
            ])
          ]),

          h('div', {
            class: `q-slider__arrow q-slider__arrow${ state.axis.value }` + sideProps.pinClass.value
          })
        )
      }

      return h('div', {
        ref: sideProps.domRef,
        class: `q-slider__thumb-container q-slider__thumb-container${ state.axis.value } absolute non-selectable` + sideProps.thumbClass.value,
        style: sideProps.thumbStyle.value,
        ...sideProps.events.value,
        tabindex: props.dragOnlyRange !== true ? state.tabindex.value : null
      }, child)
    }

    return () => {
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

      const child = [
        h('div', {
          class: `q-slider__track-container q-slider__track-container${ state.axis.value } absolute`
        }, track),

        getThumb(minProps),
        getThumb(maxProps)
      ]

      if (props.name !== void 0 && props.disable !== true) {
        injectFormInput(child, 'push')
      }

      const data = {
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
          : null,
        ...events.value
      }

      return hDir('div', data, child, 'slide', state.editable.value, () => state.panDirective.value)
    }
  }
})
