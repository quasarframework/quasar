import { h, defineComponent, ref, computed, watch, nextTick, inject, KeepAlive } from 'vue'

import QSlideTransition from '../slide-transition/QSlideTransition.js'
import StepHeader from './StepHeader.js'

import { usePanelChildProps } from '../../composables/private/use-panel.js'

import { stepperKey } from '../../utils/private/symbols.js'
import { hSlot } from '../../utils/private/render.js'

function getStepWrapper (slots, key) {
  return h('div', {
    class: 'q-stepper__step-content',
    key
  }, [
    h('div', {
      class: 'q-stepper__step-inner'
    }, hSlot(slots.default))
  ])
}

export default defineComponent({
  name: 'QStep',

  props: {
    ...usePanelChildProps,

    icon: String,
    color: String,
    title: {
      type: String,
      required: true
    },
    caption: String,
    prefix: [ String, Number ],

    doneIcon: String,
    doneColor: String,
    activeIcon: String,
    activeColor: String,
    errorIcon: String,
    errorColor: String,

    headerNav: {
      type: Boolean,
      default: true
    },
    done: Boolean,
    error: Boolean
  },

  setup (props, { slots }) {
    const $stepper = inject(stepperKey, () => {
      console.error('QStep needs to be child of QStepper')
    })

    const rootRef = ref(null)

    const isActive = computed(() => $stepper.value.modelValue === props.name)

    watch(isActive, active => {
      if (
        active === true
        && $stepper.value.vertical === true
      ) {
        nextTick(() => {
          if (rootRef.value !== null) {
            rootRef.value.scrollTop = 0
          }
        })
      }
    })

    function getStepContent () {
      const vertical = $stepper.value.vertical
      return vertical === true && $stepper.value.keepAlive === true
        ? h(
            KeepAlive,
            isActive.value === true
              ? getStepWrapper(slots, props.name)
              : void 0
          )
        : (
            vertical !== true || isActive.value === true
              ? getStepWrapper(slots)
              : void 0
          )
    }

    return () => h(
      'div',
      { ref: rootRef, class: 'q-stepper__step' },
      $stepper.value.vertical === true
        ? [
            h(StepHeader, {
              stepper: $stepper.value,
              step: props,
              goToPanel: $stepper.value.goToPanel
            }),

            $stepper.value.animated === true
              ? h(QSlideTransition, getStepContent)
              : getStepContent()
          ]
        : [ getStepContent() ]
    )
  }
})
