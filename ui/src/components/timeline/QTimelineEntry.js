import { h, defineComponent, computed, inject } from 'vue'

import QIcon from '../icon/QIcon.js'

import { hSlot, hUniqueSlot } from '../../utils/private/render.js'
import { timelineKey } from '../../utils/private/symbols.js'

export default defineComponent({
  name: 'QTimelineEntry',

  props: {
    heading: Boolean,
    tag: {
      type: String,
      default: 'h3'
    },
    side: {
      type: String,
      default: 'right',
      validator: v => [ 'left', 'right' ].includes(v)
    },

    icon: String,
    avatar: String,

    color: String,

    title: String,
    subtitle: String,
    body: String
  },

  setup (props, { slots }) {
    const $timeline = inject(timelineKey, () => {
      console.error('QTimelineEntry needs to be child of QTimeline')
    })

    const classes = computed(() =>
      `q-timeline__entry q-timeline__entry--${ props.side }`
      + (props.icon !== void 0 || props.avatar !== void 0 ? ' q-timeline__entry--icon' : '')
    )

    const dotClass = computed(() =>
      `q-timeline__dot text-${ props.color || $timeline.color }`
    )

    const reverse = computed(() =>
      $timeline.layout === 'comfortable' && $timeline.side === 'left'
    )

    return () => {
      const child = hUniqueSlot(slots.default, [])

      if (props.body !== void 0) {
        child.unshift(props.body)
      }

      if (props.heading === true) {
        const content = [
          h('div'),
          h('div'),
          h(
            props.tag,
            { class: 'q-timeline__heading-title' },
            child
          )
        ]

        return h('div', {
          class: 'q-timeline__heading'
        }, reverse.value === true ? content.reverse() : content)
      }

      let dot

      if (props.icon !== void 0) {
        dot = [
          h(QIcon, {
            class: 'row items-center justify-center',
            name: props.icon
          })
        ]
      }
      else if (props.avatar !== void 0) {
        dot = [
          h('img', {
            class: 'q-timeline__dot-img',
            src: props.avatar
          })
        ]
      }

      const content = [
        h('div', { class: 'q-timeline__subtitle' }, [
          h('span', {}, hSlot(slots.subtitle, [ props.subtitle ]))
        ]),

        h('div', { class: dotClass.value }, dot),

        h('div', { class: 'q-timeline__content' }, [
          h('h6', { class: 'q-timeline__title' }, hSlot(slots.title, [ props.title ]))
        ].concat(child))
      ]

      return h('li', {
        class: classes.value
      }, reverse.value === true ? content.reverse() : content)
    }
  }
})
