import { KeepAlive, computed, getCurrentInstance, h, inject, ref } from 'vue'

import QSlideTransition from '../slide-transition/QSlideTransition.js'
import StepHeader from './StepHeader.js'

import { usePanelChildProps } from '../../composables/private.use-panel/use-panel.js'
import useRenderCache from '../../composables/use-render-cache/use-render-cache.js'

import { createComponent } from '../../utils/private.create/create.js'
import {
  emptyRenderFn,
  stepperKey
} from '../../utils/private.symbols/symbols.js'
import { hSlot } from '../../utils/private.render/render.js'

function getStepWrapper(slots) {
  return h(
    'div',
    {
      class: 'q-stepper__step-content'
    },
    [
      h(
        'div',
        {
          class: 'q-stepper__step-inner'
        },
        hSlot(slots.default)
      )
    ]
  )
}

const PanelWrapper = {
  setup(_, { slots }) {
    return () => getStepWrapper(slots)
  }
}

export default /*#__PURE__*/ createComponent({
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
    prefix: [String, Number],

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
    error: Boolean,

    onScroll: [Function, Array]
  },

  setup(props, { slots, emit }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()

    const $stepper = inject(stepperKey, emptyRenderFn)
    if ($stepper === emptyRenderFn) {
      console.error('QStep needs to be a child of QStepper')
      return emptyRenderFn
    }

    const { getCache } = useRenderCache()

    const rootRef = ref(null)

    const isActive = computed(() => $stepper.value.modelValue === props.name)

    const scrollEvent = computed(() =>
      (!$q.platform.is.ios && $q.platform.is.chrome) ||
      !isActive.value ||
      !$stepper.value.vertical
        ? {}
        : {
            onScroll(e) {
              const { target } = e
              if (target.scrollTop > 0) {
                target.scrollTop = 0
              }

              if (props.onScroll !== void 0) emit('scroll', e)
            }
          }
    )

    const contentKey = computed(() =>
      typeof props.name === 'string' || typeof props.name === 'number'
        ? props.name
        : String(props.name)
    )

    function getStepContent() {
      const vertical = $stepper.value.vertical

      if (vertical && $stepper.value.keepAlive) {
        return h(
          KeepAlive,
          $stepper.value.keepAliveProps.value,
          isActive.value
            ? [
                h(
                  $stepper.value.needsUniqueKeepAliveWrapper.value
                    ? getCache(contentKey.value, () => ({
                        ...PanelWrapper,
                        name: contentKey.value
                      }))
                    : PanelWrapper,
                  { key: contentKey.value },
                  slots.default
                )
              ]
            : void 0
        )
      }

      return !vertical || isActive.value ? getStepWrapper(slots) : void 0
    }

    return () =>
      h(
        'div',
        {
          ref: rootRef,
          class: 'q-stepper__step',
          role: 'tabpanel',
          ...scrollEvent.value
        },
        $stepper.value.vertical
          ? [
              h(StepHeader, {
                stepper: $stepper.value,
                step: props,
                goToPanel: $stepper.value.goToPanel
              }),

              $stepper.value.animated
                ? h(QSlideTransition, getStepContent)
                : getStepContent()
            ]
          : [getStepContent()]
      )
  }
})
