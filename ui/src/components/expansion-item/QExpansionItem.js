import { h, shallowReactive, defineComponent, ref, computed, watch, withDirectives, getCurrentInstance, vShow, onBeforeUnmount } from 'vue'

import QItem from '../item/QItem.js'
import QItemSection from '../item/QItemSection.js'
import QItemLabel from '../item/QItemLabel.js'
import QIcon from '../icon/QIcon.js'
import QSlideTransition from '../slide-transition/QSlideTransition.js'
import QSeparator from '../separator/QSeparator.js'

import useDark, { useDarkProps } from '../../composables/private/use-dark.js'
import { useRouterLinkProps } from '../../composables/private/use-router-link.js'
import useModelToggle, { useModelToggleProps, useModelToggleEmits } from '../../composables/private/use-model-toggle.js'

import { stopAndPrevent } from '../../utils/event.js'
import { hSlot } from '../../utils/private/render.js'
import uid from '../../utils/uid.js'

const itemGroups = shallowReactive({})
const LINK_PROPS = Object.keys(useRouterLinkProps)

export default defineComponent({
  name: 'QExpansionItem',

  props: {
    ...useRouterLinkProps,
    ...useModelToggleProps,
    ...useDarkProps,

    icon: String,

    label: String,
    labelLines: [ Number, String ],

    caption: String,
    captionLines: [ Number, String ],

    dense: Boolean,

    expandIcon: String,
    expandedIcon: String,
    expandIconClass: [ Array, String, Object ],
    duration: Number,

    headerInsetLevel: Number,
    contentInsetLevel: Number,

    expandSeparator: Boolean,
    defaultOpened: Boolean,
    expandIconToggle: Boolean,
    switchToggleSide: Boolean,
    denseToggle: Boolean,
    group: String,
    popup: Boolean,

    headerStyle: [ Array, String, Object ],
    headerClass: [ Array, String, Object ]
  },

  emits: [
    ...useModelToggleEmits,
    'click', 'after-show', 'after-hide'
  ],

  setup (props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance()
    const isDark = useDark(props, $q)

    const showing = ref(
      props.modelValue !== null
        ? props.modelValue
        : props.defaultOpened
    )

    const blurTargetRef = ref(null)

    const { hide, toggle } = useModelToggle({ showing })

    let uniqueId, exitGroup

    const classes = computed(() =>
      'q-expansion-item q-item-type'
      + ` q-expansion-item--${ showing.value === true ? 'expanded' : 'collapsed' }`
      + ` q-expansion-item--${ props.popup === true ? 'popup' : 'standard' }`
    )

    const contentStyle = computed(() => {
      if (props.contentInsetLevel === void 0) {
        return null
      }

      const dir = $q.lang.rtl === true ? 'Right' : 'Left'
      return {
        [ 'padding' + dir ]: (props.contentInsetLevel * 56) + 'px'
      }
    })

    const hasLink = computed(() =>
      props.disable !== true && props.to !== void 0 && props.to !== null && props.to !== ''
    )

    const linkProps = computed(() => {
      const acc = {}
      LINK_PROPS.forEach(key => {
        acc[ key ] = props[ key ]
      })
      return acc
    })

    const isClickable = computed(() =>
      hasLink.value === true || props.expandIconToggle !== true
    )

    const expansionIcon = computed(() => (
      props.expandedIcon !== void 0 && showing.value === true
        ? props.expandedIcon
        : props.expandIcon || $q.iconSet.expansionItem[ props.denseToggle === true ? 'denseIcon' : 'icon' ]
    ))

    const activeToggleIcon = computed(() =>
      props.disable !== true && (hasLink.value === true || props.expandIconToggle === true)
    )

    watch(() => props.group, name => {
      exitGroup !== void 0 && exitGroup()
      name !== void 0 && enterGroup()
    })

    function onHeaderClick (e) {
      hasLink.value !== true && toggle(e)
      emit('click', e)
    }

    function toggleIconKeyboard (e) {
      e.keyCode === 13 && toggleIcon(e, true)
    }

    function toggleIcon (e, keyboard) {
      keyboard !== true && blurTargetRef.value !== null && blurTargetRef.value.focus()
      toggle(e)
      stopAndPrevent(e)
    }

    function onShow () {
      emit('after-show')
    }

    function onHide () {
      emit('after-hide')
    }

    function enterGroup () {
      if (uniqueId === void 0) {
        uniqueId = uid()
      }

      if (showing.value === true) {
        itemGroups[ props.group ] = uniqueId
      }

      const show = watch(showing, val => {
        if (val === true) {
          itemGroups[ props.group ] = uniqueId
        }
        else if (itemGroups[ props.group ] === uniqueId) {
          delete itemGroups[ props.group ]
        }
      })

      const group = watch(
        () => itemGroups[ props.group ],
        (val, oldVal) => {
          if (oldVal === uniqueId && val !== void 0 && val !== uniqueId) {
            hide()
          }
        }
      )

      exitGroup = () => {
        show()
        group()

        if (itemGroups[ props.group ] === uniqueId) {
          delete itemGroups[ props.group ]
        }

        exitGroup = void 0
      }
    }

    function getToggleIcon () {
      const data = {
        class: [
          'q-focusable relative-position cursor-pointer'
            + `${ props.denseToggle === true && props.switchToggleSide === true ? ' items-end' : '' }`,
          props.expandIconClass
        ],
        side: props.switchToggleSide !== true,
        avatar: props.switchToggleSide
      }

      const child = [
        h(QIcon, {
          class: 'q-expansion-item__toggle-icon'
            + (props.expandedIcon === void 0 && showing.value === true
              ? ' q-expansion-item__toggle-icon--rotated'
              : ''),
          name: expansionIcon.value
        })
      ]

      if (activeToggleIcon.value === true) {
        Object.assign(data, {
          tabindex: 0,
          onClick: toggleIcon,
          onKeyup: toggleIconKeyboard
        })

        child.unshift(
          h('div', {
            ref: blurTargetRef,
            class: 'q-expansion-item__toggle-focus q-icon q-focus-helper q-focus-helper--rounded',
            tabindex: -1
          })
        )
      }

      return h(QItemSection, data, () => child)
    }

    function getHeaderChild () {
      let child

      if (slots.header !== void 0) {
        child = slots.header().slice()
      }
      else {
        child = [
          h(QItemSection, () => [
            h(QItemLabel, { lines: props.labelLines }, () => props.label || ''),

            props.caption
              ? h(QItemLabel, { lines: props.captionLines, caption: true }, () => props.caption)
              : null
          ])
        ]

        props.icon && child[ props.switchToggleSide === true ? 'push' : 'unshift' ](
          h(QItemSection, {
            side: props.switchToggleSide === true,
            avatar: props.switchToggleSide !== true
          }, () => h(QIcon, { name: props.icon }))
        )
      }

      props.disable !== true && child[ props.switchToggleSide === true ? 'unshift' : 'push' ](
        getToggleIcon()
      )

      return child
    }

    function getHeader () {
      const data = {
        ref: 'item',
        style: props.headerStyle,
        class: props.headerClass,
        dark: isDark.value,
        disable: props.disable,
        dense: props.dense,
        insetLevel: props.headerInsetLevel
      }

      if (isClickable.value === true) {
        data.clickable = true
        data.onClick = onHeaderClick

        hasLink.value === true && Object.assign(
          data,
          linkProps.value
        )
      }

      return h(QItem, data, getHeaderChild)
    }

    function getTransitionChild () {
      return withDirectives(
        h('div', {
          key: 'e-content',
          class: 'q-expansion-item__content relative-position',
          style: contentStyle.value
        }, hSlot(slots.default)),
        [ [
          vShow,
          showing.value
        ] ]
      )
    }

    function getContent () {
      const node = [
        getHeader(),

        h(QSlideTransition, {
          duration: props.duration,
          onShow,
          onHide
        }, getTransitionChild)
      ]

      if (props.expandSeparator === true) {
        node.push(
          h(QSeparator, {
            class: 'q-expansion-item__border q-expansion-item__border--top absolute-top',
            dark: isDark.value
          }),
          h(QSeparator, {
            class: 'q-expansion-item__border q-expansion-item__border--bottom absolute-bottom',
            dark: isDark.value
          })
        )
      }

      return node
    }

    props.group !== void 0 && enterGroup()

    onBeforeUnmount(() => {
      exitGroup !== void 0 && exitGroup()
    })

    return () => h('div', { class: classes.value }, [
      h('div', { class: 'q-expansion-item__container relative-position' }, getContent())
    ])
  }
})
