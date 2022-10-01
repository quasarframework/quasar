import Vue from 'vue'

import QIcon from '../icon/QIcon.js'

import RippleMixin from '../../mixins/ripple.js'
import ListenersMixin from '../../mixins/listeners.js'

import { stop, stopAndPrevent } from '../../utils/event.js'
import { mergeSlot } from '../../utils/private/slot.js'
import { isKeyCode, shouldIgnoreKey } from '../../utils/private/key-composition.js'
import uid from '../../utils/uid.js'
import { isDeepEqual } from '../../utils/is.js'

let id = 0

export default Vue.extend({
  name: 'QTab',

  mixins: [ RippleMixin, ListenersMixin ],

  inject: {
    $tabs: {
      default () {
        console.error('QTab/QRouteTab components need to be child of QTabs')
      }
    }
  },

  props: {
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

    contentClass: String
  },

  computed: {
    isActive () {
      return this.$tabs.currentModel === this.name
    },

    classes () {
      return 'q-tab relative-position self-stretch flex flex-center text-center' +
        (
          this.isActive === true
            ? (
              ' q-tab--active' +
                (this.$tabs.tabProps.activeClass ? ' ' + this.$tabs.tabProps.activeClass : '') +
                (this.$tabs.tabProps.activeColor ? ` text-${this.$tabs.tabProps.activeColor}` : '') +
                (this.$tabs.tabProps.activeBgColor ? ` bg-${this.$tabs.tabProps.activeBgColor}` : '')
            )
            : ' q-tab--inactive'
        ) +
        (this.icon && this.label && this.$tabs.tabProps.inlineLabel === false ? ' q-tab--full' : '') +
        (this.noCaps === true || this.$tabs.tabProps.noCaps === true ? ' q-tab--no-caps' : '') +
        (this.disable === true ? ' disabled' : ' q-focusable q-hoverable cursor-pointer') +
        (this.hasRouterLinkProps !== void 0 ? this.linkClass : '')
    },

    innerClass () {
      return 'q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable ' +
        (this.$tabs.tabProps.inlineLabel === true ? 'row no-wrap q-tab__content--inline' : 'column') +
        (this.contentClass !== void 0 ? ` ${this.contentClass}` : '')
    },

    computedTabIndex () {
      return (
        this.disable === true ||
        this.$tabs.hasFocus === true ||
        (this.isActive === false && this.$tabs.hasActiveTab === true)
      )
        ? -1
        : this.tabindex || 0
    },

    computedRipple () {
      return this.ripple === false
        ? false
        : Object.assign(
          { keyCodes: [13, 32], early: true },
          this.ripple === true ? {} : this.ripple
        )
    },

    onEvents () {
      return {
        input: stop,
        ...this.qListeners,
        click: this.__onClick,
        keydown: this.__onKeydown
      }
    },

    attrs () {
      const attrs = {
        ...this.linkAttrs,
        tabindex: this.computedTabIndex,
        role: 'tab',
        'aria-selected': this.isActive === true ? 'true' : 'false'
      }

      if (this.disable === true) {
        attrs['aria-disabled'] = 'true'
      }

      return attrs
    }
  },

  methods: {
    __onClick (e, keyboard) {
      if (keyboard !== true && this.$refs.blurTarget !== void 0) {
        this.$refs.blurTarget.focus({ preventScroll: true })
      }

      if (this.disable === true) {
        // we should hinder native navigation though
        this.hasRouterLink === true && stopAndPrevent(e)
        return
      }

      // do we have a QTab?
      if (this.hasRouterLinkProps === void 0) {
        this.$tabs.__updateModel({ name: this.name })
        this.qListeners.click !== void 0 && this.$emit('click', e)
        return
      }

      if (this.hasRouterLink === true) {
        const go = (first, second, third) => {
          // for backwards compatibility
          const { to, replace, append, returnRouterError } = e.navigate === false
            ? { to: first, replace: second, append: third }
            : (first || {})

          // if requiring to go to another route, then we
          // let the QTabs route watcher do its job,
          // otherwise directly select this
          let hardError
          const reqId = to === void 0 || (append === this.append && isDeepEqual(to, this.to) === true)
            ? (this.$tabs.avoidRouteWatcher = uid())
            : null

          return this.__navigateToRouterLink(e, { to, replace, append, returnRouterError: true })
            .catch(err => { hardError = err })
            .then(result => {
              if (reqId === this.$tabs.avoidRouteWatcher) {
                this.$tabs.avoidRouteWatcher = false

                // if we don't have any hard errors, except for
                // when navigating to the same route (on all other errors,
                // like when navigation was aborted in a nav guard, we don't activate this tab)
                if (
                  hardError === void 0 ||
                  hardError.message.startsWith('Avoided redundant navigation') === true
                ) {
                  this.$tabs.__updateModel({ name: this.name })
                }
              }

              return hardError !== void 0 && returnRouterError === true
                ? Promise.reject(hardError)
                : result
            })
        }

        this.qListeners.click !== void 0 && this.$emit('click', e, go)

        // for backwards compatibility
        e.navigate === false && e.preventDefault()

        e.defaultPrevented !== true && go()

        return
      }

      this.qListeners.click !== void 0 && this.$emit('click', e)
    },

    __onKeydown (e) {
      if (isKeyCode(e, [ 13, 32 ])) {
        this.__onClick(e, true)
      }
      else if (
        shouldIgnoreKey(e) !== true &&
        e.keyCode >= 35 &&
        e.keyCode <= 40 &&
        e.altKey !== true &&
        e.metaKey !== true
      ) {
        this.$tabs.__onKbdNavigate(e.keyCode, this.$el) === true && stopAndPrevent(e)
      }

      this.qListeners.keydown !== void 0 && this.$emit('keydown', e)
    },

    __getContent (h) {
      const
        narrow = this.$tabs.tabProps.narrowIndicator,
        content = [],
        indicator = h('div', {
          ref: 'tabIndicator',
          staticClass: 'q-tab__indicator',
          class: this.$tabs.tabProps.indicatorClass
        })

      this.icon !== void 0 && content.push(
        h(QIcon, {
          staticClass: 'q-tab__icon',
          props: { name: this.icon }
        })
      )

      this.label !== void 0 && content.push(
        h('div', {
          staticClass: 'q-tab__label'
        }, [ this.label ])
      )

      this.alert !== false && content.push(
        this.alertIcon !== void 0
          ? h(QIcon, {
            staticClass: 'q-tab__alert-icon',
            props: {
              color: this.alert !== true
                ? this.alert
                : void 0,
              name: this.alertIcon
            }
          })
          : h('div', {
            staticClass: 'q-tab__alert',
            class: this.alert !== true
              ? `text-${this.alert}`
              : null
          })
      )

      narrow === true && content.push(indicator)

      const node = [
        h('div', { staticClass: 'q-focus-helper', attrs: { tabindex: -1 }, ref: 'blurTarget' }),
        h('div', { class: this.innerClass }, mergeSlot(content, this, 'default'))
      ]

      narrow === false && node.push(indicator)

      return node
    },

    __renderTab (h, tag) {
      const data = {
        class: this.classes,
        attrs: this.attrs,
        on: this.onEvents,
        directives: this.ripple === false || this.disable === true ? null : [
          { name: 'ripple', value: this.computedRipple }
        ]
      }

      return h(tag, data, this.__getContent(h))
    }
  },

  mounted () {
    this.$tabs.__registerTab(this)
  },

  beforeDestroy () {
    this.$tabs.__unregisterTab(this)
  },

  render (h) {
    return this.__renderTab(h, 'div')
  }
})
