export const routerLinkProps = {
  to: [ String, Object ],
  // TODO vue3 - exact, append not available anymore
  // exact: Boolean,
  // append: Boolean,
  replace: Boolean,
  activeClass: String,
  exactActiveClass: String,
  disable: Boolean
}

export const RouterLinkMixin = {
  props: routerLinkProps,

  computed: {
    hasRouterLink () {
      return this.disable !== true && this.to !== void 0 && this.to !== null && this.to !== ''
    },

    routerLinkProps () {
      return {
        to: this.to,
        activeClass: this.activeClass || 'q-router-link--active',
        exactActiveClass: this.exactActiveClass || 'q-router-link--exact-active'
        // TODO vue3 - RouterLink props
        // exact: this.exact,
        // replace: this.replace,
        // event: this.disable === true ? '' : void 0
      }
    }
  }
}
