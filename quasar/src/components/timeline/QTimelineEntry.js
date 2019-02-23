import Vue from 'vue'

import QIcon from '../icon/QIcon.js'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QTimelineEntry',

  inject: {
    __timeline: {
      default () {
        console.error('QTimelineEntry needs to be child of QTimeline')
      }
    }
  },

  props: {
    heading: Boolean,
    tag: {
      type: String,
      default: 'h3'
    },
    side: {
      type: String,
      default: 'right',
      validator: v => ['left', 'right'].includes(v)
    },
    icon: String,
    color: String,
    title: String,
    subtitle: String
  },

  computed: {
    colorClass () {
      return `text-${this.color || this.__timeline.color}`
    },

    classes () {
      return [
        `q-timeline__entry--${this.side}`,
        this.icon ? 'q-timeline__entry--icon' : ''
      ]
    },

    reverse () {
      return this.__timeline.layout === 'comfortable' && this.__timeline.side === 'left'
    }
  },

  render (h) {
    if (this.heading) {
      const content = [
        h('div'),
        h('div'),
        h(
          this.tag,
          { staticClass: 'q-timeline__heading-title' },
          slot(this, 'default')
        )
      ]

      return h('div', {
        staticClass: 'q-timeline__heading',
        on: this.$listeners
      }, this.reverse === true ? content.reverse() : content)
    }

    const content = [
      h('div', { staticClass: 'q-timeline__subtitle' }, [
        h('span', this.subtitle)
      ]),

      h('div', {
        staticClass: 'q-timeline__dot',
        class: this.colorClass
      }, this.icon ? [
        h(QIcon, {
          staticClass: 'row items-center justify-center',
          props: { name: this.icon }
        })
      ] : null),

      h('div', { staticClass: 'q-timeline__content' }, [
        h('h6', { staticClass: 'q-timeline__title' }, [ this.title ])
      ].concat(slot(this, 'default')))
    ]

    return h('li', {
      staticClass: 'q-timeline__entry',
      class: this.classes,
      on: this.$listeners
    }, this.reverse === true ? content.reverse() : content)
  }
})
