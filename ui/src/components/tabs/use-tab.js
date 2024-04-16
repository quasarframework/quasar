import { h, ref, computed, inject, onBeforeUnmount, onMounted, withDirectives, getCurrentInstance } from 'vue'

import QIcon from '../icon/QIcon.js'

import Ripple from '../../directives/ripple/Ripple.js'

import { hMergeSlot } from '../../utils/private.render/render.js'
import { isKeyCode, shouldIgnoreKey } from '../../utils/private.keyboard/key-composition.js'
import { tabsKey, emptyRenderFn } from '../../utils/private.symbols/symbols.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import uid from '../../utils/uid/uid.js'
import { isDeepEqual } from '../../utils/is/is.js'

let id = 0

export const useTabEmits = [ 'click', 'keydown' ]

export const useTabProps = {
  icon: String,
  label: [ Number, String ],

  alert: [ Boolean, String ],
  alertIcon: String,

  name: {
    type: [ Number, String ],
    default: () => `t_${ id++ }`
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

export default function (props, slots, emit, routeData) {
  const $tabs = inject(tabsKey, emptyRenderFn)
  if ($tabs === emptyRenderFn) {
    console.error('QTab/QRouteTab component needs to be child of QTabs')
    return emptyRenderFn
  }

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
    + (routeData !== void 0 ? routeData.linkClass.value : '')
  )

  const innerClass = computed(() =>
    'q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable '
    + ($tabs.tabProps.value.inlineLabel === true ? 'row no-wrap q-tab__content--inline' : 'column')
    + (props.contentClass !== void 0 ? ` ${ props.contentClass }` : '')
  )

  const tabIndex = computed(() => (
    (
      props.disable === true
      || $tabs.hasFocus.value === true
      || (isActive.value === false && $tabs.hasActiveTab.value === true)
    )
      ? -1
      : props.tabindex || 0
  ))

  function onClick (e, keyboard) {
    if (keyboard !== true && blurTargetRef.value !== null) {
      blurTargetRef.value.focus()
    }

    if (props.disable === true) {
      // we should hinder native navigation though
      if (routeData !== void 0 && routeData.hasRouterLink.value === true) {
        stopAndPrevent(e)
      }
      return
    }

    // do we have a QTab?
    if (routeData === void 0) {
      $tabs.updateModel({ name: props.name })
      emit('click', e)
      return
    }

    if (routeData.hasRouterLink.value === true) {
      const go = (opts = {}) => {
        // if requiring to go to another route, then we
        // let the QTabs route watcher do its job,
        // otherwise directly select this
        let hardError
        const reqId = opts.to === void 0 || isDeepEqual(opts.to, props.to) === true
          ? ($tabs.avoidRouteWatcher = uid())
          : null

        return routeData.navigateToRouterLink(e, { ...opts, returnRouterError: true })
          .catch(err => { hardError = err })
          .then(softError => {
            if (reqId === $tabs.avoidRouteWatcher) {
              $tabs.avoidRouteWatcher = false

              // if we don't have any hard errors or any soft errors, except for
              // when navigating to the same route (on all other soft errors,
              // like when navigation was aborted in a nav guard, we don't activate this tab)
              if (
                hardError === void 0 && (
                  softError === void 0
                  || (softError.message !== void 0 && softError.message.startsWith('Avoided redundant navigation') === true)
                )
              ) {
                $tabs.updateModel({ name: props.name })
              }
            }

            if (opts.returnRouterError === true) {
              return hardError !== void 0 ? Promise.reject(hardError) : softError
            }
          })
      }

      emit('click', e, go)
      e.defaultPrevented !== true && go()

      return
    }

    emit('click', e)
  }

  function onKeydown (e) {
    if (isKeyCode(e, [ 13, 32 ])) {
      onClick(e, true)
    }
    else if (
      shouldIgnoreKey(e) !== true
      && e.keyCode >= 35
      && e.keyCode <= 40
      && e.altKey !== true
      && e.metaKey !== true
    ) {
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
    routeData
  }

  onBeforeUnmount(() => {
    $tabs.unregisterTab(tabData)
  })

  onMounted(() => {
    $tabs.registerTab(tabData)
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
