import { h, defineComponent, computed } from 'vue'

import { hUniqueSlot } from '../../utils/private/render.js'

export default defineComponent({
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
    labelHtml: Boolean,
    nameHtml: Boolean,
    textHtml: Boolean,
    stampHtml: Boolean
  },

  setup (props, { slots }) {
    const op = computed(() => (props.sent === true ? 'sent' : 'received'))

    const textClass = computed(() =>
      `q-message-text-content q-message-text-content--${ op.value }`
      + (props.textColor !== void 0 ? ` text-${ props.textColor }` : '')
    )

    const messageClass = computed(() =>
      `q-message-text q-message-text--${ op.value }`
      + (props.bgColor !== void 0 ? ` text-${ props.bgColor }` : '')
    )

    const containerClass = computed(() =>
      'q-message-container row items-end no-wrap'
      + (props.sent === true ? ' reverse' : '')
    )

    const sizeClass = computed(() => (props.size !== void 0 ? `col-${ props.size }` : ''))

    const domProps = computed(() => ({
      msg: props.textHtml === true ? 'innerHTML' : 'textContent',
      stamp: props.stampHtml === true ? 'innerHTML' : 'textContent',
      name: props.nameHtml === true ? 'innerHTML' : 'textContent',
      label: props.labelHtml === true ? 'innerHTML' : 'textContent'
    }))

    function getText () {
      const withStamp = props.stamp
        ? node => [
            node,
            h('div', {
              class: 'q-message-stamp',
              [ domProps.value.stamp ]: props.stamp
            })
          ]
        : node => [ node ]

      return props.text.map((msg, index) => h('div', {
        key: index,
        class: messageClass.value
      }, [
        h(
          'div',
          { class: textClass.value },
          withStamp(
            h('div', { [ domProps.value.msg ]: msg })
          )
        )
      ]))
    }

    function getMessage () {
      const content = hUniqueSlot(slots.default, [])

      props.stamp !== void 0 && content.push(
        h('div', {
          class: 'q-message-stamp',
          [ domProps.value.stamp ]: props.stamp
        })
      )

      return h('div', { class: messageClass.value }, [
        h('div', {
          class: 'q-message-text-content ' + textClass.value
        }, content)
      ])
    }

    return () => {
      const container = []

      if (slots.avatar !== void 0) {
        container.push(slots.avatar())
      }
      else if (props.avatar !== void 0) {
        container.push(
          h('img', {
            class: `q-message-avatar q-message-avatar--${ op.value }`,
            src: props.avatar,
            'aria-hidden': 'true'
          })
        )
      }

      const msg = []

      props.name !== void 0 && msg.push(
        h('div', {
          class: `q-message-name q-message-name--${ op.value }`,
          [ domProps.value.name ]: props.name
        })
      )

      props.text !== void 0 && msg.push(getText())

      slots.default !== void 0 && msg.push(getMessage())

      container.push(
        h('div', { class: sizeClass.value }, msg)
      )

      const child = []

      props.label && child.push(
        h('div', {
          class: 'q-message-label text-center',
          [ domProps.value.label ]: props.label
        })
      )

      child.push(
        h('div', { class: containerClass.value }, container)
      )

      return h('div', {
        class: `q-message q-message-${ op.value }`
      }, child)
    }
  }
})
