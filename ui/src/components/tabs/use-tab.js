import {
  computed,
  getCurrentInstance,
  h,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  withDirectives
} from 'vue'

import QIcon from '../icon/QIcon.js'

import Ripple from '../../directives/ripple/Ripple.js'

import { hMergeSlot } from '../../utils/private.render/render.js'
import {
  isKeyCode,
  shouldIgnoreKey
} from '../../utils/private.keyboard/key-composition.js'
import { emptyRenderFn, tabsKey } from '../../utils/private.symbols/symbols.js'
import { stopAndPrevent } from '../../utils/event/event.js'
import uid from '../../utils/uid/uid.js'
import { isDeepEqual } from '../../utils/is/is.js'

let id = 0

export const useTabEmits = ['click', 'keydown']

export const useTabProps = {
  icon: String,
  label: [Number, String],

  alert: [Boolean, String],
  alertIcon: String,

  name: {
    type: [Number, String],
    default: () => `t_${id++}`
  },

  noCaps: Boolean,

  tabindex: [String, Number],
  disable: Boolean,

  contentClass: String,

  ripple: {
    type: [Boolean, Object],
    default: true
  }
}

const rippleKeyCodes = [13, 32]

export default function useTab(props, slots, emit, routeData) {
  const $tabs = inject(tabsKey, emptyRenderFn)
  if ($tabs === emptyRenderFn) {
    console.error('QTab/QRouteTab component needs to be child of QTabs')
    return emptyRenderFn
  }

  const { proxy } = getCurrentInstance()

  const blurTargetRef = ref(null)
  const rootRef = ref(null)
  const tabIndicatorRef = ref(null)

  function getRipple() {
    return props.disable || props.ripple === false
      ? false
      : {
          keyCodes: rippleKeyCodes,
          early: true,
          ...(props.ripple === true ? {} : props.ripple)
        }
  }

  function getClasses(isActive) {
    const tabProps = $tabs.tabProps.value

    return (
      'q-tab relative-position self-stretch flex flex-center text-center' +
      (isActive
        ? ' q-tab--active' +
          (tabProps.activeClass ? ' ' + tabProps.activeClass : '') +
          (tabProps.activeColor ? ` text-${tabProps.activeColor}` : '') +
          (tabProps.activeBgColor ? ` bg-${tabProps.activeBgColor}` : '')
        : ' q-tab--inactive') +
      (props.icon && props.label && !tabProps.inlineLabel
        ? ' q-tab--full'
        : '') +
      (props.noCaps || tabProps.noCaps ? ' q-tab--no-caps' : '') +
      (props.disable
        ? ' disabled'
        : ' q-focusable q-hoverable cursor-pointer') +
      (routeData !== void 0 ? routeData.linkClass.value : '')
    )
  }

  function getInnerClass() {
    return (
      'q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable ' +
      ($tabs.tabProps.value.inlineLabel
        ? 'row no-wrap q-tab__content--inline'
        : 'column') +
      (props.contentClass !== void 0 ? ` ${props.contentClass}` : '')
    )
  }

  // computeds on purpose: these two are the only reads of $tabs state that
  // changes while a tab is alive, so an unchanged value here is what keeps
  // a model switch from re-rendering every tab instead of the two involved
  const isActive = computed(() => $tabs.currentModel.value === props.name)

  const tabIndex = computed(() => {
    if (props.disable || $tabs.hasFocus.value) return -1

    const tabStop = $tabs.tabStopName.value
    return tabStop === null || tabStop === props.name ? props.tabindex || 0 : -1
  })

  function onClick(e, keyboard) {
    if (!keyboard && !e?.qAvoidFocus) {
      blurTargetRef.value?.focus({ preventScroll: true })
    }

    if (props.disable) {
      // we should hinder native navigation though
      if (routeData?.hasRouterLink.value === true) stopAndPrevent(e)
      return
    }

    // do we have a QTab?
    if (routeData === void 0) {
      $tabs.updateModel({ name: props.name })
      emit('click', e)
      return
    }

    if (routeData.hasRouterLink.value) {
      const go = (opts = {}) => {
        // if requiring to go to another route, then we
        // let the QTabs route watcher do its job,
        // otherwise directly select this
        let hardError
        const reqId =
          opts.to === void 0 || isDeepEqual(opts.to, props.to)
            ? ($tabs.avoidRouteWatcher = uid())
            : null

        return routeData
          .navigateToRouterLink(e, { ...opts, returnRouterError: true })
          .catch(err => {
            hardError = err
          })
          .then(softError => {
            if (reqId === $tabs.avoidRouteWatcher) {
              $tabs.avoidRouteWatcher = false

              // if we don't have any hard errors or any soft errors, except for
              // when navigating to the same route (on all other soft errors,
              // like when navigation was aborted in a nav guard, we don't activate this tab)
              if (
                hardError === void 0 &&
                (softError === void 0 ||
                  softError.message?.startsWith(
                    'Avoided redundant navigation'
                  ) === true)
              ) {
                $tabs.updateModel({ name: props.name })
              }
            }

            if (opts.returnRouterError) {
              return hardError !== void 0
                ? Promise.reject(hardError)
                : softError
            }
          })
      }

      emit('click', e, go)
      if (!e.defaultPrevented) go()

      return
    }

    emit('click', e)
  }

  function onKeydown(e) {
    if (isKeyCode(e, [13, 32])) {
      onClick(e, true)
    } else if (
      !shouldIgnoreKey(e) &&
      e.keyCode >= 35 &&
      e.keyCode <= 40 &&
      !e.altKey &&
      !e.metaKey &&
      $tabs.onKbdNavigate(e.keyCode, proxy.$el)
    ) {
      stopAndPrevent(e)
    }

    emit('keydown', e)
  }

  function getContent() {
    const tabProps = $tabs.tabProps.value,
      narrow = tabProps.narrowIndicator,
      content = [],
      indicator = h('div', {
        ref: tabIndicatorRef,
        class: ['q-tab__indicator', tabProps.indicatorClass]
      })

    if (props.icon !== void 0) {
      content.push(
        h(QIcon, {
          class: 'q-tab__icon',
          name: props.icon
        })
      )
    }

    if (props.label !== void 0) {
      content.push(h('div', { class: 'q-tab__label' }, props.label))
    }

    if (props.alert) {
      content.push(
        props.alertIcon !== void 0
          ? h(QIcon, {
              class: 'q-tab__alert-icon',
              color: props.alert !== true ? props.alert : void 0,
              name: props.alertIcon
            })
          : h('div', {
              class:
                'q-tab__alert' +
                (props.alert !== true ? ` text-${props.alert}` : '')
            })
      )
    }

    if (narrow) content.push(indicator)

    const node = [
      h('div', { class: 'q-focus-helper', tabindex: -1, ref: blurTargetRef }),
      h('div', { class: getInnerClass() }, hMergeSlot(slots.default, content))
    ]

    if (!narrow) node.push(indicator)

    return node
  }

  const tabData = {
    name: computed(() => props.name),
    disable: computed(() => props.disable),
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

  function renderTab(tag, customData) {
    const data = {
      ref: rootRef,
      class: getClasses(isActive.value),
      tabindex: tabIndex.value,
      role: 'tab',
      'aria-selected': isActive.value ? 'true' : 'false',
      'aria-disabled': props.disable ? 'true' : void 0,
      onClick,
      onKeydown,
      ...customData
    }

    return withDirectives(h(tag, data, getContent()), [[Ripple, getRipple()]])
  }

  return { renderTab, $tabs }
}
