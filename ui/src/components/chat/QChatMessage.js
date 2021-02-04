import Vue from 'vue'

import ListenersMixin from '../../mixins/listeners.js'
import { uniqueSlot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QChatMessage',

  mixins: [ ListenersMixin ],

  props: {
    sent: Boolean,
    label: String,
    bgColor: String,
    textColor: String,
    name: String,
    avatar: String,
    text: Array,
    stamp: String,
    size: String,
    labelSanitize: Boolean,
    nameSanitize: Boolean,
    textSanitize: Boolean,
    stampSanitize: Boolean
  },

  computed: {
    textClass () {
      return `q-message-text-content q-message-text-content--${this.op}` +
        (this.textColor !== void 0 ? ` text-${this.textColor}` : '')
    },

    messageClass () {
      return `q-message-text q-message-text--${this.op}` +
        (this.bgColor !== void 0 ? ` text-${this.bgColor}` : '')
    },

    containerClass () {
      return `q-message-container row items-end no-wrap` +
        (this.sent === true ? ' reverse' : '')
    },

    sizeClass () {
      if (this.size !== void 0) {
        return `col-${this.size}`
      }
    },

    op () {
      return this.sent === true ? 'sent' : 'received'
    }
  },

  methods: {
    __getText (h) {
      const
        domPropText = this.textSanitize === true ? 'textContent' : 'innerHTML',
        domPropStamp = this.stampSanitize === true ? 'textContent' : 'innerHTML'

      return this.text.map((msg, index) => h('div', {
        key: index,
        class: this.messageClass
      }, [
        h('div', { class: this.textClass }, [
          h('div', { domProps: { [domPropText]: msg } }),
          this.stamp
            ? h('div', {
              staticClass: 'q-message-stamp',
              domProps: { [domPropStamp]: this.stamp }
            })
            : null
        ])
      ]))
    },

    __getMessage (h) {
      const content = uniqueSlot(this, 'default', [])

      this.stamp !== void 0 && content.push(
        h('div', {
          staticClass: 'q-message-stamp',
          domProps: { [this.stampSanitize === true ? 'textContent' : 'innerHTML']: this.stamp }
        })
      )

      return h('div', { class: this.messageClass }, [
        h('div', {
          staticClass: 'q-message-text-content',
          class: this.textClass
        }, content)
      ])
    }
  },

  render (h) {
    const container = []

    if (this.$scopedSlots.avatar !== void 0) {
      container.push(this.$scopedSlots.avatar())
    }
    else if (this.avatar !== void 0) {
      container.push(
        h('img', {
          class: `q-message-avatar q-message-avatar--${this.op}`,
          attrs: { src: this.avatar, 'aria-hidden': 'true' }
        })
      )
    }

    const msg = []

    this.name !== void 0 && msg.push(
      h('div', {
        class: `q-message-name q-message-name--${this.op}`,
        domProps: { [this.nameSanitize === true ? 'textContent' : 'innerHTML']: this.name }
      })
    )

    this.text !== void 0 && msg.push(
      this.__getText(h)
    )

    this.$scopedSlots.default !== void 0 && msg.push(
      this.__getMessage(h)
    )

    container.push(
      h('div', { class: this.sizeClass }, msg)
    )

    const child = []

    this.label && child.push(
      h('div', {
        staticClass: 'q-message-label text-center',
        domProps: { [this.labelSanitize === true ? 'textContent' : 'innerHTML']: this.label }
      })
    )

    child.push(
      h('div', { class: this.containerClass }, container)
    )

    return h('div', {
      class: `q-message q-message-${this.op}`,
      on: { ...this.qListeners }
    }, child)
  }
})
