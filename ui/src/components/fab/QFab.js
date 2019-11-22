import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'
import FabMixin from './fab-mixin.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import { slot } from '../../utils/slot.js'
import { cache } from '../../utils/vm.js'

export default Vue.extend({
  name: 'QFab',

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

  data () {
    return {
      showing: this.value === true
    }
  },

  computed: {
    hideOnRouteChange () {
      return this.persistent !== true
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-fab z-fab row inline justify-center',
      class: this.showing === true ? 'q-fab--opened' : null,
      on: this.$listeners
    }, [
      h(QBtn, {
        ref: 'trigger',
        props: {
          ...this.$props,
          icon: void 0,
          fab: true
        },
        on: cache(this, 'tog', {
          click: this.toggle
        })
      }, slot(this, 'tooltip', []).concat([
        h(QIcon, {
          staticClass: 'q-fab__icon absolute-full',
          props: { name: this.icon || this.$q.iconSet.fab.icon }
        }),
        h(QIcon, {
          staticClass: 'q-fab__active-icon absolute-full',
          props: { name: this.activeIcon || this.$q.iconSet.fab.activeIcon }
        })
      ])),

      h('div', {
        staticClass: 'q-fab__actions flex no-wrap inline items-center',
        class: `q-fab__actions--${this.direction}`
      }, slot(this, 'default'))
    ])
  }
})
