import { h, ref, computed, inject, onBeforeUnmount, onMounted, withDirectives, getCurrentInstance } from 'vue'

import QIcon from '../icon/QIcon.js'

import Ripple from '../../directives/Ripple.js'

import { hMergeSlot } from '../../utils/private/render.js'
import { isKeyCode, shouldIgnoreKey } from '../../utils/private/key-composition.js'
import { tabsKey } from '../../utils/private/symbols.js'
import { stopAndPrevent } from '../../utils/event.js'

let uid = 0

export const useTabEmits = [ 'click', 'keydown' ]

export const useTabProps = {
  icon: String,
  label: [ Number, String ],

  alert: [ Boolean, String ],
  alertIcon: String,

  name: {
    type: [ Number, String ],
    default: () => `t_${ uid++ }`
  },

  noCaps: Boolean,

  tabindex: [ String, Number ],
  disable: Boolean,

  contentClass: String,

  ripple: {
    type: [ Boolean, Object ],
    default: true
  }
}

export default function (props, slots, emit, routerProps) {
  const $tabs = inject(tabsKey, () => {
    console.error('QTab/QRouteTab component needs to be child of QTabs')
  })

  const { proxy } = getCurrentInstance()

  const blurTargetRef = ref(null)
  const rootRef = ref(null)
  const tabIndicatorRef = ref(null)

  const ripple = computed(() => (
    props.disable === true || props.ripple === false
      ? false
      : Object.assign(
        { keyCodes: [ 13, 32 ], early: true },
        props.ripple === true ? {} : props.ripple
      )
  ))

  const isActive = computed(() => $tabs.currentModel.value === props.name)

  const classes = computed(() =>
    'q-tab relative-position self-stretch flex flex-center text-center'
    + (
      isActive.value === true
        ? (
            ' q-tab--active'
            + ($tabs.tabProps.value.activeClass ? ' ' + $tabs.tabProps.value.activeClass : '')
            + ($tabs.tabProps.value.activeColor ? ` text-${ $tabs.tabProps.value.activeColor }` : '')
            + ($tabs.tabProps.value.activeBgColor ? ` bg-${ $tabs.tabProps.value.activeBgColor }` : '')
          )
        : ' q-tab--inactive'
    )
    + (props.icon && props.label && $tabs.tabProps.value.inlineLabel === false ? ' q-tab--full' : '')
    + (props.noCaps === true || $tabs.tabProps.value.noCaps === true ? ' q-tab--no-caps' : '')
    + (props.disable === true ? ' disabled' : ' q-focusable q-hoverable cursor-pointer')
    + (routerProps !== void 0 && routerProps.linkClass.value !== '' ? ` ${ routerProps.linkClass.value }` : '')
  )

  const innerClass = computed(() =>
    'q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable '
    + ($tabs.tabProps.value.inlineLabel === true ? 'row no-wrap q-tab__content--inline' : 'column')
    + (props.contentClass !== void 0 ? ` ${ props.contentClass }` : '')
  )

  const tabIndex = computed(() => (
    props.disable === true || $tabs.hasFocus.value === true
      ? -1
      : props.tabindex || 0
  ))

  function onClick (e, keyboard) {
    keyboard !== true && blurTargetRef.value !== null && blurTargetRef.value.focus()

    if (props.disable !== true) {
      let go

      if (routerProps !== void 0) {
        if (routerProps.hasRouterLink.value === true) {
          go = () => {
            e.__qNavigate = true
            $tabs.avoidRouteWatcher = true

            const res = routerProps.navigateToRouterLink(e)

            if (res === false) {
              $tabs.avoidRouteWatcher = false
            }
            else {
              res.then(() => {
                $tabs.avoidRouteWatcher = false
                $tabs.updateModel({ name: props.name, fromRoute: true })
              })
            }
          }
        }
        else {
          emit('click', e)
          return
        }
      }
      else {
        go = () => {
          $tabs.updateModel({ name: props.name, fromRoute: false })
        }
      }

      emit('click', e, go)
      e.defaultPrevented !== true && go()
    }
  }

  function onKeydown (e) {
    if (isKeyCode(e, [ 13, 32 ])) {
      onClick(e, true)
    }
    else if (shouldIgnoreKey(e) !== true && e.keyCode >= 35 && e.keyCode <= 40) {
      $tabs.onKbdNavigate(e.keyCode, proxy.$el) === true && stopAndPrevent(e)
    }
    emit('keydown', e)
  }

  function getContent () {
    const
      narrow = $tabs.tabProps.value.narrowIndicator,
      content = [],
      indicator = h('div', {
        ref: tabIndicatorRef,
        class: [
          'q-tab__indicator',
          $tabs.tabProps.value.indicatorClass
        ]
      })

    props.icon !== void 0 && content.push(
      h(QIcon, {
        class: 'q-tab__icon',
        name: props.icon
      })
    )

    props.label !== void 0 && content.push(
      h('div', { class: 'q-tab__label' }, props.label)
    )

    props.alert !== false && content.push(
      props.alertIcon !== void 0
        ? h(QIcon, {
            class: 'q-tab__alert-icon',
            color: props.alert !== true
              ? props.alert
              : void 0,
            name: props.alertIcon
          })
        : h('div', {
          class: 'q-tab__alert'
            + (props.alert !== true ? ` text-${ props.alert }` : '')
        })
    )

    narrow === true && content.push(indicator)

    const node = [
      h('div', { class: 'q-focus-helper', tabindex: -1, ref: blurTargetRef }),
      h('div', { class: innerClass.value }, hMergeSlot(slots.default, content))
    ]

    narrow === false && node.push(indicator)

    return node
  }

  const tabData = {
    name: computed(() => props.name),
    rootRef,
    tabIndicatorRef,
    routerProps
  }

  onBeforeUnmount(() => {
    $tabs.unregisterTab(tabData)
    $tabs.recalculateScroll()
  })

  onMounted(() => {
    $tabs.registerTab(tabData)
    $tabs.recalculateScroll()
  })

  function renderTab (tag, customData) {
    const data = {
      ref: rootRef,
      class: classes.value,
      tabindex: tabIndex.value,
      role: 'tab',
      'aria-selected': isActive.value === true ? 'true' : 'false',
      'aria-disabled': props.disable === true ? 'true' : void 0,
      onClick,
      onKeydown,
      ...customData
    }

    return withDirectives(
      h(tag, data, getContent()),
      [ [ Ripple, ripple.value ] ]
    )
  }

  return { renderTab, $tabs }
}
