/*
 * Inspired by RouterLink from Vue Router
 *  --> API should match!
 */

import { prevent } from '../utils/event.js'

// Get the original path value of a record by following its aliasOf
function getOriginalPath (record) {
  return record
    ? (
      record.aliasOf
        ? record.aliasOf.path
        : record.path
    ) : ''
}

function isSameRouteRecord (a, b) {
  // since the original record has an undefined value for aliasOf
  // but all aliases point to the original record, this will always compare
  // the original record
  return (a.aliasOf || a) === (b.aliasOf || b)
}

function includesParams (outer, inner) {
  for (const key in inner) {
    const
      innerValue = inner[key],
      outerValue = outer[key]

    if (typeof innerValue === 'string') {
      if (innerValue !== outerValue) {
        return false
      }
    }
    else if (
      Array.isArray(outerValue) === false ||
      outerValue.length !== innerValue.length ||
      innerValue.some((value, i) => value !== outerValue[i])
    ) {
      return false
    }
  }

  return true
}

export const routerLinkProps = {
  to: [ String, Object ],
  replace: Boolean,
  exact: Boolean,
  activeClass: {
    type: String,
    default: 'q-router-link--active'
  },
  exactActiveClass: {
    type: String,
    default: 'q-router-link--exact-active'
  },
  disable: Boolean
}

export default {
  props: routerLinkProps,

  computed: {
    hasLink () {
      return this.disable !== true && this.to !== void 0 && this.to !== null && this.to !== ''
    },

    linkTag () {
      return this.hasLink === true
        ? 'a'
        : (this.$props.tag || 'div')
    },

    linkRoute () {
      return this.hasLink === true
        ? this.$router.resolve(this.to)
        : null
    },

    linkActiveIndex () {
      if (this.hasLink === false) {
        return null
      }

      const
        { matched } = this.linkRoute,
        { length } = matched,
        routeMatched = matched[length - 1]

      if (routeMatched === void 0) {
        return -1
      }

      const currentMatched = this.$route.matched

      if (currentMatched.length === 0) {
        return -1
      }

      const index = currentMatched.findIndex(
        isSameRouteRecord.bind(null, routeMatched)
      )

      if (index > -1) {
        return index
      }

      // possible parent record
      const parentRecordPath = getOriginalPath(matched[length - 2])

      return (
        // we are dealing with nested routes
        length > 1 &&
        // if the parent and matched route have the same path, this link is
        // referring to the empty child. Or we currently are on a different
        // child of the same parent
        getOriginalPath(routeMatched) === parentRecordPath &&
        // avoid comparing the child with its parent
        currentMatched[currentMatched.length - 1].path !== parentRecordPath
          ? currentMatched.findIndex(
            isSameRouteRecord.bind(null, matched[length - 2])
          )
          : index
      )
    },

    linkIsActive () {
      return this.hasLink === true &&
        this.linkActiveIndex > -1 &&
        includesParams(this.$route.params, this.linkRoute.params)
    },

    linkIsExactActive () {
      return this.linkIsActive === true &&
        this.linkActiveIndex === this.$route.matched.length - 1
    },

    linkClass () {
      return this.hasLink === true
        ? (
          this.linkIsExactActive === true
            ? ` ${this.exactActiveClass} ${this.activeClass}`
            : (
              this.exact === true
                ? ''
                : (this.linkIsActive === true ? ` ${this.activeClass}` : '')
            )
        )
        : ''
    },

    linkProps () {
      return this.hasLink === true
        ? {
          href: this.linkRoute.href,
          target: this.$attrs.target,
          role: 'link'
        }
        : {}
    }
  },

  methods: {
    // should match RouterLink from Vue Router
    navigateToLink (e) {
      if (
        // component is not disabled
        this.disable === true ||

        // don't redirect with control keys
        e.metaKey || e.altKey || e.ctrlKey || e.shiftKey ||

        // don't redirect when preventDefault called
        e.defaultPrevented ||

        // don't redirect on right click
        (e.button !== undefined && e.button !== 0) ||

        // don't redirect if it should open in a new window
        this.$attrs.target === '_blank'
      ) {
        return false
      }

      prevent(e)

      this.$router[this.replace === true ? 'replace' : 'push'](this.to)
        .catch(() => {})

      return true
    }
  }
}
