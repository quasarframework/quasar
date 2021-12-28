const routerLinkProps = {
  // router-link
  to: [String, Object],
  exact: Boolean,
  append: Boolean,
  replace: Boolean,
  activeClass: {
    type: String,
    default: 'q-router-link--active'
  },
  exactActiveClass: {
    type: String,
    default: 'q-router-link--exact-active'
  },

  // regular <a> link
  href: String,
  target: String,

  // state
  disable: Boolean
}

// external props: type, tag
// external: fallbackTag

export default {
  props: routerLinkProps,

  computed: {
    hasHrefLink () {
      return this.disable !== true && this.href !== void 0
    },

    hasRouterLinkProps () {
      return this.$router !== void 0 &&
        this.disable !== true &&
        this.hasHrefLink !== true &&
        this.to !== void 0 && this.to !== null && this.to !== ''
    },

    linkRoute () {
      if (this.hasRouterLinkProps === true) {
        // we protect from accessing this.$route without
        // actually needing it so that we won't trigger
        // unnecessary updates

        try {
          return this.append === true
            ? this.$router.resolve(this.to, this.$route, true)
            : this.$router.resolve(this.to)
        }
        catch (err) {}
      }

      return null
    },

    hasRouterLink () {
      return this.linkRoute !== null
    },

    hasLink () {
      return this.hasHrefLink === true || this.hasRouterLink === true
    },

    linkTag () {
      if (this.hasRouterLink === true) {
        return 'router-link'
      }

      return this.type === 'a' || this.hasLink === true
        ? 'a'
        : (this.tag || this.fallbackTag || 'div')
    },

    linkProps () {
      return this.hasHrefLink === true
        ? {
          attrs: {
            href: this.href,
            target: this.target
          }
        }
        : (
          this.hasRouterLink === true
            ? {
              props: {
                to: this.to,
                exact: this.exact,
                append: this.append,
                replace: this.replace,
                activeClass: this.activeClass,
                exactActiveClass: this.exactActiveClass
              },
              attrs: {
                href: this.linkRoute.href,
                target: this.target
              }
            }
            : {}
        )
    }
  }
}
