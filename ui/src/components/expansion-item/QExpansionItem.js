import {
  computed,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  ref,
  shallowReactive,
  vShow,
  watch,
  withDirectives
} from 'vue'

import QItem from '../item/QItem.js'
import QItemSection from '../item/QItemSection.js'
import QItemLabel from '../item/QItemLabel.js'
import QIcon from '../icon/QIcon.js'
import QSlideTransition from '../slide-transition/QSlideTransition.js'
import QSeparator from '../separator/QSeparator.js'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import useId from '../../composables/use-id/use-id.js'
import { useRouterLinkProps } from '../../composables/private.use-router-link/use-router-link.js'
import useModelToggle, {
  useModelToggleEmits,
  useModelToggleProps
} from '../../composables/private.use-model-toggle/use-model-toggle.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import { hSlot } from '../../utils/private.render/render.js'
import uid from '../../utils/uid/uid.js'

const itemGroups = shallowReactive({})
const LINK_PROPS = Object.keys(useRouterLinkProps)

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/expansion-item
 */
/**
 * Slot used for expansion item's content
 *
 * @api slot default
 */

/**
 * Slot used for overriding default header
 *
 * @api slot header
 * @scope expanded {Boolean} QExpansionItem expanded status
 * @scope detailsId {String} QExpansionItem details panel id (for use in aria-controls)
 * @scope show {Function} Triggers component to show
 * @scope hide {Function} Triggers component to hide
 * @scope toggle {Function} Triggers component to toggle between show/hide
 */
