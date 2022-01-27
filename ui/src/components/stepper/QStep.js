import { h, ref, computed, inject, getCurrentInstance, KeepAlive } from 'vue'

import QSlideTransition from '../slide-transition/QSlideTransition.js'
import StepHeader from './StepHeader.js'

import { usePanelChildProps } from '../../composables/private/use-panel.js'
import useCache from '../../composables/private/use-cache.js'

import { createComponent } from '../../utils/private/create.js'
import { stepperKey } from '../../utils/private/symbols.js'
import { hSlot } from '../../utils/private/render.js'

function getStepWrapper (slots) {
  return h('div', {
    class: 'q-stepper__step-content'
  }, [
    h('div', {
      class: 'q-stepper__step-inner'
    }, hSlot(slots.default))
  ])
}

const PanelWrapper = {
  setup (_, { slots }) {
    return () => getStepWrapper(slots)
  }
}

export default createComponent({
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

  setup (props, { attrs, slots }) {
    const { proxy: { $q } } = getCurrentInstance()

    const $stepper = inject(stepperKey, () => {
      console.error('QStep needs to be child of QStepper')
    })

    const { getCacheWithFn } = useCache()

    const rootRef = ref(null)

    const isActive = computed(() => $stepper.value.modelValue === props.name)

    const scrollEvent = computed(() => (
      ($q.platform.is.ios !== true && $q.platform.is.chrome === true)
        || isActive.value !== true
        || $stepper.value.vertical !== true
        ? {}
        : {
          onScroll (e) {
            const { target } = e
            if (target.scrollTop > 0) {
              target.scrollTop = 0
            }
            attrs.onScroll !== void 0 && attrs.onScroll(e)
          }
        }
    ))

    const contentKey = computed(() => (
      typeof props.name === 'string' || typeof props.name === 'number'
        ? props.name
        : String(props.name)
    ))

    function getStepContent () {
      const vertical = $stepper.value.vertical

      if (vertical === true && $stepper.value.keepAlive === true) {
        return h(
          KeepAlive,
          $stepper.value.keepAliveProps.value,
          isActive.value === true
            ? [
                h(
                  $stepper.value.needsUniqueKeepAliveWrapper.value === true
                    ? getCacheWithFn(contentKey.value, () => ({ ...PanelWrapper, name: contentKey.value }))
                    : PanelWrapper,
                  { key: contentKey.value },
                  slots.default
                )
              ]
            : void 0
        )
      }

      return vertical !== true || isActive.value === true
        ? getStepWrapper(slots)
        : void 0
    }

    return () => h(
      'div',
      { ref: rootRef, class: 'q-stepper__step', ...scrollEvent.value },
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
