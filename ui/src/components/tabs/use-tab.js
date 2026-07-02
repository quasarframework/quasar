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

export const useTabEmits = [
  /**
   * Internal click event used by tab navigation
   *
   * @api event click
   * @internal
   */
  'click',

  /**
   * Internal keyboard event used by tab navigation
   *
   * @api event keydown
   * @internal
   */
  'keydown'
]

export const useTabProps = {
  /**
   * Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix
   *
   * @api prop icon
   * @extends icon
   */
  icon: String,

  /**
   * A number or string to label the tab
   *
   * @api prop label
   * @type {Number|String}
   * @category content
   * @example 'Home'
   */
  label: [Number, String],

  /**
   * Adds an alert symbol to the tab, notifying the user there are some updates; If its value is not a Boolean, then you can specify a color
   *
   * @api prop alert
   * @type {Boolean|String}
   * @category content
   * @example 'purple'
   */
  alert: [Boolean, String],

  /**
   * Adds a floating icon to the tab, notifying the user there are some updates; It's displayed only if 'alert' is set; Can use the color specified by 'alert' prop
   *
   * @api prop alert-icon
   * @type {String}
   * @category content
   * @example 'alarm_on'
   */
  alertIcon: String,

  /**
   * Panel name
   *
   * @api prop name
   * @type {Number|String}
   * @default # a random UUID
   * @category general
   * @example 'home'
   * @example 1
   */
  name: {
    type: [Number, String],
    default: () => `t_${id++}`
  },

  /**
   * Turns off capitalizing all letters within the tab (which is the default)
   *
   * @api prop no-caps
   * @type {Boolean}
   * @category content
   */
  noCaps: Boolean,

  /**
   * Tabindex HTML attribute value
   *
   * @api prop tabindex
   * @extends tabindex
   */
  tabindex: [String, Number],

  /**
   * Put component in disabled mode
   *
   * @api prop disable
   * @extends disable
   */
  disable: Boolean,

  /**
   * Class definitions to be attributed to the content wrapper
   *
   * @api prop content-class
   * @type {String}
   * @category style
   * @example 'my-special-class'
   */
  contentClass: String,

  /**
   * Configure material ripple or disable it
   *
   * @api prop ripple
   * @extends ripple
   */
  ripple: {
    type: [Boolean, Object],
    default: true
  }
}

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

  const ripple = computed(() =>
    props.disable || props.ripple === false
      ? false
      : {
          keyCodes: [13, 32],
          early: true,
          ...(props.ripple === true ? {} : props.ripple)
        }
  )

  const isActive = computed(() => $tabs.currentModel.value === props.name)

  const classes = computed(
    () =>
      'q-tab relative-position self-stretch flex flex-center text-center' +
      (isActive.value
        ? ' q-tab--active' +
          ($tabs.tabProps.value.activeClass
            ? ' ' + $tabs.tabProps.value.activeClass
            : '') +
          ($tabs.tabProps.value.activeColor
            ? ` text-${$tabs.tabProps.value.activeColor}`
            : '') +
          ($tabs.tabProps.value.activeBgColor
            ? ` bg-${$tabs.tabProps.value.activeBgColor}`
            : '')
        : ' q-tab--inactive') +
      (props.icon && props.label && !$tabs.tabProps.value.inlineLabel
        ? ' q-tab--full'
        : '') +
      (props.noCaps || $tabs.tabProps.value.noCaps ? ' q-tab--no-caps' : '') +
      (props.disable
        ? ' disabled'
        : ' q-focusable q-hoverable cursor-pointer') +
      (routeData !== void 0 ? routeData.linkClass.value : '')
  )

  const innerClass = computed(
    () =>
      'q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable ' +
      ($tabs.tabProps.value.inlineLabel
        ? 'row no-wrap q-tab__content--inline'
        : 'column') +
      (props.contentClass !== void 0 ? ` ${props.contentClass}` : '')
  )

  const tabIndex = computed(() =>
    props.disable ||
    $tabs.hasFocus.value ||
    (!isActive.value && $tabs.hasActiveTab.value)
      ? -1
      : props.tabindex || 0
  )

  function onClick(e, keyboard) {
    if (!keyboard && !e?.qAvoidFocus) {
      blurTargetRef.value?.focus()
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
    const narrow = $tabs.tabProps.value.narrowIndicator,
      content = [],
      indicator = h('div', {
        ref: tabIndicatorRef,
        class: ['q-tab__indicator', $tabs.tabProps.value.indicatorClass]
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
      h('div', { class: innerClass.value }, hMergeSlot(slots.default, content))
    ]

    if (!narrow) node.push(indicator)

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

  function renderTab(tag, customData) {
    const data = {
      ref: rootRef,
      class: classes.value,
      tabindex: tabIndex.value,
      role: 'tab',
      'aria-selected': isActive.value ? 'true' : 'false',
      'aria-disabled': props.disable ? 'true' : void 0,
      onClick,
      onKeydown,
      ...customData
    }

    return withDirectives(h(tag, data, getContent()), [[Ripple, ripple.value]])
  }

  return { renderTab, $tabs }
}
