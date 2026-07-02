import { computed, ref } from 'vue'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import useRouterLink, {
  useRouterLinkProps
} from '../../composables/private.use-router-link/use-router-link.js'

import { stopAndPrevent } from '../../utils/event/event.js'
import { isKeyCode } from '../../utils/private.keyboard/key-composition.js'

export const useItemProps = {
  ...useDarkProps,
  ...useRouterLinkProps,

  /**
   * HTML tag to use
   *
   * @api prop tag
   * @type {String}
   * @default 'div'
   * @category content
   * @example 'div'
   * @example 'label'
   * @example 'a'
   */
  tag: {
    type: String,
    default: 'div'
  },

  /**
   * Put item into active state
   *
   * @api prop active
   * @type {Boolean}
   * @default null
   * @category state
   */
  active: {
    type: Boolean,
    default: null
  },

  /**
   * Is QItem clickable? If it's the case, then it will add hover effects and emit 'click' events
   *
   * @api prop clickable
   * @type {Boolean}
   * @category state
   */
  clickable: Boolean,

  /**
   * Dense mode; occupies less space
   *
   * @api prop dense
   * @extends dense
   */
  dense: Boolean,

  /**
   * Apply an inset; Useful when avatar/left side is missing but you want to align content with other items that do have a left side, or when you're building a menu
   *
   * @api prop inset-level
   * @type {Number}
   * @category content
   * @example 1
   * @example 2
   */
  insetLevel: Number,

  /**
   * Tabindex HTML attribute value
   *
   * @api prop tabindex
   * @type {String|Number}
   * @category general
   */
  tabindex: [String, Number],

  /**
   * Put item into a manual focused state
   *
   * @api prop focused
   * @type {Boolean}
   * @category state
   */
  focused: Boolean,

  /**
   * Put item into a manual focusable mode
   *
   * @api prop manual-focus
   * @type {Boolean}
   * @category state
   */
  manualFocus: Boolean
}

export const useItemEmits = [
  /**
   * Emitted when component is clicked
   *
   * @api event click
   * @param {Event} evt JS event object
   */
  'click',

  /**
   * Emitted when a keyup event occurs on the component
   *
   * @api event keyup
   * @param {KeyboardEvent} evt JS event object
   */
  'keyup'
]

export default function useItem(props, emit, $q) {
  const isDark = useDark(props, $q)
  const { hasLink, linkAttrs, linkClass, linkTag, navigateOnClick } =
    useRouterLink()

  const rootRef = ref(null)
  const blurTargetRef = ref(null)

  const isActionable = computed(
    () => props.clickable || hasLink.value || props.tag === 'label'
  )

  const isClickable = computed(() => !props.disable && isActionable.value)

  const classes = computed(
    () =>
      'q-item q-item-type row no-wrap' +
      (props.dense ? ' q-item--dense' : '') +
      (isDark.value ? ' q-item--dark' : '') +
      (hasLink.value && props.active === null
        ? linkClass.value
        : props.active
          ? ` q-item--active${props.activeClass !== void 0 ? ` ${props.activeClass}` : ''}`
          : '') +
      (props.disable ? ' disabled' : '') +
      (isClickable.value
        ? ' q-item--clickable q-link cursor-pointer ' +
          (props.manualFocus
            ? 'q-manual-focusable'
            : 'q-focusable q-hoverable') +
          (props.focused ? ' q-manual-focusable--focused' : '')
        : '')
  )

  const style = computed(() => {
    if (props.insetLevel === void 0) return null

    const dir = $q.lang.rtl ? 'Right' : 'Left'
    return {
      ['padding' + dir]: 16 + props.insetLevel * 56 + 'px'
    }
  })

  function onClick(e) {
    if (isClickable.value) {
      if (blurTargetRef.value !== null && !e.qAvoidFocus) {
        if (!e.qKeyEvent && document.activeElement === rootRef.value) {
          blurTargetRef.value.focus()
        } else if (document.activeElement === blurTargetRef.value) {
          rootRef.value.focus()
        }
      }

      navigateOnClick(e)
    }
  }

  function onKeyup(e) {
    if (isClickable.value && isKeyCode(e, [13, 32])) {
      stopAndPrevent(e)

      // for ripple
      e.qKeyEvent = true

      // for click trigger
      const evt = new MouseEvent('click', e)
      evt.qKeyEvent = true
      rootRef.value.dispatchEvent(evt)
    }

    emit('keyup', e)
  }

  return {
    rootRef,
    blurTargetRef,
    classes,
    style,
    isActionable,
    isClickable,
    linkAttrs,
    linkTag,
    onClick,
    onKeyup
  }
}
