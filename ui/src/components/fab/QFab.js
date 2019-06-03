import Vue from 'vue'

import WBtn from '../btn/QBtn.js'
import WIcon from '../icon/QIcon.js'
import FabMixin from './fab-mixin.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'WFab',

  mixins: [ FabMixin, ModelToggleMixin ],

  provide () {
    return {
      __qFabClose: evt => {
        this.hide(evt)
        this.$refs.trigger && this.$refs.trigger.$el && this.$refs.trigger.$el.focus()
      }
    }
  },

  props: {
    icon: String,
    activeIcon: String,
    direction: {
      type: String,
      default: 'right',
      validator: v => ['up', 'right', 'down', 'left'].includes(v)
    },
    persistent: Boolean
  },

  watch: {
    $route () {
      this.persistent !== true && this.hide()
    }
  },

  render (h) {
    const tooltip = this.$scopedSlots.tooltip !== void 0
      ? this.$scopedSlots.tooltip()
      : []

    return h('div', {
      staticClass: 'q-fab z-fab row inline justify-center',
      class: this.showing === true ? 'q-fab--opened' : null,
      on: this.$listeners
    }, [
      h(WBtn, {
        ref: 'trigger',
        props: {
          ...this.$props,
          icon: void 0,
          fab: true
        },
        on: {
          click: this.toggle
        }
      }, tooltip.concat([
        h(WIcon, {
          staticClass: 'q-fab__icon absolute-full',
          props: { name: this.icon || this.$q.iconSet.fab.icon }
        }),
        h(WIcon, {
          staticClass: 'q-fab__active-icon absolute-full',
          props: { name: this.activeIcon || this.$q.iconSet.fab.activeIcon }
        })
      ])),

      h('div', {
        staticClass: 'q-fab__actions flex no-wrap inline items-center',
        class: `q-fab__actions--${this.direction}`
      }, slot(this, 'default'))
    ])
  },

  created () {
    if (this.value === true && this.disable !== true) {
      this.showing = true
    }
  }
})
