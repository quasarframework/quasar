import { h, defineComponent, ref, computed, withDirectives, getCurrentInstance } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

import QResizeObserver from '../resize-observer/QResizeObserver.js'
import QScrollObserver from '../scroll-observer/QScrollObserver.js'

import TouchPan from '../../directives/TouchPan.js'

import { between } from '../../utils/format.js'
import { setVerticalScrollPosition, setHorizontalScrollPosition } from '../../utils/scroll.js'
import { hMergeSlot } from '../../utils/render.js'
import debounce from '../../utils/debounce.js'
import { vmHasListener } from '../../utils/vm.js'

const axisValues = [ 'both', 'horizontal', 'vertical' ]

export default defineComponent({
  name: 'QScrollArea',

  props: {
    ...useDarkProps,

    axis: {
      type: String,
      validator: v => axisValues.includes(v),
      default: 'vertical'
    },

    barStyle: [ Array, String, Object ],
    thumbStyle: Object,
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

    horizontal: Boolean
  },

  emits: [ 'scroll' ],

  setup (props, { slots, emit }) {
    // state management
    const tempShowing = ref(false)
    const panning = ref(false)
    const hover = ref(false)

    // other...
    const container = {
      width: ref(0),
      height: ref(0)
    }

    const scrollPosition = ref(0)
    const scrollSize = ref(0)

    const vm = getCurrentInstance()

    const $q = useQuasar()
    const isDark = useDark(props, $q)

    let timer, panRefPos

    const thumbRef = ref(null)
    const targetRef = ref(null)

    const classes = computed(() =>
      'q-scrollarea'
      + (isDark.value === true ? ' q-scrollarea--dark' : '')
    )

    const containerSize = computed(() => container[ dirProps.value.suffix ].value)

    const thumbHidden = computed(() =>
      (
        (props.visible === null ? hover.value : props.visible) !== true
        && tempShowing.value === false
        && panning.value === false
      ) || scrollSize.value <= containerSize.value
    )

    const thumbSize = computed(() =>
      Math.round(
        between(
          containerSize.value * containerSize.value / scrollSize.value,
          50,
          containerSize.value
        )
      )
    )

    const style = computed(() => {
      const pos = scrollPercentage.value * (containerSize.value - thumbSize.value)
      return {
        ...props.thumbStyle,
        ...(props.horizontal === true
          ? {
              left: `${ pos }px`,
              width: `${ thumbSize.value }px`
            }
          : {
              top: `${ pos }px`,
              height: `${ thumbSize.value }px`
            })
      }
    })

    const mainStyle = computed(() => (
      thumbHidden.value === true
        ? props.contentStyle
        : props.contentActiveStyle
    ))

    const scrollPercentage = computed(() => {
      const p = between(scrollPosition.value / (scrollSize.value - containerSize.value), 0, 1)
      return Math.round(p * 10000) / 10000
    })

    const dirProps = computed(() => (
      props.horizontal === true
        ? { prefix: 'horizontal', suffix: 'width', scroll: 'scrollLeft', classSuffix: 'h absolute-bottom', dir: 'right', dist: 'x' }
        : { prefix: 'vertical', suffix: 'height', scroll: 'scrollTop', classSuffix: 'v absolute-right', dir: 'down', dist: 'y' }
    ))

    const thumbClass = computed(() =>
      `q-scrollarea__thumb q-scrollarea__thumb--${ dirProps.value.classSuffix }`
      + (thumbHidden.value === true ? ' q-scrollarea__thumb--invisible' : '')
    )

    const barClass = computed(() =>
      `q-scrollarea__bar q-scrollarea__bar--${ dirProps.value.classSuffix }`
      + (thumbHidden.value === true ? ' q-scrollarea__bar--invisible' : '')
    )

    const thumbDirectives = computed(() => {
      return [ [
        TouchPan,
        onPanThumb,
        void 0,
        {
          [ props.horizontal === true ? 'horizontal' : 'vertical' ]: true,
          prevent: true,
          mouse: true,
          mouseAllDir: true
        }
      ] ]
    })

    // we have lots of listeners, so
    // ensure we're not emitting same info
    // multiple times
    const emitScroll = debounce(() => {
      const info = { ref: vm.proxy }
      const { prefix } = dirProps.value

      info[ prefix + 'Position' ] = scrollPosition.value
      info[ prefix + 'Percentage' ] = scrollPercentage.value
      info[ prefix + 'Size' ] = scrollSize.value
      info[ prefix + 'ContainerSize' ] = containerSize.value

      emit('scroll', info)
    }, 0)

    function localSetScrollPosition (offset, duration) {
      const fn = props.horizontal === true
        ? setHorizontalScrollPosition
        : setVerticalScrollPosition

      fn(targetRef.value, offset, duration)
    }

    function updateContainer ({ height, width }) {
      let change = false

      if (container.width.value !== width) {
        container.width.value = width
        change = true
      }

      if (container.height.value !== height) {
        container.height.value = height
        change = true
      }

      change === true && startTimer()
    }

    function updateScroll (info) {
      if (scrollPosition.value !== info.position.top) {
        scrollPosition.value = info.position.top
        startTimer()
      }
    }

    function updateScrollSize ({ height, width }) {
      if (props.horizontal === true) {
        if (scrollSize.value !== width) {
          scrollSize.value = width
          startTimer()
        }
      }
      else if (scrollSize.value !== height) {
        scrollSize.value = height
        startTimer()
      }
    }

    function onPanThumb (e) {
      if (e.isFirst === true) {
        if (thumbHidden.value === true) {
          return
        }

        panRefPos = scrollPosition.value
        panning.value = true
      }
      else if (panning.value !== true) {
        return
      }

      if (e.isFinal === true) {
        panning.value = false
      }

      const multiplier = (scrollSize.value - containerSize.value) / (containerSize.value - thumbSize.value)
      const distance = e.distance[ dirProps.value.dist ]
      const pos = panRefPos + (e.direction === dirProps.value.dir ? 1 : -1) * distance * multiplier

      setScroll(pos)
    }

    function onMousedown (evt) {
      if (thumbHidden.value !== true) {
        const pos = evt[ `offset${ props.horizontal === true ? 'X' : 'Y' }` ] - thumbSize.value / 2
        setScroll(pos / containerSize.value * scrollSize.value)

        // activate thumb pan
        if (thumbRef.value !== null) {
          thumbRef.value.dispatchEvent(new MouseEvent(evt.type, evt))
        }
      }
    }

    function startTimer () {
      if (tempShowing.value === true) {
        clearTimeout(timer)
      }
      else {
        tempShowing.value = true
      }

      timer = setTimeout(() => { tempShowing.value = false }, props.delay)
      vmHasListener(vm, 'onScroll') === true && emitScroll()
    }

    function setScroll (offset) {
      targetRef.value[ dirProps.value.scroll ] = offset
    }

    function onMouseenter () {
      hover.value = true
    }

    function onMouseleave () {
      hover.value = false
    }

    // expose public methods
    Object.assign(vm.proxy, {
      getScrollTarget: () => targetRef.value,
      getScrollPosition: () => scrollPosition.value,
      setScrollPosition: localSetScrollPosition,
      setScrollPercentage (percentage, duration) {
        localSetScrollPosition(
          percentage * (scrollSize.value - containerSize.value),
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
          class: 'scroll relative-position fit hide-scrollbar'
        }, [
          h('div', {
            class: 'absolute full-width full-height',
            style: mainStyle.value
          }, hMergeSlot(slots.default, [
            h(QResizeObserver, {
              onResize: updateScrollSize
            })
          ])),

          h(QScrollObserver, {
            axis: 'both',
            onScroll: updateScroll
          })
        ]),

        h(QResizeObserver, {
          onResize: updateContainer
        }),

        h('div', {
          class: barClass.value,
          style: props.barStyle,
          'aria-hidden': 'true',
          onMousedown
        }),

        withDirectives(
          h('div', {
            ref: thumbRef,
            class: thumbClass.value,
            style: style.value,
            'aria-hidden': 'true'
          }),
          thumbDirectives.value
        )
      ])
    }
  }
})
