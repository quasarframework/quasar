import Vue from 'vue'

import uid from '../../utils/uid.js'
import QIcon from '../icon/QIcon.js'
import RippleMixin from '../../mixins/ripple.js'

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

    alert: Boolean,

    name: {
      type: [Number, String],
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
        [`bg-${this.tabs.activeBgColor}`]: this.isActive && this.tabs.activeBgColor,
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
    activate (e) {
      this.$emit('click', e)
      !this.disable && this.__activateTab(this.name)
      this.$el.blur()
    },

    __onKeyup (e) {
      e.keyCode === 13 && this.activate(e)
    },

    __getContent (h) {
      const
        narrow = this.tabs.narrowIndicator,
        content = [],
        indicator = h('div', {
          staticClass: 'q-tab__indicator',
          class: this.tabs.indicatorClass
        })

      this.icon && content.push(h(QIcon, {
        staticClass: 'q-tab__icon',
        props: { name: this.icon }
      }))

      this.label && content.push(h('div', {
        staticClass: 'q-tab__label'
      }, [ this.label ]))

      this.alert && content.push(h('div', {
        staticClass: 'q-tab__alert'
      }))

      narrow && content.push(indicator)

      const node = [
        h('div', { staticClass: 'q-focus-helper' }),

        h('div', {
          staticClass: 'q-tab__content flex-center relative-position no-pointer-events non-selectable',
          class: this.tabs.inlineLabel ? 'row no-wrap q-tab__content--inline' : 'column'
        }, content.concat(this.$slots.default))
      ]

      !narrow && node.push(indicator)

      return node
    },

    __render (h, tag, props) {
      const data = {
        staticClass: 'q-tab relative-position self-stretch flex nowrap justify-center text-center generic-transition',
        class: this.classes,
        attrs: {
          tabindex: this.computedTabIndex,
          role: 'tab',
          'aria-selected': this.isActive
        },
        directives: this.ripple !== false && this.disable ? null : [
          { name: 'ripple', value: this.ripple }
        ],
        [tag === 'div' ? 'on' : 'nativeOn']: {
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
