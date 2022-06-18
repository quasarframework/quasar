import { h, computed } from 'vue'

import { createComponent } from '../../utils/private/create.js'
import { getNormalizedVNodes } from '../../utils/private/vm.js'

export default createComponent({
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

    function wrapStamp (node) {
      if (slots.stamp !== void 0) {
        return [ node, h('div', { class: 'q-message-stamp' }, slots.stamp()) ]
      }

      if (props.stamp) {
        return [
          node,
          h('div', {
            class: 'q-message-stamp',
            [ domProps.value.stamp ]: props.stamp
          })
        ]
      }

      return [ node ]
    }

    function getText (contentList, withSlots) {
      const content = withSlots === true
        ? (contentList.length > 1 ? text => text : text => h('div', [ text ]))
        : text => h('div', { [ domProps.value.msg ]: text })

      return contentList.map((msg, index) => h('div', {
        key: index,
        class: messageClass.value
      }, [
        h('div', { class: textClass.value }, wrapStamp(content(msg)))
      ]))
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

      if (slots.name !== void 0) {
        msg.push(
          h('div', { class: `q-message-name q-message-name--${ op.value }` }, slots.name())
        )
      }
      else if (props.name !== void 0) {
        msg.push(
          h('div', {
            class: `q-message-name q-message-name--${ op.value }`,
            [ domProps.value.name ]: props.name
          })
        )
      }

      if (slots.default !== void 0) {
        msg.push(
          getText(
            getNormalizedVNodes(slots.default()),
            true
          )
        )
      }
      else if (props.text !== void 0) {
        msg.push(getText(props.text))
      }

      container.push(
        h('div', { class: sizeClass.value }, msg)
      )

      const child = []

      if (slots.label !== void 0) {
        child.push(
          h('div', { class: 'q-message-label' }, slots.label())
        )
      }
      else if (props.label !== void 0) {
        child.push(
          h('div', {
            class: 'q-message-label',
            [ domProps.value.label ]: props.label
          })
        )
      }

      child.push(
        h('div', { class: containerClass.value }, container)
      )

      return h('div', {
        class: `q-message q-message-${ op.value }`
      }, child)
    }
  }
})
