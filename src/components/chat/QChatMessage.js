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
    size: String
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
      return this.text.map((msg, index) => h('div', {
        key: index,
        staticClass: 'q-message-text',
        class: this.messageClass
      }, [
        h('span', {
          staticClass: 'q-message-text-content',
          class: this.textClass
        }, [
          h('div', { domProps: { innerHTML: msg } }),
          this.stamp
            ? h('div', {
              staticClass: 'q-message-stamp',
              domProps: { innerHTML: this.stamp }
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
        }, [
          this.$slots.default,
          this.stamp
            ? h('div', {
              staticClass: 'q-message-stamp',
              domProps: { innerHTML: this.stamp }
            })
            : null
        ])
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
          domProps: { innerHTML: this.label }
        })
        : null,

      h('div', {
        staticClass: 'q-message-container row items-end no-wrap'
      }, [
        this.$slots.avatar || (
          this.avatar
            ? h('img', {
              staticClass: 'q-message-avatar col-auto',
              attrs: { src: this.avatar }
            })
            : null
        ),

        h('div', { class: this.sizeClass }, [
          this.name
            ? h('div', {
              staticClass: 'q-message-name',
              domProps: { innerHTML: this.name }
            })
            : null,

          this.text ? this.__getText(h) : null,
          this.$slots.default ? this.__getMessage(h) : null
        ])
      ])
    ])
  }
})
