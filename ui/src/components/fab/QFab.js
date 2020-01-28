import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'
import FabMixin from './fab-mixin.js'
import ModelToggleMixin from '../../mixins/model-toggle.js'
import { slot } from '../../utils/slot.js'
import { cache } from '../../utils/vm.js'

const alignValues = [ 'left', 'center', 'right' ]

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
    persistent: Boolean,

    align: {
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
      return 'q-fab--align-' + this.align +
        (this.showing === true ? ' q-fab--opened' : '')
    }
  },

  render (h) {
    const children = [
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

    this.label !== '' && children[this.leftLabel === true ? 'unshift' : 'push'](h('div', {
      staticClass: 'q-fab__label q-fab__label--' +
        (this.extended === true ? 'extended' : 'collapsed')
    }, [ this.label ]))

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
      }, slot(this, 'tooltip', []).concat(children))
    ])
  }
})
