import { RouterLinkMixin, routerLinkEvent, routerLinkEventName } from '../../utils/router-link'
import TabMixin from './tab-mixin'

export default {
  name: 'QRouteTab',
  mixins: [TabMixin, RouterLinkMixin],
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
        if (this.$el.classList.contains('q-router-link-exact-active')) {
          this.selectTabRouter({ value: this.name, selectable: true, exact: true })
        }
        else if (this.$el.classList.contains('q-router-link-active')) {
          const path = this.$router.resolve(this.to, undefined, this.append)
          this.selectTabRouter({ value: this.name, selectable: true, priority: path.href.length })
        }
        else if (this.active) {
          this.selectTabRouter({ value: null })
        }
      })
    }
  },
  created () {
    this.checkIfSelected()
  },
  render (h) {
    return h('router-link', {
      props: {
        tag: 'div',
        to: this.to,
        exact: this.exact,
        append: this.append,
        replace: this.replace,
        event: routerLinkEventName,
        activeClass: 'q-router-link-active',
        exactActiveClass: 'q-router-link-exact-active'
      },
      nativeOn: {
        click: this.select
      },
      staticClass: 'q-tab column flex-center relative-position',
      'class': this.classes,
      directives: __THEME__ === 'mat'
        ? [{ name: 'ripple' }]
        : null
    }, this.__getTabContent(h))
  }
}
