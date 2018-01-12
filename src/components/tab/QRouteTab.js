import { RouterLinkMixin, routerLinkEvent, routerLinkEventName } from '../../utils/router-link'
import TabMixin from './tab-mixin'

export default {
  name: 'q-route-tab',
  mixins: [TabMixin, RouterLinkMixin],
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
        this.selectTab(this.name)
      }
    },
    checkIfSelected () {
      this.$nextTick(() => {
        if (this.$el.classList.contains('router-link-active') || this.$el.classList.contains('router-link-exact-active')) {
          this.selectTab(this.name)
        }
        else if (this.active) {
          this.selectTab(null)
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
        replace: this.replace,
        append: this.append,
        event: routerLinkEventName
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
