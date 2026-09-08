import {
  KeepAlive,
  Transition,
  computed,
  h,
  inject,
  nextTick,
  shallowRef,
  watch
} from 'vue'

import StepHeader from './StepHeader.js'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import { usePanelChildProps } from '../../composables/private.use-panel/use-panel.js'
import useRenderCache from '../../composables/use-render-cache/use-render-cache.js'
import useSlideTransition from '../../composables/private.use-slide-transition/use-slide-transition.js'

import { createComponent } from '../../utils/private.create/create.js'
import {
  emptyRenderFn,
  stepperKey
} from '../../utils/private.symbols/symbols.js'
import { hSlot } from '../../utils/private.render/render.js'

function getStepWrapper(slots, vertical, style) {
  return h(
    'div',
    {
      class: 'q-stepper__step-content' + (vertical ? '' : ' q-panel scroll'),
      style
    },
    [
      h(
        'div',
        {
          class: `q-stepper__step-inner q-stepper__step-inner--${vertical ? 'vertical' : 'horizontal'}`
        },
        hSlot(slots.default)
      )
    ]
  )
}

// only used by the keep-alive branch
const PanelWrapper = {
  props: { vertical: Boolean },
  setup(props, { slots }) {
    return () => getStepWrapper(slots, props.vertical)
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
    const $q = useQuasar()

    const $stepper = inject(stepperKey, emptyRenderFn)
    if ($stepper === emptyRenderFn) {
      console.error('QStep needs to be a child of QStepper')
      return emptyRenderFn
    }

    const { getCache } = useRenderCache()
    const { onEnter, onLeave } = useSlideTransition(() =>
      Number($stepper.value.transitionDuration)
    )

    const rootRef = shallowRef(null)

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

    // one Transition vnode serves both orientations (a height slide when
    // vertical, the stepper's panel slide when horizontal) so the content
    // inside it survives an orientation switch
    const transitionProps = computed(() => {
      if ($stepper.value.vertical) {
        return { css: false, onEnter, onLeave }
      }

      const name = $stepper.value.panelTransition.value

      return name === null
        ? {}
        : {
            name,
            // stepping back, the leaving step sits after the entering one
            // in DOM order; its absolute box gets pinned to the top
            leaveActiveClass: `${name}-leave-active q-stepper__step-content--leaving`
          }
    })

    // a Transition takes a leave's classes from the render that last held
    // the child; the stepper changes its transition name and its model in
    // one flush, so the render dropping the content is also the one meant
    // to carry the new name: the content lingers for one more flush (well
    // before any paint), rendered with the name the leave needs
    const lingering = shallowRef(false)

    watch(isActive, active => {
      if (active || $stepper.value.vertical || !$stepper.value.animated) {
        lingering.value = false
        return
      }

      lingering.value = true
      nextTick(() => {
        lingering.value = false
      })
    })

    function getStepContent() {
      if (!isActive.value && !lingering.value) return

      const { vertical } = $stepper.value
      const style = vertical
        ? void 0
        : `--q-transition-duration: ${$stepper.value.transitionDuration}ms`

      if (!$stepper.value.keepAlive) {
        return getStepWrapper(slots, vertical, style)
      }

      return h(
        $stepper.value.needsUniqueKeepAliveWrapper.value
          ? getCache(contentKey.value, () => ({
              ...PanelWrapper,
              name: String(contentKey.value)
            }))
          : PanelWrapper,
        { key: contentKey.value, vertical, style },
        slots.default
      )
    }

    function getContent() {
      const content = getStepContent()

      return $stepper.value.keepAlive
        ? h(
            KeepAlive,
            $stepper.value.keepAliveProps.value,
            content !== void 0 ? [content] : void 0
          )
        : content
    }

    const classes = computed(
      () =>
        `q-stepper__step q-stepper__step--${$stepper.value.vertical ? 'vertical' : 'horizontal'}`
    )

    return () => {
      const { vertical, animated } = $stepper.value

      // an inactive horizontal step keeps an (empty) root so that its
      // instance and the content's leave transition survive; it carries
      // no landmark though
      const labelled = vertical || isActive.value

      const children = [
        animated
          ? h(
              Transition,
              { key: 'content', ...transitionProps.value },
              getContent
            )
          : getContent()
      ]

      if (vertical) {
        children.unshift(
          h(StepHeader, {
            key: 'header',
            stepper: $stepper.value,
            step: props,
            goToPanel: $stepper.value.goToPanel
          })
        )
      }

      return h(
        'div',
        {
          ref: rootRef,
          class: classes.value,
          // steppers are not a WAI-ARIA tabs pattern (the active step is
          // conveyed through aria-current on the header instead)
          role: labelled ? 'group' : void 0,
          'aria-label': labelled ? props.title : void 0,
          ...scrollEvent.value
        },
        children
      )
    }
  }
})
