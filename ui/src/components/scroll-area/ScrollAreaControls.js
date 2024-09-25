import { h, withDirectives } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'

/**
 * We are using a sub-component to avoid unnecessary re-renders
 * of the QScrollArea content when the scrollbars are interacted with.
 */
export default createComponent({
  props: [
    'store',
    'barStyle',
    'verticalBarStyle',
    'horizontalBarStyle'
  ],

  setup (props) {
    return () => ([
      h('div', {
        class: props.store.scroll.vertical.barClass.value,
        style: [ props.barStyle, props.verticalBarStyle ],
        'aria-hidden': 'true',
        onMousedown: props.store.onVerticalMousedown
      }),

      h('div', {
        class: props.store.scroll.horizontal.barClass.value,
        style: [ props.barStyle, props.horizontalBarStyle ],
        'aria-hidden': 'true',
        onMousedown: props.store.onHorizontalMousedown
      }),

      withDirectives(
        h('div', {
          ref: props.store.scroll.vertical.ref,
          class: props.store.scroll.vertical.thumbClass.value,
          style: props.store.scroll.vertical.style.value,
          'aria-hidden': 'true'
        }),
        props.store.thumbVertDir
      ),

      withDirectives(
        h('div', {
          ref: props.store.scroll.horizontal.ref,
          class: props.store.scroll.horizontal.thumbClass.value,
          style: props.store.scroll.horizontal.style.value,
          'aria-hidden': 'true'
        }),
        props.store.thumbHorizDir
      )
    ])
  }
})