export default createComponent({
  name: 'QExpansionItem',

  props: {
    ...useRouterLinkProps,
    ...useModelToggleProps,
    ...useDarkProps,

    /**
     * @api prop icon
     * @extends icon
     */
    icon: String,

    /**
     * Header label (unless using 'header' slot)
     *
     * @api prop label
     * @type {String}
     * @category content
     * @example 'My expansion item'
     */
    label: String,
    /**
     * Apply ellipsis when there's not enough space to render on the specified number of lines; If more than one line specified, then it will only work on webkit browsers because it uses the '-webkit-line-clamp' CSS property!
     *
     * @api prop label-lines
     * @type {Number|String}
     * @category content
     * @example 1
     * @example '3'
     */
    labelLines: [Number, String],

    /**
     * Header sub-label (unless using 'header' slot)
     *
     * @api prop caption
     * @type {String}
     * @category content
     * @example 'Unread message: 5'
     */
    caption: String,
    /**
     * Apply ellipsis when there's not enough space to render on the specified number of lines; If more than one line specified, then it will only work on webkit browsers because it uses the '-webkit-line-clamp' CSS property!
     *
     * @api prop caption-lines
     * @type {Number|String}
     * @category content
     * @example 1
     * @example '3'
     */
    captionLines: [Number, String],

    /**
     * @api prop dense
     * @extends dense
     */
    dense: Boolean,

    /**
     * aria-label to be used on the expansion toggle element
     *
     * @api prop toggle-aria-label
     * @type {String}
     * @category accessibility
     * @added-in v2.8.4
     * @example 'Open details'
     */
    toggleAriaLabel: String,
    /**
     * @api prop expand-icon
     * @extends icon
     */
    expandIcon: String,
    /**
     * Expand icon name (following Quasar convention) for when QExpansionItem is expanded; When used, it also disables the rotation animation of the expand icon; Make sure you have the icon library installed unless you are using 'img:' prefix
     *
     * @api prop expanded-icon
     * @extends icon
     */
    expandedIcon: String,
    /**
     * Apply custom class(es) to the expand icon item section
     *
     * @api prop expand-icon-class
     * @type {String|Array|Object}
     * @ts-type VueClassProp
     * @category style
     * @example 'text-purple'
     */
    expandIconClass: [Array, String, Object],
    /**
     * Animation duration (in milliseconds)
     *
     * @api prop duration
     * @type {Number}
     * @default 300
     * @category behavior
     */
    duration: {},

    /**
     * Apply an inset to header (unless using 'header' slot); Useful when header avatar/left side is missing but you want to align content with other items that do have a left side, or when you're building a menu
     *
     * @api prop header-inset-level
     * @type {Number}
     * @category content
     * @example 1
     */
    headerInsetLevel: Number,
    /**
     * Apply an inset to content (changes content padding)
     *
     * @api prop content-inset-level
     * @type {Number}
     * @category content
     * @example 1
     */
    contentInsetLevel: Number,

    /**
     * Apply a top and bottom separator when expansion item is opened
     *
     * @api prop expand-separator
     * @type {Boolean}
     * @category content
     */
    expandSeparator: Boolean,
    /**
     * Puts expansion item into open state on initial render; Overridden by v-model if used
     *
     * @api prop default-opened
     * @type {Boolean}
     * @category behavior
     */
    defaultOpened: Boolean,
    /**
     * Do not show the expand icon
     *
     * @api prop hide-expand-icon
     * @type {Boolean}
     * @category content
     * @added-in v2.8.4
     */
    hideExpandIcon: Boolean,
    /**
     * Applies the expansion events to the expand icon only and not to the whole header
     *
     * @api prop expand-icon-toggle
     * @type {Boolean}
     * @category behavior
     */
    expandIconToggle: Boolean,
    /**
     * Switch expand icon side (from default 'right' to 'left')
     *
     * @api prop switch-toggle-side
     * @type {Boolean}
     * @category content
     */
    switchToggleSide: Boolean,
    /**
     * Use dense mode for expand icon
     *
     * @api prop dense-toggle
     * @type {Boolean}
     * @category style
     */
    denseToggle: Boolean,
    /**
     * Register expansion item into a group (unique name that must be applied to all expansion items in that group) for coordinated open/close state within the group a.k.a. 'accordion mode'
     *
     * @api prop group
     * @type {String}
     * @category content|behavior
     * @example 'my-emails'
     */
    group: String,
    /**
     * Put expansion list into 'popup' mode
     *
     * @api prop popup
     * @type {Boolean}
     * @category behavior
     */
    popup: Boolean,

    /**
     * Apply custom style to the header
     *
     * @api prop header-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category style
     * @example 'background: #ff0000'
     * @example { backgroundColor: '#ff0000' }
     */
    headerStyle: [Array, String, Object],
    /**
     * Apply custom class(es) to the header
     *
     * @api prop header-class
     * @type {String|Array|Object}
     * @ts-type VueClassProp
     * @category style
     * @example 'my-custom-class'
     * @example { 'my-custom-class': true }
     */
    headerClass: [Array, String, Object]
  },

  emits: [...useModelToggleEmits, 'click', 'afterShow', 'afterHide'],

  setup(props, { slots, emit }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()
    const isDark = useDark(props, $q)

    const showing = ref(
      props.modelValue !== null ? props.modelValue : props.defaultOpened
    )

    const blurTargetRef = ref(null)
    const targetUid = useId()

    const { show, hide, toggle } = useModelToggle({ showing })

    let uniqueId, exitGroup

    const classes = computed(
      () =>
        'q-expansion-item q-item-type' +
        ` q-expansion-item--${showing.value ? 'expanded' : 'collapsed'}` +
        ` q-expansion-item--${props.popup ? 'popup' : 'standard'}`
    )

    const contentStyle = computed(() => {
      if (props.contentInsetLevel === void 0) {
        return null
      }

      const dir = $q.lang.rtl ? 'Right' : 'Left'
      return {
        ['padding' + dir]: props.contentInsetLevel * 56 + 'px'
      }
    })

    const hasLink = computed(
      () =>
        !props.disable &&
        (props.href !== void 0 ||
          (props.to !== void 0 && props.to !== null && props.to !== ''))
    )

    const linkProps = computed(() => {
      const acc = {}
      LINK_PROPS.forEach(key => {
        acc[key] = props[key]
      })
      return acc
    })

    const isClickable = computed(() => hasLink.value || !props.expandIconToggle)

    const expansionIcon = computed(() =>
      props.expandedIcon !== void 0 && showing.value
        ? props.expandedIcon
        : props.expandIcon ||
          $q.iconSet.expansionItem[props.denseToggle ? 'denseIcon' : 'icon']
    )

    const activeToggleIcon = computed(
      () => !props.disable && (hasLink.value || props.expandIconToggle)
    )

    const headerSlotScope = computed(() => ({
      expanded: showing.value,
      detailsId: targetUid.value,
      toggle,
      show,
      hide
    }))

    const toggleAriaAttrs = computed(() => {
      const toggleAriaLabel =
        props.toggleAriaLabel !== void 0
          ? props.toggleAriaLabel
          : $q.lang.label[showing.value ? 'collapse' : 'expand'](props.label)

      return {
        role: 'button',
        'aria-expanded': showing.value ? 'true' : 'false',
        'aria-controls': targetUid.value,
        'aria-label': toggleAriaLabel
      }
    })

    watch(
      () => props.group,
      name => {
        exitGroup?.()
        if (name !== void 0) enterGroup()
      }
    )

    function onHeaderClick(e) {
      if (!hasLink.value) toggle(e)
      emit('click', e)
    }

    function toggleIconKeyboard(e) {
      if (e.keyCode === 13) toggleIcon(e, true)
    }

    function toggleIcon(e, keyboard) {
      if (!keyboard && !e.qAvoidFocus) blurTargetRef.value?.focus()

      toggle(e)
      stopAndPrevent(e)
    }

    function onShow() {
      emit('afterShow')
    }

    function onHide() {
      emit('afterHide')
    }

    function enterGroup() {
      if (uniqueId === void 0) {
        uniqueId = uid()
      }

      if (showing.value) {
        itemGroups[props.group] = uniqueId
      }

      const stopShowWatcher = watch(showing, val => {
        if (val) {
          itemGroups[props.group] = uniqueId
        } else if (itemGroups[props.group] === uniqueId) {
          delete itemGroups[props.group]
        }
      })

      const stopGroupWatcher = watch(
        () => itemGroups[props.group],
        (val, oldVal) => {
          if (oldVal === uniqueId && val !== void 0 && val !== uniqueId) {
            hide()
          }
        }
      )

      exitGroup = () => {
        stopShowWatcher()
        stopGroupWatcher()

        if (itemGroups[props.group] === uniqueId) {
          delete itemGroups[props.group]
        }

        exitGroup = void 0
      }
    }

    function getToggleIcon() {
      const data = {
        class: [
          'q-focusable relative-position cursor-pointer' +
            `${props.denseToggle && props.switchToggleSide ? ' items-end' : ''}`,
          props.expandIconClass
        ],
        side: !props.switchToggleSide,
        avatar: props.switchToggleSide
      }

      const child = [
        h(QIcon, {
          class:
            'q-expansion-item__toggle-icon' +
            (props.expandedIcon === void 0 && showing.value
              ? ' q-expansion-item__toggle-icon--rotated'
              : ''),
          name: expansionIcon.value
        })
      ]

      if (activeToggleIcon.value) {
        Object.assign(data, {
          tabindex: 0,
          ...toggleAriaAttrs.value,
          onClick: toggleIcon,
          onKeyup: toggleIconKeyboard
        })

        child.unshift(
          h('div', {
            ref: blurTargetRef,
            class:
              'q-expansion-item__toggle-focus q-icon q-focus-helper q-focus-helper--rounded',
            tabindex: -1
          })
        )
      }

      return h(QItemSection, data, () => child)
    }

    function getHeaderChild() {
      let child

      if (slots.header !== void 0) {
        child = [slots.header(headerSlotScope.value)].flat()
      } else {
        child = [
          h(QItemSection, () => [
            h(QItemLabel, { lines: props.labelLines }, () => props.label || ''),

            props.caption
              ? h(
                  QItemLabel,
                  { lines: props.captionLines, caption: true },
                  () => props.caption
                )
              : null
          ])
        ]

        if (props.icon) {
          child[props.switchToggleSide ? 'push' : 'unshift'](
            h(
              QItemSection,
              {
                side: props.switchToggleSide,
                avatar: !props.switchToggleSide
              },
              () => h(QIcon, { name: props.icon })
            )
          )
        }
      }

      if (!props.disable && !props.hideExpandIcon) {
        child[props.switchToggleSide ? 'unshift' : 'push'](getToggleIcon())
      }

      return child
    }

    function getHeader() {
      const data = {
        ref: 'item',
        style: props.headerStyle,
        class: props.headerClass,
        dark: isDark.value,
        disable: props.disable,
        dense: props.dense,
        insetLevel: props.headerInsetLevel
      }

      if (isClickable.value) {
        data.clickable = true
        data.onClick = onHeaderClick

        Object.assign(
          data,
          hasLink.value ? linkProps.value : toggleAriaAttrs.value
        )
      }

      return h(QItem, data, getHeaderChild)
    }

    function getTransitionChild() {
      return withDirectives(
        h(
          'div',
          {
            key: 'e-content',
            class: 'q-expansion-item__content relative-position',
            style: contentStyle.value,
            id: targetUid.value
          },
          hSlot(slots.default)
        ),
        [[vShow, showing.value]]
      )
    }

    function getContent() {
      const node = [
        getHeader(),

        h(
          QSlideTransition,
          {
            duration: props.duration,
            onShow,
            onHide
          },
          getTransitionChild
        )
      ]

      if (props.expandSeparator) {
        node.push(
          h(QSeparator, {
            class:
              'q-expansion-item__border q-expansion-item__border--top absolute-top',
            dark: isDark.value
          }),
          h(QSeparator, {
            class:
              'q-expansion-item__border q-expansion-item__border--bottom absolute-bottom',
            dark: isDark.value
          })
        )
      }

      return node
    }

    if (props.group !== void 0) enterGroup()

    onBeforeUnmount(() => {
      exitGroup?.()
    })

    return () =>
      h('div', { class: classes.value }, [
        h(
          'div',
          { class: 'q-expansion-item__container relative-position' },
          getContent()
        )
      ])
  }
})
