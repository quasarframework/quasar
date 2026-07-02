import {
  computed,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'
import TouchPan from '../../directives/touch-pan/TouchPan.js'

import { createComponent } from '../../utils/private.create/create.js'
import {
  getScrollTarget,
  getVerticalScrollPosition,
  scrollTargetProp
} from '../../utils/scroll/scroll.js'
import { between } from '../../utils/format/format.js'
import { prevent } from '../../utils/event/event.js'
import { hDir, hSlot } from '../../utils/private.render/render.js'

const PULLER_HEIGHT = 40,
  OFFSET_TOP = 20

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/pull-to-refresh
 */
/**
 * Content (area controlled by the component) goes here
 *
 * @api slot default
 */
export default createComponent({
  name: 'QPullToRefresh',

  props: {
    /**
     * Color name for the icon from the Quasar Color Palette
     *
     * @api prop color
     * @extends color
     */
    color: String,
    /**
     * Color name for background of the icon container from the Quasar Color Palette
     *
     * @api prop bg-color
     * @extends color
     */
    bgColor: String,
    /**
     * Icon to display when refreshing the content
     *
     * @api prop icon
     * @extends icon
     */
    icon: String,
    /**
     * Don't listen for mouse events
     *
     * @api prop no-mouse
     * @type {Boolean}
     * @category behavior
     */
    noMouse: Boolean,
    /**
     * @api prop disable
     * @extends disable
     */
    disable: Boolean,

    /**
     * @api prop scroll-target
     * @extends scroll-target
     */
    scrollTarget: scrollTargetProp
  },

  emits: ['refresh'],

  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const state = ref('pull')
    const pullRatio = ref(0)
    const pulling = ref(false)
    const pullPosition = ref(-PULLER_HEIGHT)
    const animating = ref(false)
    const positionCSS = ref({})

    const style = computed(() => ({
      opacity: pullRatio.value,
      transform: `translateY(${pullPosition.value}px) rotate(${pullRatio.value * 360}deg)`
    }))

    const classes = computed(
      () =>
        'q-pull-to-refresh__puller row flex-center' +
        (animating.value ? ' q-pull-to-refresh__puller--animating' : '') +
        (props.bgColor !== void 0 ? ` bg-${props.bgColor}` : '')
    )

    function pull(event) {
      if (event.isFinal) {
        if (pulling.value) {
          pulling.value = false

          if (state.value === 'pulled') {
            state.value = 'refreshing'
            animateTo({ pos: OFFSET_TOP })
            trigger()
          } else if (state.value === 'pull') {
            animateTo({ pos: -PULLER_HEIGHT, ratio: 0 })
          }
        }

        return
      }

      if (animating.value || state.value === 'refreshing') {
        return false
      }

      if (event.isFirst) {
        if (
          getVerticalScrollPosition(localScrollTarget) !== 0 ||
          event.direction !== 'down'
        ) {
          if (pulling.value) {
            pulling.value = false
            state.value = 'pull'
            animateTo({ pos: -PULLER_HEIGHT, ratio: 0 })
          }

          return false
        }

        pulling.value = true

        const { top, left } = proxy.$el.getBoundingClientRect()
        positionCSS.value = {
          top: top + 'px',
          left: left + 'px',
          width: window.getComputedStyle(proxy.$el).getPropertyValue('width')
        }
      }

      prevent(event.evt)

      const distance = Math.min(140, Math.max(0, event.distance.y))
      pullPosition.value = distance - PULLER_HEIGHT
      pullRatio.value = between(distance / (OFFSET_TOP + PULLER_HEIGHT), 0, 1)

      const newState = pullPosition.value > OFFSET_TOP ? 'pulled' : 'pull'

      if (state.value !== newState) {
        state.value = newState
      }
    }

    const directives = computed(() => {
      // if props.disable === false
      const modifiers = { down: true }

      if (!props.noMouse) {
        modifiers.mouse = true
      }

      return [[TouchPan, pull, void 0, modifiers]]
    })

    const contentClass = computed(
      () =>
        `q-pull-to-refresh__content${pulling.value ? ' no-pointer-events' : ''}`
    )

    /**
     * Triggers a refresh
     *
     * @api method trigger
     */
    function trigger() {
      emit('refresh', () => {
        animateTo({ pos: -PULLER_HEIGHT, ratio: 0 }, () => {
          state.value = 'pull'
        })
      })
    }

    let localScrollTarget,
      timer = null

    function animateTo({ pos, ratio }, done) {
      animating.value = true
      pullPosition.value = pos

      if (ratio !== void 0) {
        pullRatio.value = ratio
      }

      if (timer !== null) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        animating.value = false
        done?.()
      }, 300)
    }

    /**
     * Updates the scroll target; Useful when the parent elements change so that the scrolling target also changes
     *
     * @api method updateScrollTarget
     */
    function updateScrollTarget() {
      localScrollTarget = getScrollTarget(proxy.$el, props.scrollTarget)
    }

    watch(() => props.scrollTarget, updateScrollTarget)

    onMounted(updateScrollTarget)

    onBeforeUnmount(() => {
      if (timer !== null) clearTimeout(timer)
    })

    // expose public methods
    Object.assign(proxy, { trigger, updateScrollTarget })

    return () => {
      const child = [
        h('div', { class: contentClass.value }, hSlot(slots.default)),

        h(
          'div',
          {
            class:
              'q-pull-to-refresh__puller-container fixed row flex-center no-pointer-events z-top',
            style: positionCSS.value
          },
          [
            h(
              'div',
              {
                class: classes.value,
                style: style.value
              },
              [
                state.value !== 'refreshing'
                  ? h(QIcon, {
                      name: props.icon || $q.iconSet.pullToRefresh.icon,
                      color: props.color,
                      size: '32px'
                    })
                  : h(QSpinner, {
                      size: '24px',
                      color: props.color
                    })
              ]
            )
          ]
        )
      ]

      return hDir(
        'div',
        { class: 'q-pull-to-refresh' },
        child,
        'main',
        !props.disable,
        () => directives.value
      )
    }
  }
})
