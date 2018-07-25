import QIcon from '../icon/QIcon.js'

export default {
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
        `q-timeline-entry-${this.side === 'left' ? 'left' : 'right'}`,
        this.icon ? 'q-timeline-entry-with-icon' : ''
      ]
    }
  },
  render (h) {
    if (this.heading) {
      return h('div', { staticClass: 'q-timeline-heading' }, [
        h('div'),
        h('div'),
        h(
          this.tag,
          { staticClass: 'q-timeline-heading-title' },
          this.$slots.default
        )
      ])
    }

    return h('li', {
      staticClass: `q-timeline-entry`,
      'class': this.classes
    }, [
      h('div', { staticClass: 'q-timeline-subtitle' }, [
        h('span', this.subtitle)
      ]),

      h('div', {
        staticClass: 'q-timeline-dot',
        'class': this.colorClass
      }, [
        this.icon
          ? h(QIcon, { props: { name: this.icon } })
          : null
      ]),

      h(
        'div',
        { staticClass: 'q-timeline-content' },
        [
          h('h6', { staticClass: 'q-timeline-title' }, [ this.title ])
        ].concat(this.$slots.default)
      )
    ])
  }
}
