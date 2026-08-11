import {
  computed,
  getCurrentInstance,
  h,
  onUnmounted,
  provide,
  reactive,
  ref,
  watch
} from 'vue'

import { isRuntimeSsrPreHydration } from '../../plugins/platform/Platform.js'

import QScrollObserver from '../scroll-observer/QScrollObserver.js'
import QResizeObserver from '../resize-observer/QResizeObserver.js'

import { createComponent } from '../../utils/private.create/create.js'
import { getScrollbarWidth } from '../../utils/scroll/scroll.js'
import { hMergeSlot } from '../../utils/private.render/render.js'
import { layoutKey } from '../../utils/private.symbols/symbols.js'

const viewRE = /^(h|l)h(h|r) lpr (f|l)f(f|r)$/

export default /*#__PURE__*/ createComponent({
  name: 'QLayout',

  props: {
    container: Boolean,
    view: {
      type: String,
      default: 'hhh lpr fff',
      validator: v => viewRE.test(v.toLowerCase())
    },

    onScroll: Function,
    onScrollHeight: Function,
    onResize: Function
  },

  setup(props, { slots, emit }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()

    const rootRef = ref(null)

    // page related
    const height = ref($q.screen.height)
    const width = ref(props.container ? 0 : $q.screen.width)
    const scroll = ref({ position: 0, direction: 'down', inflectionPoint: 0 })

    // container only prop
    const containerHeight = ref(0)
    const scrollbarWidth = ref(
      isRuntimeSsrPreHydration.value ? 0 : getScrollbarWidth()
    )

    const classes = computed(
      () =>
        'q-layout q-layout--' + (props.container ? 'containerized' : 'standard')
    )

    const style = computed(() =>
      props.container ? null : { minHeight: $q.screen.height + 'px' }
    )

    // used by container only
    const targetStyle = computed(() =>
      scrollbarWidth.value !== 0
        ? {
            [$q.lang.rtl ? 'left' : 'right']: `${scrollbarWidth.value}px`
          }
        : null
    )

    const targetChildStyle = computed(() =>
      scrollbarWidth.value !== 0
        ? {
            [$q.lang.rtl ? 'right' : 'left']: 0,
            [$q.lang.rtl ? 'left' : 'right']: `-${scrollbarWidth.value}px`,
            width: `calc(100% + ${scrollbarWidth.value}px)`
          }
        : null
    )

    function onPageScroll(data) {
      if (props.container || !document.qScrollPrevented) {
        const info = {
          position: data.position.top,
          direction: data.direction,
          directionChanged: data.directionChanged,
          inflectionPoint: data.inflectionPoint.top,
          delta: data.delta.top
        }

        scroll.value = info
        if (props.onScroll !== void 0) emit('scroll', info)
      }
    }

    function onPageResize(data) {
      const { height: newHeight, width: newWidth } = data
      let resized = false

      if (height.value !== newHeight) {
        resized = true
        height.value = newHeight
        if (props.onScrollHeight !== void 0) emit('scrollHeight', newHeight)
        updateScrollbarWidth()
      }
      if (width.value !== newWidth) {
        resized = true
        width.value = newWidth
      }

      if (resized && props.onResize !== void 0) {
        emit('resize', data)
      }
    }

    function onContainerResize({ height: newHeight }) {
      if (containerHeight.value !== newHeight) {
        containerHeight.value = newHeight
        updateScrollbarWidth()
      }
    }

    function updateScrollbarWidth() {
      if (props.container) {
        const newWidth =
          height.value > containerHeight.value ? getScrollbarWidth() : 0

        if (scrollbarWidth.value !== newWidth) {
          scrollbarWidth.value = newWidth
        }
      }
    }

    let animateTimer = null

    const $layout = {
      instances: {},
      view: computed(() => props.view),
      isContainer: computed(() => props.container),

      rootRef,

      height,
      containerHeight,
      scrollbarWidth,
      totalWidth: computed(() => width.value + scrollbarWidth.value),

      rows: computed(() => {
        const rows = props.view.toLowerCase().split(' ')
        return {
          top: [...rows[0]],
          middle: [...rows[1]],
          bottom: [...rows[2]]
        }
      }),

      header: reactive({ size: 0, offset: 0, space: false }),
      right: reactive({ size: 300, offset: 0, space: false }),
      footer: reactive({ size: 0, offset: 0, space: false }),
      left: reactive({ size: 300, offset: 0, space: false }),

      scroll,

      animate() {
        if (animateTimer !== null) {
          clearTimeout(animateTimer)
        } else {
          document.body.classList.add('q-body--layout-animate')
        }

        animateTimer = setTimeout(() => {
          animateTimer = null
          document.body.classList.remove('q-body--layout-animate')
        }, 155)
      },

      update(part, prop, val) {
        $layout[part][prop] = val
      }
    }

    provide(layoutKey, $layout)

    // prevent scrollbar flicker while resizing window height
    // if no page scrollbar is already present
    if (!__QUASAR_SSR_SERVER__ && getScrollbarWidth() > 0) {
      let timer = null
      const el = document.body

      const restoreScrollbar = () => {
        timer = null
        el.classList.remove('hide-scrollbar')
      }

      const hideScrollbar = () => {
        if (timer === null) {
          // if it has no scrollbar then there's nothing to do
          if (el.scrollHeight > $q.screen.height) return

          el.classList.add('hide-scrollbar')
        } else {
          clearTimeout(timer)
        }

        timer = setTimeout(restoreScrollbar, 300)
      }

      const updateScrollEvent = action => {
        if (timer !== null && action === 'remove') {
          clearTimeout(timer)
          restoreScrollbar()
        }

        window[`${action}EventListener`]('resize', hideScrollbar)
      }

      watch(() => (props.container ? 'remove' : 'add'), updateScrollEvent)

      if (!props.container) updateScrollEvent('add')

      onUnmounted(() => {
        updateScrollEvent('remove')
      })
    }

    return () => {
      const content = hMergeSlot(slots.default, [
        h(QScrollObserver, { onScroll: onPageScroll }),
        h(QResizeObserver, { onResize: onPageResize })
      ])

      const layout = h(
        'div',
        {
          class: classes.value,
          style: style.value,
          ref: props.container ? void 0 : rootRef,
          tabindex: -1
        },
        content
      )

      if (props.container) {
        return h(
          'div',
          {
            class: 'q-layout-container overflow-hidden',
            ref: rootRef
          },
          [
            h(QResizeObserver, { onResize: onContainerResize }),
            h(
              'div',
              {
                class: 'absolute-full',
                style: targetStyle.value
              },
              [
                h(
                  'div',
                  {
                    class: 'scroll',
                    style: targetChildStyle.value
                  },
                  [layout]
                )
              ]
            )
          ]
        )
      }

      return layout
    }
  }
})
