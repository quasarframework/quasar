import { h, ref, computed, watch, withDirectives, onActivated, onDeactivated, onBeforeUnmount, getCurrentInstance } from 'vue'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

import QResizeObserver from '../resize-observer/QResizeObserver.js'
import QScrollObserver from '../scroll-observer/QScrollObserver.js'

import TouchPan from '../../directives/TouchPan.js'

import { createComponent } from '../../utils/private/create.js'
import { between } from '../../utils/format.js'
import { setVerticalScrollPosition, setHorizontalScrollPosition } from '../../utils/scroll.js'
import { hMergeSlot } from '../../utils/private/render.js'
import debounce from '../../utils/debounce.js'

const axisList = [ 'vertical', 'horizontal' ]
const dirProps = {
  vertical: { offset: 'offsetY', scroll: 'scrollTop', dir: 'down', dist: 'y' },
  horizontal: { offset: 'offsetX', scroll: 'scrollLeft', dir: 'right', dist: 'x' }
}
const panOpts = {
  prevent: true,
  mouse: true,
  mouseAllDir: true
}

const getMinThumbSize = size => (size >= 250 ? 50 : Math.ceil(size / 5))

export default createComponent({
  name: 'QScrollArea',

  props: {
    ...useDarkProps,

    thumbStyle: Object,
    verticalThumbStyle: Object,
    horizontalThumbStyle: Object,

    barStyle: [ Array, String, Object ],
    verticalBarStyle: [ Array, String, Object ],
    horizontalBarStyle: [ Array, String, Object ],

    contentStyle: [ Array, String, Object ],
    contentActiveStyle: [ Array, String, Object ],

    delay: {
      type: [ String, Number ],
      default: 1000
    },

    visible: {
      type: Boolean,
      default: null
    },

    tabindex: [ String, Number ],

    onScroll: Function
  },

  setup (props, { slots, emit }) {
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

    let timer = null, panRefPos

    const targetRef = ref(null)

    const classes = computed(() =>
      'q-scrollarea'
      + (isDark.value === true ? ' q-scrollarea--dark' : '')
    )

    scroll.vertical.percentage = computed(() => {
      const diff = scroll.vertical.size.value - container.vertical.value
      if (diff <= 0) { return 0 }
      const p = between(scroll.vertical.position.value / diff, 0, 1)
      return Math.round(p * 10000) / 10000
    })
    scroll.vertical.thumbHidden = computed(() =>
      (
        (props.visible === null ? hover.value : props.visible) !== true
        && tempShowing.value === false
        && panning.value === false
      ) || scroll.vertical.size.value <= container.vertical.value + 1
    )
    scroll.vertical.thumbStart = computed(() =>
      scroll.vertical.percentage.value * (container.vertical.value - scroll.vertical.thumbSize.value)
    )
    scroll.vertical.thumbSize = computed(() =>
      Math.round(
        between(
          container.vertical.value * container.vertical.value / scroll.vertical.size.value,
          getMinThumbSize(container.vertical.value),
          container.vertical.value
        )
      )
    )
    scroll.vertical.style = computed(() => {
      return {
        ...props.thumbStyle,
        ...props.verticalThumbStyle,
        top: `${ scroll.vertical.thumbStart.value }px`,
        height: `${ scroll.vertical.thumbSize.value }px`
      }
    })
    scroll.vertical.thumbClass = computed(() =>
      'q-scrollarea__thumb q-scrollarea__thumb--v absolute-right'
      + (scroll.vertical.thumbHidden.value === true ? ' q-scrollarea__thumb--invisible' : '')
    )
    scroll.vertical.barClass = computed(() =>
      'q-scrollarea__bar q-scrollarea__bar--v absolute-right'
      + (scroll.vertical.thumbHidden.value === true ? ' q-scrollarea__bar--invisible' : '')
    )

    scroll.horizontal.percentage = computed(() => {
      const diff = scroll.horizontal.size.value - container.horizontal.value
      if (diff <= 0) { return 0 }
      const p = between(Math.abs(scroll.horizontal.position.value) / diff, 0, 1)
      return Math.round(p * 10000) / 10000
    })
    scroll.horizontal.thumbHidden = computed(() =>
      (
        (props.visible === null ? hover.value : props.visible) !== true
        && tempShowing.value === false
        && panning.value === false
      ) || scroll.horizontal.size.value <= container.horizontal.value + 1
    )
    scroll.horizontal.thumbStart = computed(() =>
      scroll.horizontal.percentage.value * (container.horizontal.value - scroll.horizontal.thumbSize.value)
    )
    scroll.horizontal.thumbSize = computed(() =>
      Math.round(
        between(
          container.horizontal.value * container.horizontal.value / scroll.horizontal.size.value,
          getMinThumbSize(container.horizontal.value),
          container.horizontal.value
        )
      )
    )
    scroll.horizontal.style = computed(() => {
      return {
        ...props.thumbStyle,
        ...props.horizontalThumbStyle,
        [ proxy.$q.lang.rtl === true ? 'right' : 'left' ]: `${ scroll.horizontal.thumbStart.value }px`,
        width: `${ scroll.horizontal.thumbSize.value }px`
      }
    })
    scroll.horizontal.thumbClass = computed(() =>
      'q-scrollarea__thumb q-scrollarea__thumb--h absolute-bottom'
      + (scroll.horizontal.thumbHidden.value === true ? ' q-scrollarea__thumb--invisible' : '')
    )
    scroll.horizontal.barClass = computed(() =>
      'q-scrollarea__bar q-scrollarea__bar--h absolute-bottom'
      + (scroll.horizontal.thumbHidden.value === true ? ' q-scrollarea__bar--invisible' : '')
    )

    const mainStyle = computed(() => (
      scroll.vertical.thumbHidden.value === true && scroll.horizontal.thumbHidden.value === true
        ? props.contentStyle
        : props.contentActiveStyle
    ))

    const thumbVertDir = [ [
      TouchPan,
      e => { onPanThumb(e, 'vertical') },
      void 0,
      { vertical: true, ...panOpts }
    ] ]

    const thumbHorizDir = [ [
      TouchPan,
      e => { onPanThumb(e, 'horizontal') },
      void 0,
      { horizontal: true, ...panOpts }
    ] ]

    function getScroll () {
      const info = {}

      axisList.forEach(axis => {
        const data = scroll[ axis ]

        info[ axis + 'Position' ] = data.position.value
        info[ axis + 'Percentage' ] = data.percentage.value
        info[ axis + 'Size' ] = data.size.value
        info[ axis + 'ContainerSize' ] = container[ axis ].value
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

    function localSetScrollPosition (axis, offset, duration) {
      if (axisList.includes(axis) === false) {
        console.error('[QScrollArea]: wrong first param of setScrollPosition (vertical/horizontal)')
        return
      }

      const fn = axis === 'vertical'
        ? setVerticalScrollPosition
        : setHorizontalScrollPosition

      fn(targetRef.value, offset, duration)
    }

    function updateContainer ({ height, width }) {
      let change = false

      if (container.vertical.value !== height) {
        container.vertical.value = height
        change = true
      }

      if (container.horizontal.value !== width) {
        container.horizontal.value = width
        change = true
      }

      change === true && startTimer()
    }

    function updateScroll ({ position }) {
      let change = false

      if (scroll.vertical.position.value !== position.top) {
        scroll.vertical.position.value = position.top
        change = true
      }

      if (scroll.horizontal.position.value !== position.left) {
        scroll.horizontal.position.value = position.left
        change = true
      }

      change === true && startTimer()
    }

    function updateScrollSize ({ height, width }) {
      if (scroll.horizontal.size.value !== width) {
        scroll.horizontal.size.value = width
        startTimer()
      }

      if (scroll.vertical.size.value !== height) {
        scroll.vertical.size.value = height
        startTimer()
      }
    }

    function onPanThumb (e, axis) {
      const data = scroll[ axis ]

      if (e.isFirst === true) {
        if (data.thumbHidden.value === true) {
          return
        }

        panRefPos = data.position.value
        panning.value = true
      }
      else if (panning.value !== true) {
        return
      }

      if (e.isFinal === true) {
        panning.value = false
      }

      const dProp = dirProps[ axis ]
      const containerSize = container[ axis ].value

      const multiplier = (data.size.value - containerSize) / (containerSize - data.thumbSize.value)
      const distance = e.distance[ dProp.dist ]
      const pos = panRefPos + (e.direction === dProp.dir ? 1 : -1) * distance * multiplier

      setScroll(pos, axis)
    }

    function onMousedown (evt, axis) {
      const data = scroll[ axis ]

      if (data.thumbHidden.value !== true) {
        const offset = evt[ dirProps[ axis ].offset ]
        if (offset < data.thumbStart.value || offset > data.thumbStart.value + data.thumbSize.value) {
          const pos = offset - data.thumbSize.value / 2
          setScroll(pos / container[ axis ].value * data.size.value, axis)
        }

        // activate thumb pan
        if (data.ref.value !== null) {
          data.ref.value.dispatchEvent(new MouseEvent(evt.type, evt))
        }
      }
    }

    function onVerticalMousedown (evt) {
      onMousedown(evt, 'vertical')
    }

    function onHorizontalMousedown (evt) {
      onMousedown(evt, 'horizontal')
    }

    function startTimer () {
      tempShowing.value = true

      timer !== null && clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        tempShowing.value = false
      }, props.delay)

      props.onScroll !== void 0 && emitScroll()
    }

    function setScroll (offset, axis) {
      targetRef.value[ dirProps[ axis ].scroll ] = offset
    }

    function onMouseenter () {
      hover.value = true
    }

    function onMouseleave () {
      hover.value = false
    }

    let scrollPosition = null

    watch(() => proxy.$q.lang.rtl, rtl => {
      if (targetRef.value !== null) {
        setHorizontalScrollPosition(
          targetRef.value,
          Math.abs(scroll.horizontal.position.value) * (rtl === true ? -1 : 1)
        )
      }
    })

    onDeactivated(() => {
      scrollPosition = {
        top: scroll.vertical.position.value,
        left: scroll.horizontal.position.value
      }
    })

    onActivated(() => {
      if (scrollPosition === null) { return }

      const scrollTarget = targetRef.value

      if (scrollTarget !== null) {
        setHorizontalScrollPosition(scrollTarget, scrollPosition.left)
        setVerticalScrollPosition(scrollTarget, scrollPosition.top)
      }
    })

    onBeforeUnmount(emitScroll.cancel)

    // expose public methods
    Object.assign(proxy, {
      getScrollTarget: () => targetRef.value,
      getScroll,
      getScrollPosition: () => ({
        top: scroll.vertical.position.value,
        left: scroll.horizontal.position.value
      }),
      getScrollPercentage: () => ({
        top: scroll.vertical.percentage.value,
        left: scroll.horizontal.percentage.value
      }),
      setScrollPosition: localSetScrollPosition,
      setScrollPercentage (axis, percentage, duration) {
        localSetScrollPosition(
          axis,
          percentage
            * (scroll[ axis ].size.value - container[ axis ].value)
            * (axis === 'horizontal' && proxy.$q.lang.rtl === true ? -1 : 1),
          duration
        )
      }
    })

    return () => {
      return h('div', {
        class: classes.value,
        onMouseenter,
        onMouseleave
      }, [
        h('div', {
          ref: targetRef,
          class: 'q-scrollarea__container scroll relative-position fit hide-scrollbar',
          tabindex: props.tabindex !== void 0 ? props.tabindex : void 0
        }, [
          h('div', {
            class: 'q-scrollarea__content absolute',
            style: mainStyle.value
          }, hMergeSlot(slots.default, [
            h(QResizeObserver, {
              debounce: 0,
              onResize: updateScrollSize
            })
          ])),

          h(QScrollObserver, {
            axis: 'both',
            onScroll: updateScroll
          })
        ]),

        h(QResizeObserver, {
          debounce: 0,
          onResize: updateContainer
        }),

        h('div', {
          class: scroll.vertical.barClass.value,
          style: [ props.barStyle, props.verticalBarStyle ],
          'aria-hidden': 'true',
          onMousedown: onVerticalMousedown
        }),

        h('div', {
          class: scroll.horizontal.barClass.value,
          style: [ props.barStyle, props.horizontalBarStyle ],
          'aria-hidden': 'true',
          onMousedown: onHorizontalMousedown
        }),

        withDirectives(
          h('div', {
            ref: scroll.vertical.ref,
            class: scroll.vertical.thumbClass.value,
            style: scroll.vertical.style.value,
            'aria-hidden': 'true'
          }),
          thumbVertDir
        ),

        withDirectives(
          h('div', {
            ref: scroll.horizontal.ref,
            class: scroll.horizontal.thumbClass.value,
            style: scroll.horizontal.style.value,
            'aria-hidden': 'true'
          }),
          thumbHorizDir
        )
      ])
    }
  }
})
