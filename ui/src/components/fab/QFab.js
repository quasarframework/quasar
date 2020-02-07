import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'

import FabMixin from '../../mixins/fab.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'

import { slot, mergeSlot } from '../../utils/slot.js'
import { cache } from '../../utils/vm.js'

const alignValues = [ 'left', 'center', 'right' ]
const directions = ['up', 'right', 'down', 'left']

export default Vue.extend({
  name: 'QFab',

  mixins: [ FabMixin, ModelToggleMixin ],

  provide () {
    return {
      __qFabClose: evt => {
        this.hide(evt)

        if (this.$refs.trigger && this.$refs.trigger.$el) {
          this.$refs.trigger.$el.focus()
        }
      }
    }
  },

  props: {
    icon: String,
    activeIcon: String,

    direction: {
      type: String,
      default: 'right',
      validator: v => directions.includes(v)
    },

    persistent: Boolean,

    actionsVerticalAlign: {
      type: String,
      default: 'center',
      validator: v => alignValues.includes(v)
    }
  },

  data () {
    return {
      showing: this.value === true
    }
  },

  computed: {
    hideOnRouteChange () {
      return this.persistent !== true
    },

    classes () {
      return `q-fab--align-${this.actionsVerticalAlign}` +
        (this.showing === true ? ' q-fab--opened' : '')
    }
  },

  render (h) {
    const child = [
      h('div', { staticClass: 'q-fab__icon-holder' }, [
        h(QIcon, {
          staticClass: 'q-fab__icon absolute-full',
          props: { name: this.icon || this.$q.iconSet.fab.icon }
        }),
        h(QIcon, {
          staticClass: 'q-fab__active-icon absolute-full',
          props: { name: this.activeIcon || this.$q.iconSet.fab.activeIcon }
        })
      ])
    ]

    this.label !== '' && this.__injectLabel(h, child)

    return h('div', {
      staticClass: 'q-fab z-fab row inline justify-center',
      class: this.classes,
      on: this.$listeners
    }, [
      h('div', {
        staticClass: 'q-fab__actions flex no-wrap inline',
        class: `q-fab__actions--${this.direction}`
      }, slot(this, 'default')),

      h(QBtn, {
        ref: 'trigger',
        props: {
          ...this.$props,
          noWrap: true,
          align: void 0,
          icon: void 0,
          label: void 0,
          fab: true
        },
        on: cache(this, 'tog', {
          click: this.toggle
        })
      }, mergeSlot(child, this, 'tooltip'))
    ])
  }
})
