import { computed, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { getNormalizedVNodes } from '../../utils/private.vm/vm.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/chat
 */
/**
 * You can use this slot to define a custom message (overrides props)
 *
 * @api slot default
 */

/**
 * Slot for avatar; Suggestion: QAvatar, img
 *
 * @api slot avatar
 */

/**
 * Slot for name; Overrides the 'name' prop
 *
 * @api slot name
 */

/**
 * Slot for stamp; Overrides the 'stamp' prop
 *
 * @api slot stamp
 */

/**
 * Slot for label; Overrides the 'label' prop
 *
 * @api slot label
 */
export default createComponent({
  name: 'QChatMessage',

  props: {
    /**
     * Render as a sent message (so from current user)
     *
     * @api prop sent
     * @type {Boolean}
     * @category content
     */
    sent: Boolean,
    /**
     * Renders a label header/section only
     *
     * @api prop label
     * @type {String}
     * @category content
     * @example 'Friday, 18th'
     */
    label: String,
    /**
     * Color name (from the Quasar Color Palette) for chat bubble background
     *
     * @api prop bg-color
     * @extends color
     * @category style
     */
    bgColor: String,
    /**
     * Color name (from the Quasar Color Palette) for chat bubble text
     *
     * @api prop text-color
     * @extends text-color
     * @category style
     */
    textColor: String,
    /**
     * Author's name
     *
     * @api prop name
     * @type {String}
     * @category content
     * @example 'John Doe'
     */
    name: String,
    /**
     * URL to the avatar image of the author
     *
     * @api prop avatar
     * @type {String}
     * @category content
     * @example # (public folder) src="boy-avatar.png"
     * @example # (assets folder) src="~@/assets/boy-avatar.png"
     * @example # (relative path format) :src="require('./my_img.jpg')"
     */
    avatar: String,
    text: Array,
    /**
     * Creation timestamp
     *
     * @api prop stamp
     * @type {String}
     * @category content
     * @example '13:55'
     * @example 'Yesterday at 13:51'
     */
    stamp: String,
    /**
     * 1-12 out of 12 (same as col-*)
     *
     * @api prop size
     * @type {String}
     * @category style
     * @example '4'
     * @example '6'
     * @example '12'
     */
    size: String,
    /**
     * Render the label as HTML; This can lead to XSS attacks so make sure that you sanitize the message first
     *
     * @api prop label-html
     * @extends html
     */
    labelHtml: Boolean,
    /**
     * Render the name as HTML; This can lead to XSS attacks so make sure that you sanitize the message first
     *
     * @api prop name-html
     * @extends html
     */
    nameHtml: Boolean,
    /**
     * Render the text as HTML; This can lead to XSS attacks so make sure that you sanitize the message first
     *
     * @api prop text-html
     * @extends html
     */
    textHtml: Boolean,
    /**
     * Render the stamp as HTML; This can lead to XSS attacks so make sure that you sanitize the message first
     *
     * @api prop stamp-html
     * @extends html
     */
    stampHtml: Boolean
  },

  setup(props, { slots }) {
    const op = computed(() => (props.sent ? 'sent' : 'received'))

    const textClass = computed(
      () =>
        `q-message-text-content q-message-text-content--${op.value}` +
        (props.textColor !== void 0 ? ` text-${props.textColor}` : '')
    )

    const messageClass = computed(
      () =>
        `q-message-text q-message-text--${op.value}` +
        (props.bgColor !== void 0 ? ` text-${props.bgColor}` : '')
    )

    const containerClass = computed(
      () =>
        'q-message-container row items-end no-wrap' +
        (props.sent ? ' reverse' : '')
    )

    const sizeClass = computed(() =>
      props.size !== void 0 ? `col-${props.size}` : ''
    )

    const domProps = computed(() => ({
      msg: props.textHtml ? 'innerHTML' : 'textContent',
      stamp: props.stampHtml ? 'innerHTML' : 'textContent',
      name: props.nameHtml ? 'innerHTML' : 'textContent',
      label: props.labelHtml ? 'innerHTML' : 'textContent'
    }))

    function wrapStamp(node) {
      if (slots.stamp !== void 0) {
        return [node, h('div', { class: 'q-message-stamp' }, slots.stamp())]
      }

      if (props.stamp) {
        return [
          node,
          h('div', {
            class: 'q-message-stamp',
            [domProps.value.stamp]: props.stamp
          })
        ]
      }

      return [node]
    }

    function getText(contentList, withSlots) {
      const content = withSlots
        ? contentList.length > 1
          ? text => text
          : text => h('div', [text])
        : text => h('div', { [domProps.value.msg]: text })

      return contentList.map((msg, index) =>
        h(
          'div',
          {
            key: index,
            class: messageClass.value
          },
          [h('div', { class: textClass.value }, wrapStamp(content(msg)))]
        )
      )
    }

    return () => {
      const container = []

      if (slots.avatar !== void 0) {
        container.push(slots.avatar())
      } else if (props.avatar !== void 0) {
        container.push(
          h('img', {
            class: `q-message-avatar q-message-avatar--${op.value}`,
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
            { class: `q-message-name q-message-name--${op.value}` },
            slots.name()
          )
        )
      } else if (props.name !== void 0) {
        msg.push(
          h('div', {
            class: `q-message-name q-message-name--${op.value}`,
            [domProps.value.name]: props.name
          })
        )
      }

      if (slots.default !== void 0) {
        msg.push(getText(getNormalizedVNodes(slots.default()), true))
      } else if (props.text !== void 0) {
        msg.push(getText(props.text, false))
      }

      container.push(h('div', { class: sizeClass.value }, msg))

      const child = []

      if (slots.label !== void 0) {
        child.push(h('div', { class: 'q-message-label' }, slots.label()))
      } else if (props.label !== void 0) {
        child.push(
          h('div', {
            class: 'q-message-label',
            [domProps.value.label]: props.label
          })
        )
      }

      child.push(h('div', { class: containerClass.value }, container))

      return h(
        'div',
        {
          class: `q-message q-message-${op.value}`
        },
        child
      )
    }
  }
})
