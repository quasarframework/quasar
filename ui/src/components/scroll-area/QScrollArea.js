import {
  computed,
  getCurrentInstance,
  h,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  ref,
  watch
} from 'vue'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'

import ScrollAreaControls from './ScrollAreaControls.js'
import QResizeObserver from '../resize-observer/QResizeObserver.js'
import QScrollObserver from '../scroll-observer/QScrollObserver.js'

import TouchPan from '../../directives/touch-pan/TouchPan.js'

import { createComponent } from '../../utils/private.create/create.js'
import { between } from '../../utils/format/format.js'
import {
  setHorizontalScrollPosition,
  setVerticalScrollPosition
} from '../../utils/scroll/scroll.js'
import { hMergeSlot } from '../../utils/private.render/render.js'
import debounce from '../../utils/debounce/debounce.js'

const axisList = ['vertical', 'horizontal']
const dirProps = {
  vertical: { offset: 'offsetY', scroll: 'scrollTop', dir: 'down', dist: 'y' },
  horizontal: {
    offset: 'offsetX',
    scroll: 'scrollLeft',
    dir: 'right',
    dist: 'x'
  }
}
const panOpts = {
  prevent: true,
  mouse: true,
  mouseAllDir: true
}

const getMinThumbSize = size => (size >= 250 ? 50 : Math.ceil(size / 5))

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/scroll-area
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QScrollArea',

  props: {
    ...useDarkProps,

    /**
     * Object with CSS properties and values for custom styling the thumb of scrollbars (both vertical and horizontal)
     *
     * @api prop thumb-style
     * @type {Object}
     * @ts-type VueStyleObjectProp
     * @category style
     * @example { right: '4px', borderRadius: '5px', background: 'red', width: '10px', opacity: 1 }
     */
    thumbStyle: Object,
    /**
     * Object with CSS properties and values for custom styling the thumb of the vertical scrollbar; Is applied on top of 'thumb-style' prop
     *
     * @api prop vertical-thumb-style
     * @type {Object}
     * @ts-type VueStyleObjectProp
     * @category style
     * @example { right: '4px', borderRadius: '5px', background: 'red', width: '10px', opacity: 1 }
     */
    verticalThumbStyle: Object,
    /**
     * Object with CSS properties and values for custom styling the thumb of the horizontal scrollbar; Is applied on top of 'thumb-style' prop
     *
     * @api prop horizontal-thumb-style
     * @type {Object}
     * @ts-type VueStyleObjectProp
     * @category style
     * @example { bottom: '4px', borderRadius: '5px', background: 'red', height: '10px', opacity: 1 }
     */
    horizontalThumbStyle: Object,

    /**
     * Object with CSS properties and values for custom styling the scrollbars (both vertical and horizontal)
     *
     * @api prop bar-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category style
     * @example { borderRadius: '5px', background: 'red', opacity: 1 }
     */
    barStyle: [Array, String, Object],
    /**
     * Object with CSS properties and values for custom styling the vertical scrollbar; Is applied on top of 'bar-style' prop
     *
     * @api prop vertical-bar-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category style
     * @example { right: '4px', borderRadius: '5px', background: 'red', width: '10px', opacity: 1 }
     */
    verticalBarStyle: [Array, String, Object],
    /**
     * Object with CSS properties and values for custom styling the horizontal scrollbar; Is applied on top of 'bar-style' prop
     *
     * @api prop horizontal-bar-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category style
     * @example { bottom: '4px', borderRadius: '5px', background: 'red', height: '10px', opacity: 1 }
     */
    horizontalBarStyle: [Array, String, Object],

    /**
     * Adds [top, bottom] offset to vertical thumb
     *
     * @api prop vertical-offset
     * @type {Array}
     * @default # [0, 0]
     * @category style
     * @added-in v2.17
     */
    verticalOffset: {
      type: Array,
      default: [0, 0]
    },
    /**
     * Adds [left, right] offset to horizontal thumb
     *
     * @api prop horizontal-offset
     * @type {Array}
     * @default # [0, 0]
     * @category style
     * @added-in v2.17
     */
    horizontalOffset: {
      type: Array,
      default: [0, 0]
    },

    /**
     * Object with CSS properties and values for styling the container of QScrollArea
     *
     * @api prop content-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category style
     * @example { backgroundColor: '#C0C0C0' }
     */
    contentStyle: [Array, String, Object],
    /**
     * Object with CSS properties and values for styling the container of QScrollArea when scroll area becomes active (is mouse hovered)
     *
     * @api prop content-active-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category style
     * @example { backgroundColor: 'white' }
     */
    contentActiveStyle: [Array, String, Object],

    /**
     * When content changes, the scrollbar appears; this delay defines the amount of time (in milliseconds) before scrollbars disappear again (if component is not hovered)
     *
     * @api prop delay
     * @type {Number|String}
     * @default 1000
     * @category behavior
     */
    delay: {
      type: [String, Number],
      default: 1000
    },

    /**
     * Manually control the visibility of the scrollbar; Overrides default mouse over/leave behavior
     *
     * @api prop visible
     * @type {Boolean|null}
     * @default null
     * @category behavior
     */
    visible: {
      type: Boolean,
      default: null
    },

    /**
     * @api prop tabindex
     * @extends tabindex
     */
    tabindex: [String, Number],

    onScroll: Function
  },

  setup(props, { slots, emit }) {
    // state management
    const tempShowing = ref(false)
    const panning = ref(false)
    const hover = ref(false)

    // other...
    const container = {
      vertical: ref(0),
      horizontal: ref(0)
    }

    const scroll = {
      vertical: {
        ref: ref(null),
        position: ref(0),
        size: ref(0)
      },

      horizontal: {
        ref: ref(null),
        position: ref(0),
        size: ref(0)
      }
    }

    const { proxy } = getCurrentInstance()

    const isDark = useDark(props, proxy.$q)

    let timer = null,
      panRefPos

    const targetRef = ref(null)

    const classes = computed(
      () => 'q-scrollarea' + (isDark.value ? ' q-scrollarea--dark' : '')
    )

    Object.assign(container, {
      verticalInner: computed(
        () =>
          container.vertical.value -
          props.verticalOffset[0] -
          props.verticalOffset[1]
      ),

      horizontalInner: computed(
        () =>
          container.horizontal.value -
          props.horizontalOffset[0] -
          props.horizontalOffset[1]
      )
    })

    scroll.vertical.percentage = computed(() => {
      const diff = scroll.vertical.size.value - container.vertical.value
      if (diff <= 0) {
        return 0
      }
      const p = between(scroll.vertical.position.value / diff, 0, 1)
      return Math.round(p * 10_000) / 10_000
    })
    scroll.vertical.thumbHidden = computed(
      () =>
        (!(props.visible === null ? hover.value : props.visible) &&
          !tempShowing.value &&
          !panning.value) ||
        scroll.vertical.size.value <= container.vertical.value + 1
    )
    scroll.vertical.thumbStart = computed(
      () =>
        props.verticalOffset[0] +
        scroll.vertical.percentage.value *
          (container.verticalInner.value - scroll.vertical.thumbSize.value)
    )
    scroll.vertical.thumbSize = computed(() =>
      Math.round(
        between(
          (container.verticalInner.value * container.verticalInner.value) /
            scroll.vertical.size.value,
          getMinThumbSize(container.verticalInner.value),
          container.verticalInner.value
        )
      )
    )
    scroll.vertical.style = computed(() => ({
      ...props.thumbStyle,
      ...props.verticalThumbStyle,
      top: `${scroll.vertical.thumbStart.value}px`,
      height: `${scroll.vertical.thumbSize.value}px`,
      right: `${props.horizontalOffset[1]}px`
    }))
    scroll.vertical.thumbClass = computed(
      () =>
        'q-scrollarea__thumb q-scrollarea__thumb--v absolute-right' +
        (scroll.vertical.thumbHidden.value
          ? ' q-scrollarea__thumb--invisible'
          : '')
    )
    scroll.vertical.barClass = computed(
      () =>
        'q-scrollarea__bar q-scrollarea__bar--v absolute-right' +
        (scroll.vertical.thumbHidden.value
          ? ' q-scrollarea__bar--invisible'
          : '')
    )

    scroll.horizontal.percentage = computed(() => {
      const diff = scroll.horizontal.size.value - container.horizontal.value
      if (diff <= 0) {
        return 0
      }
      const p = between(Math.abs(scroll.horizontal.position.value) / diff, 0, 1)
      return Math.round(p * 10_000) / 10_000
    })
    scroll.horizontal.thumbHidden = computed(
      () =>
        (!(props.visible === null ? hover.value : props.visible) &&
          !tempShowing.value &&
          !panning.value) ||
        scroll.horizontal.size.value <= container.horizontal.value + 1
    )
    scroll.horizontal.thumbStart = computed(
      () =>
        props.horizontalOffset[0] +
        scroll.horizontal.percentage.value *
          (container.horizontalInner.value - scroll.horizontal.thumbSize.value)
    )
    scroll.horizontal.thumbSize = computed(() =>
      Math.round(
        between(
          (container.horizontalInner.value * container.horizontalInner.value) /
            scroll.horizontal.size.value,
          getMinThumbSize(container.horizontalInner.value),
          container.horizontalInner.value
        )
      )
    )
    scroll.horizontal.style = computed(() => ({
      ...props.thumbStyle,
      ...props.horizontalThumbStyle,
      [proxy.$q.lang.rtl ? 'right' : 'left']:
        `${scroll.horizontal.thumbStart.value}px`,
      width: `${scroll.horizontal.thumbSize.value}px`,
      bottom: `${props.verticalOffset[1]}px`
    }))
    scroll.horizontal.thumbClass = computed(
      () =>
        'q-scrollarea__thumb q-scrollarea__thumb--h absolute-bottom' +
        (scroll.horizontal.thumbHidden.value
          ? ' q-scrollarea__thumb--invisible'
          : '')
    )
    scroll.horizontal.barClass = computed(
      () =>
        'q-scrollarea__bar q-scrollarea__bar--h absolute-bottom' +
        (scroll.horizontal.thumbHidden.value
          ? ' q-scrollarea__bar--invisible'
          : '')
    )

    const mainStyle = computed(() =>
      scroll.vertical.thumbHidden.value && scroll.horizontal.thumbHidden.value
        ? props.contentStyle
        : props.contentActiveStyle
    )

    function getScroll() {
      const info = {}

      axisList.forEach(axis => {
        const data = scroll[axis]
        Object.assign(info, {
          [axis + 'Position']: data.position.value,
          [axis + 'Percentage']: data.percentage.value,
          [axis + 'Size']: data.size.value,
          [axis + 'ContainerSize']: container[axis].value,
          [axis + 'ContainerInnerSize']: container[axis + 'Inner'].value
        })
      })

      return info
    }

    // we have lots of listeners, so
    // ensure we're not emitting same info
    // multiple times
    const emitScroll = debounce(() => {
      const info = getScroll()
      info.ref = proxy
      emit('scroll', info)
    }, 0)

    function localSetScrollPosition(axis, offset, duration) {
      if (!axisList.includes(axis)) {
        console.error(
          '[QScrollArea]: wrong first param of setScrollPosition (vertical/horizontal)'
        )
        return
      }

      const fn =
        axis === 'vertical'
          ? setVerticalScrollPosition
          : setHorizontalScrollPosition

      fn(targetRef.value, offset, duration)
    }

    function updateContainer({ height, width }) {
      let change = false

      if (container.vertical.value !== height) {
        container.vertical.value = height
        change = true
      }

      if (container.horizontal.value !== width) {
        container.horizontal.value = width
        change = true
      }

      if (change) startTimer()
    }

    function updateScroll({ position }) {
      let change = false

      if (scroll.vertical.position.value !== position.top) {
        scroll.vertical.position.value = position.top
        change = true
      }

      if (scroll.horizontal.position.value !== position.left) {
        scroll.horizontal.position.value = position.left
        change = true
      }

      if (change) startTimer()
    }

    function updateScrollSize({ height, width }) {
      if (scroll.horizontal.size.value !== width) {
        scroll.horizontal.size.value = width
        startTimer()
      }

      if (scroll.vertical.size.value !== height) {
        scroll.vertical.size.value = height
        startTimer()
      }
    }

    function onPanThumb(e, axis) {
      const data = scroll[axis]

      if (e.isFirst) {
        if (data.thumbHidden.value) return

        panRefPos = data.position.value
        panning.value = true
      } else if (!panning.value) {
        return
      }

      if (e.isFinal) panning.value = false

      const dProp = dirProps[axis]

      const multiplier =
        (data.size.value - container[axis].value) /
        (container[axis + 'Inner'].value - data.thumbSize.value)
      const distance = e.distance[dProp.dist]
      const pos =
        panRefPos + (e.direction === dProp.dir ? 1 : -1) * distance * multiplier

      setScroll(pos, axis)
    }

    function onMousedown(evt, axis) {
      const data = scroll[axis]

      if (!data.thumbHidden.value) {
        const startOffset =
          axis === 'vertical'
            ? props.verticalOffset[0]
            : props.horizontalOffset[0]

        const offset = evt[dirProps[axis].offset] - startOffset
        const thumbStart = data.thumbStart.value - startOffset

        if (offset < thumbStart || offset > thumbStart + data.thumbSize.value) {
          const targetThumbStart = offset - data.thumbSize.value / 2
          const percentage = between(
            targetThumbStart /
              (container[axis + 'Inner'].value - data.thumbSize.value),
            0,
            1
          )
          setScroll(
            percentage * Math.max(0, data.size.value - container[axis].value),
            axis
          )
        }

        // activate thumb pan
        if (data.ref.value !== null) {
          data.ref.value.dispatchEvent(new MouseEvent(evt.type, evt))
        }
      }
    }

    function startTimer() {
      tempShowing.value = true

      if (timer !== null) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        tempShowing.value = false
      }, props.delay)

      if (props.onScroll !== void 0) emitScroll()
    }

    function setScroll(offset, axis) {
      targetRef.value[dirProps[axis].scroll] = offset
    }

    let mouseEventTimer = null

    function onMouseenter() {
      if (mouseEventTimer !== null) {
        clearTimeout(mouseEventTimer)
      }

      // setTimeout needed for iOS; see ticket #16210
      mouseEventTimer = setTimeout(
        () => {
          mouseEventTimer = null
          hover.value = true
        },
        proxy.$q.platform.is.ios ? 50 : 0
      )
    }

    function onMouseleave() {
      if (mouseEventTimer !== null) {
        clearTimeout(mouseEventTimer)
        mouseEventTimer = null
      }

      hover.value = false
    }

    let scrollPosition = null

    watch(
      () => proxy.$q.lang.rtl,
      rtl => {
        if (targetRef.value !== null) {
          setHorizontalScrollPosition(
            targetRef.value,
            Math.abs(scroll.horizontal.position.value) * (rtl ? -1 : 1)
          )
        }
      }
    )

    onDeactivated(() => {
      scrollPosition = {
        top: scroll.vertical.position.value,
        left: scroll.horizontal.position.value
      }
    })

    onActivated(() => {
      if (scrollPosition === null) return

      const scrollTarget = targetRef.value

      if (scrollTarget !== null) {
        setHorizontalScrollPosition(scrollTarget, scrollPosition.left)
        setVerticalScrollPosition(scrollTarget, scrollPosition.top)
      }
    })

    onBeforeUnmount(emitScroll.cancel)

    // expose public methods
    Object.assign(proxy, {
      /**
       * Get the scrolling DOM element target
       *
       * @api method getScrollTarget
       * @returns {Element} DOM element upon which scrolling takes place
       */
      getScrollTarget: () => targetRef.value,
      getScroll,
      /**
       * Get current scroll position
       *
       * @api method getScrollPosition
       * @returns {Object} An object containing scroll position information
       */
      getScrollPosition: () => ({
        top: scroll.vertical.position.value,
        left: scroll.horizontal.position.value
      }),
      /**
       * Get current scroll position in percentage (0.0 <= x <= 1.0)
       *
       * @api method getScrollPercentage
       * @returns {Object} An object containing scroll position information in percentage
       */
      getScrollPercentage: () => ({
        top: scroll.vertical.percentage.value,
        left: scroll.horizontal.percentage.value
      }),
      /**
       * Set scroll position to an offset; If a duration (in milliseconds) is specified then the scroll is animated
       *
       * @api method setScrollPosition
       * @param {String} axis Scroll axis
       * @param {Number} offset Scroll position offset from top (in pixels)
       * @param {Number} duration Duration (in milliseconds) enabling animated scroll
       */
      setScrollPosition: localSetScrollPosition,
      /**
       * Set scroll position to a percentage (0.0 <= x <= 1.0) of the total scrolling size; If a duration (in milliseconds) is specified then the scroll is animated
       *
       * @api method setScrollPercentage
       * @param {String} axis Scroll axis
       * @param {Number} offset Scroll percentage (0.0 <= x <= 1.0) of the total scrolling size
       * @param {Number} duration Duration (in milliseconds) enabling animated scroll
       */
      setScrollPercentage(axis, percentage, duration) {
        localSetScrollPosition(
          axis,
          percentage *
            (scroll[axis].size.value - container[axis].value) *
            (axis === 'horizontal' && proxy.$q.lang.rtl ? -1 : 1),
          duration
        )
      }
    })

    const store = {
      scroll,

      thumbVertDir: [
        [
          TouchPan,
          e => {
            onPanThumb(e, 'vertical')
          },
          void 0,
          { vertical: true, ...panOpts }
        ]
      ],

      thumbHorizDir: [
        [
          TouchPan,
          e => {
            onPanThumb(e, 'horizontal')
          },
          void 0,
          { horizontal: true, ...panOpts }
        ]
      ],

      onVerticalMousedown(evt) {
        onMousedown(evt, 'vertical')
      },

      onHorizontalMousedown(evt) {
        onMousedown(evt, 'horizontal')
      }
    }

    return () =>
      h(
        'div',
        {
          class: classes.value,
          onMouseenter,
          onMouseleave
        },
        [
          h(
            'div',
            {
              ref: targetRef,
              class:
                'q-scrollarea__container scroll relative-position fit hide-scrollbar',
              tabindex: props.tabindex !== void 0 ? props.tabindex : void 0
            },
            [
              h(
                'div',
                {
                  class: 'q-scrollarea__content absolute',
                  style: mainStyle.value
                },
                hMergeSlot(slots.default, [
                  h(QResizeObserver, {
                    debounce: 0,
                    onResize: updateScrollSize
                  })
                ])
              ),

              h(QScrollObserver, {
                axis: 'both',
                onScroll: updateScroll
              })
            ]
          ),

          h(QResizeObserver, {
            debounce: 0,
            onResize: updateContainer
          }),

          h(ScrollAreaControls, {
            store,
            barStyle: props.barStyle,
            verticalBarStyle: props.verticalBarStyle,
            horizontalBarStyle: props.horizontalBarStyle
          })
        ]
      )
  }
})
