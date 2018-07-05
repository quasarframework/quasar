import { RouterLinkMixin, routerLinkEvent, routerLinkEventName } from '../../utils/router-link.js'
import TabMixin from './tab-mixin.js'

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
  mounted () {
    this.checkIfSelected()
  },
  render (h) {
    return h('router-link', {
      props: {
        tag: 'a',
        to: this.to,
        exact: this.exact,
        append: this.append,
        replace: this.replace,
        event: routerLinkEventName,
        activeClass: 'q-router-link-active',
        exactActiveClass: 'q-router-link-exact-active'
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
      directives: process.env.THEME === 'mat'
        ? [{ name: 'ripple' }]
        : null
    }, this.__getTabContent(h))
  }
}
