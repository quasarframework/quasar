import { RouterLinkMixin, routerLinkEvent, routerLinkEventName } from '../../mixins/router-link.js'
import TabMixin from './tab-mixin.js'

export default {
  name: 'QRouteTab',
  mixins: [ TabMixin, RouterLinkMixin ],
  inject: {
    selectTabRouter: {}
  },
  watch: {
    $route () {
      this.checkIfSelected()
    }
  },
  methods: {
    select () {
      this.$emit('click', this.name)
      if (!this.disable) {
        this.$el.dispatchEvent(routerLinkEvent)
        this.selectTabRouter({ value: this.name, selected: true })
      }
    },
    checkIfSelected () {
      this.$nextTick(() => {
        if (this.isExactActiveRoute(this.$el)) {
          this.selectTabRouter({ value: this.name, selectable: true, exact: true })
        }
        else if (this.isActiveRoute(this.$el)) {
          const path = this.$router.resolve(this.to, undefined, this.append)
          this.selectTabRouter({ value: this.name, selectable: true, priority: path.href.length })
        }
        else if (this.active) {
          this.selectTabRouter({ value: null })
        }
      })
    }
  },
  mounted () {
    this.checkIfSelected()
  },
  render (h) {
    return h('router-link', {
      props: {
        tag: 'a',
        event: routerLinkEventName,
        ...this.routerLinkProps
      },
      attrs: {
        tabindex: -1
      },
      nativeOn: {
        click: this.select,
        keyup: e => e.keyCode === 13 && this.select(e)
      },
      staticClass: 'q-link q-tab column flex-center relative-position',
      'class': this.classes,
      directives: [{ name: 'ripple' }]
    }, this.__getTabContent(h))
  }
}
