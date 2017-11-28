import { QIcon } from '../icon'

export default {
  name: 'q-timeline-entry',
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
    }
  },
  render (h) {
    if (this.heading) {
      return h('div', { staticClass: 'q-timeline-heading' }, [
        h('div'),
        h('div'),
        h(this.tag, { staticClass: 'q-timeline-heading-title' }, [
          this.$slots.default
        ])
      ])
    }

    return h('li', {
      staticClass: 'q-timeline-entry',
      'class': this.side === 'left' ? 'q-timeline-entry-left' : 'q-timeline-entry-right'
    }, [
      h('div', { staticClass: 'q-timeline-subtitle' }, [
        h('span', this.subtitle)
      ]),
      this.icon ? h('div', { staticClass: 'q-timeline-dot q-timeline-dot-icon', 'class': this.colorClass }, [
        h(QIcon, {
          props: {
            name: this.icon
          }
        })
      ]) : h('div', {
        staticClass: 'q-timeline-dot',
        'class': this.colorClass
      }),
      h('div', { staticClass: 'q-timeline-content' }, [
        h('h6', { staticClass: 'q-timeline-title' }, [ this.title ]),
        this.$slots.default
      ])
    ])
  }
}
