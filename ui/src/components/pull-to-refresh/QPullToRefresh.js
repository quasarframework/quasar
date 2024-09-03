import { h, ref, computed, watch, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'

import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'
import TouchPan from '../../directives/touch-pan/TouchPan.js'

import { createComponent } from '../../utils/private.create/create.js'
import { getScrollTarget, getVerticalScrollPosition, scrollTargetProp } from '../../utils/scroll/scroll.js'
import { between } from '../../utils/format/format.js'
import { prevent } from '../../utils/event/event.js'
import { hSlot, hDir } from '../../utils/private.render/render.js'

const
  PULLER_HEIGHT = 40,
  OFFSET_TOP = 20

export default createComponent({
  name: 'QPullToRefresh',

  props: {
    color: String,
    bgColor: String,
    icon: String,
    noMouse: Boolean,
    disable: Boolean,

    scrollTarget: scrollTargetProp
  },

  emits: [ 'refresh' ],

  setup (props, { slots, emit }) {
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
      transform: `translateY(${ pullPosition.value }px) rotate(${ pullRatio.value * 360 }deg)`
    }))

    const classes = computed(() =>
      'q-pull-to-refresh__puller row flex-center'
      + (animating.value === true ? ' q-pull-to-refresh__puller--animating' : '')
      + (props.bgColor !== void 0 ? ` bg-${ props.bgColor }` : '')
    )

    function pull (event) {
      if (event.isFinal === true) {
        if (pulling.value === true) {
          pulling.value = false

          if (state.value === 'pulled') {
            state.value = 'refreshing'
            animateTo({ pos: OFFSET_TOP })
            trigger()
          }
          else if (state.value === 'pull') {
            animateTo({ pos: -PULLER_HEIGHT, ratio: 0 })
          }
        }

        return
      }

      if (animating.value === true || state.value === 'refreshing') {
        return false
      }

      if (event.isFirst === true) {
        if (getVerticalScrollPosition(localScrollTarget) !== 0 || event.direction !== 'down') {
          if (pulling.value === true) {
            pulling.value = false
            state.value = 'pull'
            animateTo({ pos: -PULLER_HEIGHT, ratio: 0 })
          }

          return false
        }

        pulling.value = true

        const { top, left } = $el.getBoundingClientRect()
        positionCSS.value = {
          top: top + 'px',
          left: left + 'px',
          width: window.getComputedStyle($el).getPropertyValue('width')
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

      if (props.noMouse !== true) {
        modifiers.mouse = true
      }

      return [ [
        TouchPan,
        pull,
        void 0,
        modifiers
      ] ]
    })

    const contentClass = computed(() =>
      `q-pull-to-refresh__content${ pulling.value === true ? ' no-pointer-events' : '' }`
    )

    function trigger () {
      emit('refresh', () => {
        animateTo({ pos: -PULLER_HEIGHT, ratio: 0 }, () => {
          state.value = 'pull'
        })
      })
    }

    let $el, localScrollTarget, timer = null

    function animateTo ({ pos, ratio }, done) {
      animating.value = true
      pullPosition.value = pos

      if (ratio !== void 0) {
        pullRatio.value = ratio
      }

      timer !== null && clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        animating.value = false
        done && done()
      }, 300)
    }

    function updateScrollTarget () {
      localScrollTarget = getScrollTarget($el, props.scrollTarget)
    }

    watch(() => props.scrollTarget, updateScrollTarget)

    onMounted(() => {
      $el = proxy.$el
      updateScrollTarget()
    })

    onBeforeUnmount(() => {
      timer !== null && clearTimeout(timer)
    })

    // expose public methods
    Object.assign(proxy, { trigger, updateScrollTarget })

    return () => {
      const child = [
        h('div', { class: contentClass.value }, hSlot(slots.default)),

        h('div', {
          class: 'q-pull-to-refresh__puller-container fixed row flex-center no-pointer-events z-top',
          style: positionCSS.value
        }, [
          h('div', {
            class: classes.value,
            style: style.value
          }, [
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
          ])
        ])
      ]

      return hDir(
        'div',
        { class: 'q-pull-to-refresh' },
        child,
        'main',
        props.disable === false,
        () => directives.value
      )
    }
  }
})
