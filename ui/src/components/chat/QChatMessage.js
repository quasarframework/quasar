import Vue from 'vue'

export default Vue.extend({
  name: 'QChatMessage',

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
      if (this.textColor) {
        return `text-${this.textColor}`
      }
    },

    messageClass () {
      if (this.bgColor) {
        return `text-${this.bgColor}`
      }
    },

    sizeClass () {
      if (this.size) {
        return `col-${this.size}`
      }
    },

    classes () {
      return {
        'q-message-sent': this.sent,
        'q-message-received': !this.sent
      }
    }
  },

  methods: {
    __getText (h) {
      const
        domPropText = this.textSanitize === true ? 'textContent' : 'innerHTML',
        domPropStamp = this.stampSanitize === true ? 'textContent' : 'innerHTML'

      return this.text.map((msg, index) => h('div', {
        key: index,
        staticClass: 'q-message-text',
        class: this.messageClass
      }, [
        h('span', {
          staticClass: 'q-message-text-content',
          class: this.textClass
        }, [
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
      return h('div', {
        staticClass: 'q-message-text',
        class: this.messageClass
      }, [
        h('span', {
          staticClass: 'q-message-text-content',
          class: this.textClass
        }, this.$scopedSlots.default().concat([
          this.stamp !== void 0
            ? h('div', {
              staticClass: 'q-message-stamp',
              domProps: { [this.stampSanitize === true ? 'textContent' : 'innerHTML']: this.stamp }
            })
            : null
        ]))
      ])
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-message',
      class: this.classes
    }, [
      this.label
        ? h('div', {
          staticClass: 'q-message-label text-center',
          domProps: { [this.labelSanitize === true ? 'textContent' : 'innerHTML']: this.label }
        })
        : null,

      h('div', {
        staticClass: 'q-message-container row items-end no-wrap'
      }, [
        this.$scopedSlots.avatar !== void 0
          ? this.$scopedSlots.avatar()
          : (
            this.avatar !== void 0
              ? h('img', {
                staticClass: 'q-message-avatar col-auto',
                attrs: { src: this.avatar }
              })
              : null
          ),

        h('div', { class: this.sizeClass }, [
          this.name !== void 0
            ? h('div', {
              staticClass: 'q-message-name',
              domProps: { [this.nameSanitize === true ? 'textContent' : 'innerHTML']: this.name }
            })
            : null,

          this.text !== void 0 ? this.__getText(h) : null,
          this.$scopedSlots.default !== void 0 ? this.__getMessage(h) : null
        ])
      ])
    ])
  }
})
