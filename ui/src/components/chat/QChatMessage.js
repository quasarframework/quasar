import Vue from 'vue'

import ListenersMixin from '../../mixins/listeners.js'

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
    __wrapStamp (h, node) {
      if (this.$scopedSlots.stamp !== void 0) {
        return [ node, h('div', { staticClass: 'q-message-stamp' }, this.$scopedSlots.stamp()) ]
      }

      if (this.stamp) {
        const domPropStamp = this.stampSanitize === true ? 'textContent' : 'innerHTML'

        return [
          node,
          h('div', {
            staticClass: 'q-message-stamp',
            domProps: { [domPropStamp]: this.stamp }
          })
        ]
      }

      return [ node ]
    },

    __getText (h, contentList, withSlots) {
      const domPropText = this.textSanitize === true ? 'textContent' : 'innerHTML'

      if (
        withSlots === true &&
        contentList.some(entry => entry.tag === void 0 && entry.text !== void 0) === true
      ) {
        return [
          h('div', { class: this.messageClass }, [
            h('div', { class: this.textClass }, this.__wrapStamp(h, h('div', contentList)))
          ])
        ]
      }

      const content = withSlots !== true
        ? text => h('div', { domProps: { [domPropText]: text } })
        : (contentList.length > 1 ? text => text : text => h('div', [ text ]))

      return contentList.map((msg, index) => h('div', {
        key: index,
        class: this.messageClass
      }, [
        h('div', { class: this.textClass }, this.__wrapStamp(h, content(msg)))
      ]))
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

    if (this.$scopedSlots.name !== void 0) {
      msg.push(
        h('div', {
          class: `q-message-name q-message-name--${this.op}`
        }, this.$scopedSlots.name())
      )
    }
    else if (this.name !== void 0) {
      msg.push(
        h('div', {
          class: `q-message-name q-message-name--${this.op}`,
          domProps: { [this.nameSanitize === true ? 'textContent' : 'innerHTML']: this.name }
        })
      )
    }

    this.text !== void 0 && msg.push(
      this.__getText(h, this.text)
    )

    this.$scopedSlots.default !== void 0 && msg.push(
      this.__getText(h, this.$scopedSlots.default(), true)
    )

    container.push(
      h('div', { class: this.sizeClass }, msg)
    )

    const child = []

    if (this.$scopedSlots.label !== void 0) {
      child.push(
        h('div', { staticClass: 'q-message-label' }, this.$scopedSlots.label())
      )
    }
    else if (this.label !== void 0) {
      child.push(
        h('div', {
          staticClass: 'q-message-label',
          domProps: { [this.labelSanitize === true ? 'textContent' : 'innerHTML']: this.label }
        })
      )
    }

    child.push(
      h('div', { class: this.containerClass }, container)
    )

    return h('div', {
      class: `q-message q-message-${this.op}`,
      on: { ...this.qListeners }
    }, child)
  }
})
