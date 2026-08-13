import { h, inject, ref } from 'vue'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import useRouterLink, {
  useRouterLinkProps
} from '../../composables/private.use-router-link/use-router-link.js'

import { createComponent } from '../../utils/private.create/create.js'
import { listKey } from '../../utils/private.symbols/symbols.js'
import { hUniqueSlot } from '../../utils/private.render/render.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import { isKeyCode } from '../../utils/private.keyboard/key-composition.js'

export default /*#__PURE__*/ createComponent({
  name: 'QItem',

  props: {
    ...useDarkProps,
    ...useRouterLinkProps,

    tag: {
      type: String,
      default: 'div'
    },

    active: {
      type: Boolean,
      default: null
    },

    clickable: Boolean,
    dense: Boolean,
    insetLevel: Number,

    role: String,

    tabindex: [String, Number],

    focused: Boolean,
    manualFocus: Boolean
  },

  emits: ['click', 'keyup'],

  setup(props, { slots, emit }) {
    const $q = useQuasar()

    const isDark = useDark(props, $q)
    const { hasLink, linkAttrs, linkClass, linkTag, navigateOnClick } =
      useRouterLink()

    const rootRef = ref(null)
    const blurTargetRef = ref(null)

    function isActionable() {
      return props.clickable || hasLink.value || props.tag === 'label'
    }

    function isClickable() {
      return !props.disable && isActionable()
    }

    const listRole = inject(listKey, null)

    function getRole(actionable, clickable) {
      if (props.role !== void 0) return props.role

      const ctx = listRole !== null ? listRole.value : null

      if (ctx === 'menu' || ctx === 'menubar') {
        // actionable entries (including disabled ones, which stay
        // perceivable through aria-disabled) are the menu's items;
        // anything else (headers, ...) stays generic
        return actionable ? 'menuitem' : void 0
      }

      if (hasLink.value) return void 0 // implicit link role of <a>
      if (clickable) return 'button'

      // the listitem role requires an ancestor with list semantics,
      // so it may only be claimed inside such a QList
      return ctx === 'list' ? 'listitem' : void 0
    }

    function onClick(e) {
      if (isClickable()) {
        if (blurTargetRef.value !== null && !e.qAvoidFocus) {
          if (!e.qKeyEvent && document.activeElement === rootRef.value) {
            blurTargetRef.value.focus({ preventScroll: true })
          } else if (document.activeElement === blurTargetRef.value) {
            rootRef.value.focus({ preventScroll: true })
          }
        }

        navigateOnClick(e)
      }
    }

    function onKeyup(e) {
      if (isClickable() && isKeyCode(e, [13, 32])) {
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

    function onKeydown(e) {
      if (isClickable() && e.keyCode === 32) stopAndPrevent(e)
    }

    function getContent(clickable) {
      const child = hUniqueSlot(slots.default, [])

      if (clickable) {
        child.unshift(
          h('div', {
            class: 'q-focus-helper',
            tabindex: -1,
            ref: blurTargetRef
          })
        )
      }

      return child
    }

    return () => {
      const actionable = isActionable()
      const clickable = !props.disable && actionable

      const data = {
        ref: rootRef,
        class:
          'q-item q-item-type row no-wrap' +
          (props.dense ? ' q-item--dense' : '') +
          (isDark() ? ' q-item--dark' : '') +
          (hasLink.value && props.active === null
            ? linkClass.value
            : props.active
              ? ` q-item--active${props.activeClass !== void 0 ? ` ${props.activeClass}` : ''}`
              : '') +
          (props.disable ? ' disabled' : '') +
          (clickable
            ? ' q-item--clickable q-link cursor-pointer ' +
              (props.manualFocus
                ? 'q-manual-focusable'
                : 'q-focusable q-hoverable') +
              (props.focused ? ' q-manual-focusable--focused' : '')
            : ''),
        style:
          props.insetLevel !== void 0
            ? {
                ['padding' + ($q.lang.rtl ? 'Right' : 'Left')]:
                  16 + props.insetLevel * 56 + 'px'
              }
            : null,
        role: getRole(actionable, clickable),
        // bound regardless of clickability: bubbled key events from
        // inner content emit "keyup" as part of the public contract
        onKeyup
      }

      if (clickable) {
        // pointer listeners on a non-interactive element would flag
        // WCAG keyboard-accessibility checks, so bind them only when
        // the item is truly interactive
        data.onClick = onClick
        data.onKeydown = onKeydown
        data.tabindex = props.tabindex || '0'
        Object.assign(data, linkAttrs.value)
      } else if (actionable) {
        data['aria-disabled'] = 'true'
      }

      return h(linkTag.value, data, getContent(clickable))
    }
  }
})
