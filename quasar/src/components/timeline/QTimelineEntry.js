import Vue from 'vue'

import QIcon from '../icon/QIcon.js'

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
        `q-timeline__entry--${this.side === 'left' ? 'left' : 'right'}`,
        this.icon ? 'q-timeline__entry--icon' : ''
      ]
    }
  },

  render (h) {
    if (this.heading) {
      return h('div', { staticClass: 'q-timeline__heading' }, [
        h('div'),
        h('div'),
        h(
          this.tag,
          { staticClass: 'q-timeline__heading-title' },
          this.$slots.default
        )
      ])
    }

    return h('li', {
      staticClass: `q-timeline__entry`,
      class: this.classes
    }, [
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
      ].concat(this.$slots.default))
    ])
  }
})
