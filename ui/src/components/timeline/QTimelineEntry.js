import { h, defineComponent } from 'vue'

import QIcon from '../icon/QIcon.js'

import { slot, uniqueSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QTimelineEntry',

  inject: {
    __qTimeline: {
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
    avatar: String,

    color: String,

    title: String,
    subtitle: String,
    body: String
  },

  computed: {
    classes () {
      return `q-timeline__entry q-timeline__entry--${this.side}` +
        (this.icon !== void 0 || this.avatar !== void 0 ? ' q-timeline__entry--icon' : '')
    },

    dotClass () {
      return `q-timeline__dot text-${this.color || this.__qTimeline.color}`
    },

    reverse () {
      return this.__qTimeline.layout === 'comfortable' && this.__qTimeline.side === 'left'
    }
  },

  render () {
    const child = uniqueSlot(this, 'default', [])

    if (this.body !== void 0) {
      child.unshift(this.body)
    }

    if (this.heading === true) {
      const content = [
        h('div'),
        h('div'),
        h(
          this.tag,
          { class: 'q-timeline__heading-title' },
          child
        )
      ]

      return h('div', {
        class: 'q-timeline__heading'
      }, this.reverse === true ? content.reverse() : content)
    }

    let dot

    if (this.icon !== void 0) {
      dot = [
        h(QIcon, {
          class: 'row items-center justify-center',
          name: this.icon
        })
      ]
    }
    else if (this.avatar !== void 0) {
      dot = [
        h('img', {
          class: 'q-timeline__dot-img',
          src: this.avatar
        })
      ]
    }

    const content = [
      h('div', { class: 'q-timeline__subtitle' }, [
        h('span', {}, slot(this, 'subtitle', [ this.subtitle ]))
      ]),

      h('div', {
        class: this.dotClass
      }, dot),

      h('div', { class: 'q-timeline__content' }, [
        h('h6', { class: 'q-timeline__title' }, slot(this, 'title', [ this.title ]))
      ].concat(child))
    ]

    return h('li', {
      class: this.classes
    }, this.reverse === true ? content.reverse() : content)
  }
})
