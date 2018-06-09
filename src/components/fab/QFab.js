import { QBtn } from '../btn'
import { QIcon } from '../icon'
import FabMixin from './fab-mixin'
import ModelToggleMixin from '../../mixins/model-toggle'

export default {
  name: 'QFab',
  mixins: [FabMixin, ModelToggleMixin],
  provide () {
    return {
      __qFabClose: evt => this.hide(evt).then(() => {
        this.$refs.trigger && this.$refs.trigger.$el && this.$refs.trigger.$el.focus()
        return evt
      })
    }
  },
  props: {
    icon: String,
    activeIcon: String,
    direction: {
      type: String,
      default: 'right'
    }
  },
  watch: {
    $route () {
      this.hide()
    }
  },
  created () {
    if (this.value) {
      this.show()
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-fab z-fab row inline justify-center',
      'class': {
        'q-fab-opened': this.showing
      }
    }, [
      h(QBtn, {
        ref: 'trigger',
        props: {
          fab: true,
          outline: this.outline,
          push: this.push,
          flat: this.flat,
          color: this.color,
          textColor: this.textColor,
          glossy: this.glossy
        },
        on: {
          click: this.toggle
        }
      }, [
        this.$slots.tooltip,
        h(QIcon, {
          staticClass: 'q-fab-icon absolute-full',
          props: { name: this.icon || this.$q.icon.fab.icon }
        }),
        h(QIcon, {
          staticClass: 'q-fab-active-icon absolute-full',
          props: { name: this.activeIcon || this.$q.icon.fab.activeIcon }
        })
      ]),

      h('div', {
        staticClass: 'q-fab-actions flex no-wrap inline items-center',
        'class': `q-fab-${this.direction}`
      }, this.showing ? this.$slots.default : null)
    ])
  }
}
