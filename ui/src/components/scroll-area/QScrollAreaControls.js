import { h, ref, withDirectives } from 'vue'

import { dirProps } from './use-scroll-area.js'

import TouchPan from '../../directives/touch-pan/TouchPan.js'

import { createComponent } from '../../utils/private/create.js'
import { between } from '../../utils/format.js'

const panOpts = {
  prevent: true,
  mouse: true,
  mouseAllDir: true
}

export default createComponent({
  name: 'QScrollAreaControls',

  emits: [ 'set-scroll' ],

  props: {
    thumbStyle: Object,
    verticalThumbStyle: Object,
    horizontalThumbStyle: Object,

    barStyle: [ Array, String, Object ],
    verticalBarStyle: [ Array, String, Object ],
    horizontalBarStyle: [ Array, String, Object ],

    verticalOffset: {
      type: Array,
      default: [ 0, 0 ]
    },
    horizontalOffset: {
      type: Array,
      default: [ 0, 0 ]
    },

    visible: {
      type: Boolean,
      default: null
    },

    container: Object,
    scroll: Object
  },

  setup (props, { emit }) {
    // state management
    const panning = ref(false)

    let panRefPos

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

    function onPanThumb (e, axis) {
      const data = props.scroll[ axis ]

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

      const multiplier = (data.size.value - props.container[ axis ].value) / (props.container[ axis + 'Net' ].value - data.thumbSize.value)
      const distance = e.distance[ dProp.dist ]
      const pos = panRefPos + (e.direction === dProp.dir ? 1 : -1) * distance * multiplier

      setScroll(pos, axis)
    }

    function onMousedown (evt, axis) {
      const data = props.scroll[ axis ]

      if (data.thumbHidden.value !== true) {
        const startOffset = axis === 'vertical'
          ? props.verticalOffset[ 0 ]
          : props.horizontalOffset[ 0 ]

        const offset = evt[ dirProps[ axis ].offset ] - startOffset
        const thumbStart = data.thumbStart.value - startOffset

        if (offset < thumbStart || offset > thumbStart + data.thumbSize.value) {
          const targetThumbStart = offset - data.thumbSize.value / 2
          const percentage = between(targetThumbStart / (props.container[ axis + 'Net' ].value - data.thumbSize.value), 0, 1)
          setScroll(percentage * Math.max(0, data.size.value - props.container[ axis ].value), axis)
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

    function setScroll (offset, axis) {
      emit('set-scroll', offset, axis)
    }

    return () => [
      h('div', {
        class: props.scroll.vertical.barClass.value,
        style: [ props.barStyle, props.verticalBarStyle ],
        'aria-hidden': 'true',
        onMousedown: onVerticalMousedown
      }),

      h('div', {
        class: props.scroll.horizontal.barClass.value,
        style: [ props.barStyle, props.horizontalBarStyle ],
        'aria-hidden': 'true',
        onMousedown: onHorizontalMousedown
      }),

      withDirectives(
        h('div', {
          ref: props.scroll.vertical.ref,
          class: props.scroll.vertical.thumbClass.value,
          style: props.scroll.vertical.style.value,
          'aria-hidden': 'true'
        }),
        thumbVertDir
      ),

      withDirectives(
        h('div', {
          ref: props.scroll.horizontal.ref,
          class: props.scroll.horizontal.thumbClass.value,
          style: props.scroll.horizontal.style.value,
          'aria-hidden': 'true'
        }),
        thumbHorizDir
      )
    ]
  }
})
