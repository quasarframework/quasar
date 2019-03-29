import Vue from 'vue'

import uid from '../../utils/uid.js'
import QIcon from '../icon/QIcon.js'
import RippleMixin from '../../mixins/ripple.js'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QTab',

  mixins: [ RippleMixin ],

  inject: {
    tabs: {
      default () {
        console.error('QTab/QRouteTab components need to be child of QTabsBar')
      }
    },
    __activateTab: {}
  },

  props: {
    icon: String,
    label: [Number, String],

    alert: [Boolean, String],

    name: {
      type: [Number, String],
      default: () => uid()
    },

    noCaps: Boolean,

    tabindex: String,
    disable: Boolean
  },

  computed: {
    isActive () {
      return this.tabs.current === this.name
    },

    classes () {
      return {
        [`q-tab--${this.isActive ? '' : 'in'}active`]: true,
        [`text-${this.tabs.activeColor}`]: this.isActive && this.tabs.activeColor,
        [`bg-${this.tabs.activeBgColor}`]: this.isActive && this.tabs.activeBgColor,
        'q-tab--full': this.icon && this.label && !this.tabs.inlineLabel,
        'q-tab--no-caps': this.noCaps === true || this.tabs.noCaps === true,
        'q-focusable q-hoverable cursor-pointer': !this.disable,
        disabled: this.disable
      }
    },

    computedTabIndex () {
      return this.disable === true || this.isActive === true ? -1 : this.tabindex || 0
    }
  },

  methods: {
    activate (e, keyboard) {
      if (this.disable !== true) {
        this.$listeners.click !== void 0 && this.$emit('click', e)
        this.__activateTab(this.name)
      }

      keyboard !== true && this.$refs.blurTarget !== void 0 && this.$refs.blurTarget.focus()
    },

    __onKeyup (e) {
      e.keyCode === 13 && this.activate(e, true)
    },

    __getContent (h) {
      const
        narrow = this.tabs.narrowIndicator,
        content = [],
        indicator = h('div', {
          staticClass: 'q-tab__indicator',
          class: this.tabs.indicatorClass
        })

      this.icon !== void 0 && content.push(h(QIcon, {
        staticClass: 'q-tab__icon',
        props: { name: this.icon }
      }))

      this.label !== void 0 && content.push(h('div', {
        staticClass: 'q-tab__label'
      }, [ this.label ]))

      this.alert !== false && content.push(h('div', {
        staticClass: 'q-tab__alert',
        class: this.alert !== true ? `text-${this.alert}` : null
      }))

      narrow && content.push(indicator)

      const node = [
        h('div', { staticClass: 'q-focus-helper', attrs: { tabindex: -1 }, ref: 'blurTarget' }),

        h('div', {
          staticClass: 'q-tab__content flex-center relative-position no-pointer-events non-selectable',
          class: this.tabs.inlineLabel === true ? 'row no-wrap q-tab__content--inline' : 'column'
        }, content.concat(slot(this, 'default')))
      ]

      !narrow && node.push(indicator)

      return node
    },

    __render (h, tag, props) {
      const data = {
        staticClass: 'q-tab relative-position self-stretch flex justify-center text-center',
        class: this.classes,
        attrs: {
          tabindex: this.computedTabIndex,
          role: 'tab',
          'aria-selected': this.isActive
        },
        directives: this.ripple !== false && this.disable === true ? null : [
          { name: 'ripple', value: this.ripple }
        ],
        [tag === 'div' ? 'on' : 'nativeOn']: {
          ...this.$listeners,
          click: this.activate,
          keyup: this.__onKeyup
        }
      }

      if (props !== void 0) {
        data.props = props
      }

      return h(tag, data, this.__getContent(h))
    }
  },

  render (h) {
    return this.__render(h, 'div')
  }
})
