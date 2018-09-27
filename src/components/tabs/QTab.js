import Vue from 'vue'

import uid from '../../utils/uid.js'
import QIcon from '../icon/QIcon.js'
import Ripple from '../../directives/ripple.js'

export default Vue.extend({
  name: 'QTab',

  directives: {
    Ripple
  },

  inject: {
    tabs: {
      default () {
        console.error('QTab/QRouteTab components need to be child of QTabs')
      }
    },
    activateTab: {}
  },

  props: {
    icon: String,
    label: String,

    name: {
      type: String,
      default: () => uid()
    },

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
        'q-tab--full': this.icon && this.label && !this.tabs.inlineLabel,
        'q-tab--no-caps': this.tabs.noCaps,
        'q-focusable q-hoverable cursor-pointer': !this.disable,
        disabled: this.disable
      }
    },

    computedTabIndex () {
      return this.disable || this.isActive ? -1 : this.tabindex || 0
    }
  },

  methods: {
    activate () {
      this.activateTab(this.name)
      this.$el.blur()
    },

    __onKeyup (e) {
      e.keyCode === 13 && this.activate()
    },

    __getContent (h) {
      const
        narrow = this.tabs.narrowIndicator,
        content = [],
        indicator = h('div', {
          staticClass: 'q-tab__indicator absolute-bottom',
          'class': this.tabs.indicatorClass
        })

      this.icon && content.push(h(QIcon, {
        staticClass: 'q-tab__icon',
        props: { name: this.icon }
      }))

      this.label && content.push(h('div', {
        staticClass: 'q-tab__label'
      }, [ this.label ]))

      narrow && content.push(indicator)

      const node = [
        h('div', { staticClass: 'q-focus-helper' }),

        h('div', {
          staticClass: 'q-tab__content flex-center relative-position no-pointer-events',
          'class': this.tabs.inlineLabel ? 'row no-wrap q-tab__content--inline' : 'column'
        }, content)
      ]

      !narrow && node.push(indicator)

      return node.concat(this.$slots.default)
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-tab relative-position self-stretch flex nowrap justify-center text-center generic-transition',
      'class': this.classes,
      attrs: {
        tabindex: this.computedTabIndex,
        role: 'tab',
        'aria-selected': this.isActive
      },
      directives: this.disable ? null : [
        { name: 'ripple' }
      ],
      on: {
        click: this.activate,
        keyup: this.__onKeyup
      }
    }, this.__getContent(h))
  }
})
