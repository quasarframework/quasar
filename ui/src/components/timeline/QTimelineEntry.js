import { computed, h, inject } from 'vue'

import QIcon from '../icon/QIcon.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot, hUniqueSlot } from '../../utils/private.render/render.js'
import {
  emptyRenderFn,
  timelineKey
} from '../../utils/private.symbols/symbols.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/timeline
 */
/**
 * Timeline entry content (body)
 *
 * @api slot default
 */

/**
 * Optional slot for title; When used, it overrides 'title' prop
 *
 * @api slot title
 */

/**
 * Optional slot for subtitle; When used, it overrides 'subtitle' prop
 *
 * @api slot subtitle
 */
export default createComponent({
  name: 'QTimelineEntry',

  props: {
    /**
     * Defines a heading timeline item
     *
     * @api prop heading
     * @type {Boolean}
     * @category content
     */
    heading: Boolean,
    /**
     * Tag to use, if of type 'heading' only
     *
     * @api prop tag
     * @extends tag
     * @default 'h3'
     * @example 'h1'
     */
    tag: {
      type: String,
      default: 'h3'
    },
    /**
     * Side to place the timeline entry; Works only if QTimeline layout is loose.
     *
     * @api prop side
     * @type {String}
     * @default 'right'
     * @category behavior
     */
    side: {
      type: String,
      default: 'right',
      validator: v => ['left', 'right'].includes(v)
    },

    /**
     * @api prop icon
     * @extends icon
     */
    icon: String,
    /**
     * URL to the avatar image; Icon takes precedence if used, so it replaces avatar
     *
     * @api prop avatar
     * @type {String}
     * @category content
     * @example # (public folder) src="img/my-bg.png"
     * @example # (assets folder) src="~@/assets/my-img.png"
     * @example # (relative path format) :src="require('./my_img.jpg')"
     */
    avatar: String,

    /**
     * @api prop color
     * @extends color
     */
    color: String,

    /**
     * Title of timeline entry; Is overridden if using 'title' slot
     *
     * @api prop title
     * @type {String}
     * @category content
     * @example 'December party'
     */
    title: String,
    /**
     * Subtitle of timeline entry; Is overridden if using 'subtitle' slot
     *
     * @api prop subtitle
     * @type {String}
     * @category content
     * @example 'All invited'
     */
    subtitle: String,
    /**
     * Body content of timeline entry; Use this prop or the default slot
     *
     * @api prop body
     * @type {String}
     * @category content
     * @example 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
     */
    body: String
  },

  setup(props, { slots }) {
    const $timeline = inject(timelineKey, emptyRenderFn)
    if ($timeline === emptyRenderFn) {
      console.error('QTimelineEntry needs to be child of QTimeline')
      return emptyRenderFn
    }

    const classes = computed(
      () =>
        `q-timeline__entry q-timeline__entry--${props.side}` +
        (props.icon !== void 0 || props.avatar !== void 0
          ? ' q-timeline__entry--icon'
          : '')
    )

    const dotClass = computed(
      () => `q-timeline__dot text-${props.color || $timeline.color}`
    )

    const reverse = computed(
      () => $timeline.layout === 'comfortable' && $timeline.side === 'left'
    )

    return () => {
      const child = hUniqueSlot(slots.default, [])

      if (props.body !== void 0) {
        child.unshift(props.body)
      }

      if (props.heading) {
        const content = [
          h('div'),
          h('div'),
          h(props.tag, { class: 'q-timeline__heading-title' }, child)
        ]

        return h(
          'div',
          {
            class: 'q-timeline__heading'
          },
          reverse.value ? content.reverse() : content
        )
      }

      let dot

      if (props.icon !== void 0) {
        dot = [
          h(QIcon, {
            class: 'row items-center justify-center',
            name: props.icon
          })
        ]
      } else if (props.avatar !== void 0) {
        dot = [
          h('img', {
            class: 'q-timeline__dot-img',
            src: props.avatar
          })
        ]
      }

      const content = [
        h('div', { class: 'q-timeline__subtitle' }, [
          h('span', {}, hSlot(slots.subtitle, [props.subtitle]))
        ]),

        h('div', { class: dotClass.value }, dot),

        h(
          'div',
          { class: 'q-timeline__content' },
          // oxlint-disable-next-line unicorn/prefer-spread
          [
            h(
              'h6',
              { class: 'q-timeline__title' },
              hSlot(slots.title, [props.title])
            )
          ].concat(child)
        )
      ]

      return h(
        'li',
        {
          class: classes.value
        },
        reverse.value ? content.reverse() : content
      )
    }
  }
})
