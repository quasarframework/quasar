import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { getNormalizedVNodes } from '../../utils/private.vm/vm.js'

export default /*#__PURE__*/ createComponent({
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

  setup(props, { slots }) {
    function wrapStamp(node) {
      if (slots.stamp !== void 0) {
        return [node, h('div', { class: 'q-message-stamp' }, slots.stamp())]
      }

      if (props.stamp) {
        return [
          node,
          h('div', {
            class: 'q-message-stamp',
            [props.stampHtml ? 'innerHTML' : 'textContent']: props.stamp
          })
        ]
      }

      return [node]
    }

    function getText(contentList, withSlots, op) {
      const messageClass =
        `q-message-text q-message-text--${op}` +
        (props.bgColor !== void 0 ? ` text-${props.bgColor}` : '')

      const textClass =
        `q-message-text-content q-message-text-content--${op}` +
        (props.textColor !== void 0 ? ` text-${props.textColor}` : '')

      const content = withSlots
        ? contentList.length > 1
          ? text => text
          : text => h('div', [text])
        : text =>
            h('div', { [props.textHtml ? 'innerHTML' : 'textContent']: text })

      return contentList.map((msg, index) =>
        h(
          'div',
          {
            key: index,
            class: messageClass
          },
          [h('div', { class: textClass }, wrapStamp(content(msg)))]
        )
      )
    }

    return () => {
      const op = props.sent ? 'sent' : 'received'

      const container = []

      if (slots.avatar !== void 0) {
        container.push(slots.avatar())
      } else if (props.avatar !== void 0) {
        container.push(
          h('img', {
            class: `q-message-avatar q-message-avatar--${op}`,
            src: props.avatar,
            'aria-hidden': 'true'
          })
        )
      }

      const msg = []

      if (slots.name !== void 0) {
        msg.push(
          h(
            'div',
            { class: `q-message-name q-message-name--${op}` },
            slots.name()
          )
        )
      } else if (props.name !== void 0) {
        msg.push(
          h('div', {
            class: `q-message-name q-message-name--${op}`,
            [props.nameHtml ? 'innerHTML' : 'textContent']: props.name
          })
        )
      }

      if (slots.default !== void 0) {
        msg.push(getText(getNormalizedVNodes(slots.default()), true, op))
      } else if (props.text !== void 0) {
        msg.push(getText(props.text, false, op))
      }

      container.push(
        h(
          'div',
          { class: props.size !== void 0 ? `col-${props.size}` : '' },
          msg
        )
      )

      const child = []

      if (slots.label !== void 0) {
        child.push(h('div', { class: 'q-message-label' }, slots.label()))
      } else if (props.label !== void 0) {
        child.push(
          h('div', {
            class: 'q-message-label',
            [props.labelHtml ? 'innerHTML' : 'textContent']: props.label
          })
        )
      }

      child.push(
        h(
          'div',
          {
            class:
              'q-message-container row items-end no-wrap' +
              (props.sent ? ' reverse' : '')
          },
          container
        )
      )

      return h(
        'div',
        {
          class: `q-message q-message-${op}`
        },
        child
      )
    }
  }
})
