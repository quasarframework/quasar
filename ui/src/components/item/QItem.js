import { computed, getCurrentInstance, h, ref } from 'vue'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import useRouterLink, {
  useRouterLinkProps
} from '../../composables/private.use-router-link/use-router-link.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hUniqueSlot } from '../../utils/private.render/render.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import { isKeyCode } from '../../utils/private.keyboard/key-composition.js'

export default createComponent({
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

    tabindex: [String, Number],

    focused: Boolean,
    manualFocus: Boolean
  },

  emits: ['click', 'keyup'],

  setup(props, { slots, emit }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()

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
            blurTargetRef.value.focus({ preventScroll: true })
          } else if (document.activeElement === blurTargetRef.value) {
            rootRef.value.focus({ preventScroll: true })
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

    function onKeydown(e) {
      if (isClickable.value && e.keyCode === 32) stopAndPrevent(e)
    }

    function getContent() {
      const child = hUniqueSlot(slots.default, [])

      if (isClickable.value) {
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
      const data = {
        ref: rootRef,
        class: classes.value,
        style: style.value,
        role: hasLink.value
          ? void 0
          : isClickable.value
            ? 'button'
            : 'listitem',
        onClick,
        onKeydown,
        onKeyup
      }

      if (isClickable.value) {
        data.tabindex = props.tabindex || '0'
        Object.assign(data, linkAttrs.value)
      } else if (isActionable.value) {
        data['aria-disabled'] = 'true'
      }

      return h(linkTag.value, data, getContent())
    }
  }
})
