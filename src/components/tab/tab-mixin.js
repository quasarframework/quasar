import uid from '../../utils/uid'
import { QIcon } from '../icon'
import { QChip } from '../chip'
import Ripple from '../../directives/ripple'

export default {
  directives: {
    Ripple
  },
  props: {
    label: String,
    icon: String,
    disable: Boolean,
    hidden: Boolean,
    hide: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default () {
        return uid()
      }
    },
    alert: Boolean,
    count: [Number, String],
    color: String
  },
  inject: {
    data: {
      default () {
        console.error('QTab/QRouteTab components need to be child of QTabs')
      }
    },
    selectTab: {}
  },
  watch: {
    active (val) {
      if (val) {
        this.$emit('select', this.name)
      }
    }
  },
  computed: {
    active () {
      return this.data.tabName === this.name
    },
    classes () {
      const cls = {
        active: this.active,
        hidden: this.hidden,
        disabled: this.disable,
        'icon-and-label': this.icon && this.label,
        'hide-icon': this.hide === 'icon',
        'hide-label': this.hide === 'label'
      }

      const color = this.data.inverted
        ? this.color || this.data.color
        : this.color

      if (color) {
        cls[`text-${color}`] = __THEME__ === 'ios' ? this.active : true
      }

      return cls
    },
    barStyle () {
      if (!this.active || !this.data.highlight) {
        return 'display: none;'
      }
    }
  },
  methods: {
    __getTabContent (h) {
      const child = []

      this.icon && child.push(h(QIcon, {
        staticClass: 'q-tab-icon',
        props: {
          name: this.icon
        }
      }))

      this.label && child.push(h('span', {
        staticClass: 'q-tab-label',
        domProps: {
          innerHTML: this.label
        }
      }))

      if (this.count) {
        child.push(h(QChip, {
          props: {
            floating: true
          }
        }, [ this.count ]))
      }
      else if (this.alert) {
        child.push(h('div', {
          staticClass: 'q-dot'
        }))
      }

      child.push(this.$slots.default)
      if (__THEME__ !== 'ios') {
        child.push(h('div', {
          staticClass: 'q-tabs-bar',
          style: this.barStyle
        }))
      }

      return child
    }
  }
}
