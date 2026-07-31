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

function preventSpace(e) {
  if (e.keyCode === 32) stopAndPrevent(e)
}
const LINK_PROPS = Object.keys(useRouterLinkProps)

export default createComponent({
  name: 'QExpansionItem',

  props: {
    ...useRouterLinkProps,
    ...useModelToggleProps,
    ...useDarkProps,

    icon: String,

    label: String,
    labelLines: [Number, String],

    caption: String,
    captionLines: [Number, String],

    dense: Boolean,

    toggleAriaLabel: String,
    expandIcon: String,
    expandedIcon: String,
    expandIconClass: [Array, String, Object],
    duration: {},

    headerInsetLevel: Number,
    contentInsetLevel: Number,

    expandSeparator: Boolean,
    defaultOpened: Boolean,
    hideExpandIcon: Boolean,
    expandIconToggle: Boolean,
    switchToggleSide: Boolean,
    denseToggle: Boolean,
    group: String,
    popup: Boolean,

    headerStyle: [Array, String, Object],
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
      if ([13, 32].includes(e.keyCode)) toggleIcon(e, true)
    }

    function toggleIcon(e, keyboard) {
      if (!keyboard && !e.qAvoidFocus) {
        blurTargetRef.value?.focus({ preventScroll: true })
      }

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
          onKeydown: preventSpace,
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
