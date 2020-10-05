import { h, defineComponent } from 'vue'

import QIcon from '../icon/QIcon.js'

import RippleMixin from '../../mixins/ripple.js'
import EmitListenersMixin from '../../mixins/emit-listeners.js'

import Ripple from '../../directives/Ripple.js'

import { hMergeSlot, hDir } from '../../utils/render.js'
import { isKeyCode } from '../../utils/key-composition.js'

let uid = 0

export default defineComponent({
  name: 'QTab',

  mixins: [ RippleMixin, EmitListenersMixin ],

  inject: {
    __qTabs: {
      default () {
        console.error('QTab/QRouteTab components need to be child of QTabs')
      }
    }
  },

  props: {
    icon: String,
    label: [ Number, String ],

    alert: [ Boolean, String ],
    alertIcon: String,

    name: {
      type: [ Number, String ],
      default: () => `t_${uid++}`
    },

    noCaps: Boolean,

    tabindex: [ String, Number ],
    disable: Boolean,

    contentClass: String
  },

  emits: [ 'click' ],

  computed: {
    isActive () {
      return this.__qTabs.currentModel === this.name
    },

    classes () {
      return 'q-tab relative-position self-stretch flex flex-center text-center' +
        ` q-tab--${this.isActive === true ? '' : 'in'}active` +
        (
          this.isActive === true
            ? (
              (this.__qTabs.tabProps.activeColor ? ` text-${this.__qTabs.tabProps.activeColor}` : '') +
              (this.__qTabs.tabProps.activeBgColor ? ` bg-${this.__qTabs.tabProps.activeBgColor}` : '')
            )
            : ''
        ) +
        (this.icon && this.label && this.__qTabs.tabProps.inlineLabel === false ? ' q-tab--full' : '') +
        (this.noCaps === true || this.__qTabs.tabProps.noCaps === true ? ' q-tab--no-caps' : '') +
        (this.disable === true ? ' disabled' : ' q-focusable q-hoverable cursor-pointer')
    },

    innerClass () {
      return 'q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable ' +
        (this.__qTabs.tabProps.inlineLabel === true ? 'row no-wrap q-tab__content--inline' : 'column') +
        (this.contentClass !== void 0 ? ` ${this.contentClass}` : '')
    },

    computedTabIndex () {
      return this.disable === true || this.isActive === true ? -1 : this.tabindex || 0
    },

    attrs () {
      return this.disable === true
        ? { 'aria-disabled': 'true' }
        : {}
    }
  },

  methods: {
    __activate (e, keyboard) {
      keyboard !== true && this.$refs.blurTarget && this.$refs.blurTarget.focus()

      if (this.disable !== true) {
        this.emitListeners.onClick === true && this.$emit('click', e)
        this.__qTabs.__activateTab({ name: this.name })
      }
    },

    __onKeyup (e) {
      isKeyCode(e, 13) === true && this.__activate(e, true)
    },

    __getContent () {
      const
        narrow = this.__qTabs.tabProps.narrowIndicator,
        content = [],
        indicator = h('div', {
          class: [
            'q-tab__indicator',
            this.__qTabs.tabProps.indicatorClass
          ]
        })

      this.icon !== void 0 && content.push(
        h(QIcon, {
          class: 'q-tab__icon',
          name: this.icon
        })
      )

      this.label !== void 0 && content.push(
        h('div', { class: 'q-tab__label' }, this.label)
      )

      this.alert !== false && content.push(
        this.alertIcon !== void 0
          ? h(QIcon, {
            class: 'q-tab__alert-icon',
            color: this.alert !== true
              ? this.alert
              : void 0,
            name: this.alertIcon
          })
          : h('div', {
            class: 'q-tab__alert' +
              (this.alert !== true ? ` text-${this.alert}` : '')
          })
      )

      narrow === true && content.push(indicator)

      const node = [
        h('div', { class: 'q-focus-helper', tabindex: -1, ref: 'blurTarget' }),
        h('div', { class: this.innerClass }, hMergeSlot(content, this, 'default'))
      ]

      narrow === false && node.push(indicator)

      return node
    },

    __renderTab (tag, props, content) {
      const data = {
        class: this.classes,
        tabindex: this.computedTabIndex,
        role: 'tab',
        'aria-selected': this.isActive,
        ...this.attrs,
        onClick: this.__activate,
        onKeyup: this.__onKeyup,
        ...props
      }

      return hDir(
        tag,
        data,
        content,
        'main',
        this.ripple !== false && this.disable === false,
        () => [[ Ripple, this.ripple ]]
      )
    }
  },

  mounted () {
    this.__qTabs.__registerTab(this)
    this.__qTabs.__recalculateScroll()
  },

  beforeUnmount () {
    this.__qTabs.__unregisterTab(this)
    this.__qTabs.__recalculateScroll()
  },

  render () {
    return this.__renderTab(
      'div',
      { onClick: this.__activate },
      this.__getContent()
    )
  }
})
