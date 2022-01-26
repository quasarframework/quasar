/*
 * Inspired by RouterLink from Vue Router
 *  --> API should match!
 */

import { computed, getCurrentInstance } from 'vue'

import { prevent } from '../../utils/event.js'
import { vmHasRouter } from '../../utils/private/vm.js'

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
      innerValue = inner[ key ],
      outerValue = outer[ key ]

    if (typeof innerValue === 'string') {
      if (innerValue !== outerValue) {
        return false
      }
    }
    else if (
      Array.isArray(outerValue) === false
      || outerValue.length !== innerValue.length
      || innerValue.some((value, i) => value !== outerValue[ i ])
    ) {
      return false
    }
  }

  return true
}

function isEquivalentArray (a, b) {
  return Array.isArray(b) === true
    ? a.length === b.length && a.every((value, i) => value === b[ i ])
    : a.length === 1 && a[ 0 ] === b
}

function isSameRouteLocationParamsValue (a, b) {
  return Array.isArray(a) === true
    ? isEquivalentArray(a, b)
    : (
        Array.isArray(b) === true
          ? isEquivalentArray(b, a)
          : a === b
      )
}

function isSameRouteLocationParams (a, b) {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false
  }

  for (const key in a) {
    if (isSameRouteLocationParamsValue(a[ key ], b[ key ]) === false) {
      return false
    }
  }

  return true
}

export const useRouterLinkProps = {
  // router-link
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

  // regular <a> link
  href: String,
  target: String,

  // state
  disable: Boolean
}

// external props: type, tag

export default function (fallbackTag) {
  const vm = getCurrentInstance()
  const { props, proxy } = vm

  const hasRouter = vmHasRouter(vm)
  const hasHrefLink = computed(() => props.disable !== true && props.href !== void 0)

  const hasRouterLinkProps = computed(() =>
    hasRouter === true
    && props.disable !== true
    && hasHrefLink.value !== true
    && props.to !== void 0 && props.to !== null && props.to !== ''
  )

  const linkRoute = computed(() => {
    if (hasRouterLinkProps.value === true) {
      try { return proxy.$router.resolve(props.to) }
      catch (err) {}
    }

    return null
  })

  const hasRouterLink = computed(() => linkRoute.value !== null)
  const hasLink = computed(() => hasHrefLink.value === true || hasRouterLink.value === true)

  const linkTag = computed(() => (
    props.type === 'a' || hasLink.value === true
      ? 'a'
      : (props.tag || fallbackTag || 'div')
  ))

  const linkProps = computed(() => (
    hasHrefLink.value === true
      ? {
          href: props.href,
          target: props.target
        }
      : (
          hasRouterLink.value === true
            ? {
                href: linkRoute.value.href,
                target: props.target
              }
            : {}
        )
  ))

  const linkActiveIndex = computed(() => {
    if (hasRouterLink.value === false) {
      return null
    }

    const
      { matched } = linkRoute.value,
      { length } = matched,
      routeMatched = matched[ length - 1 ]

    if (routeMatched === void 0) {
      return -1
    }

    const currentMatched = proxy.$route.matched

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
    const parentRecordPath = getOriginalPath(matched[ length - 2 ])

    return (
      // we are dealing with nested routes
      length > 1
      // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      && getOriginalPath(routeMatched) === parentRecordPath
      // avoid comparing the child with its parent
      && currentMatched[ currentMatched.length - 1 ].path !== parentRecordPath
        ? currentMatched.findIndex(
            isSameRouteRecord.bind(null, matched[ length - 2 ])
          )
        : index
    )
  })

  const linkIsActive = computed(() =>
    hasRouterLink.value === true
    && linkActiveIndex.value > -1
    && includesParams(proxy.$route.params, linkRoute.value.params)
  )

  const linkIsExactActive = computed(() =>
    linkIsActive.value === true
      && linkActiveIndex.value === proxy.$route.matched.length - 1
      && isSameRouteLocationParams(proxy.$route.params, linkRoute.value.params)
  )

  const linkClass = computed(() => (
    hasRouterLink.value === true
      ? (
          linkIsExactActive.value === true
            ? ` ${ props.exactActiveClass } ${ props.activeClass }`
            : (
                props.exact === true
                  ? ''
                  : (linkIsActive.value === true ? ` ${ props.activeClass }` : '')
              )
        )
      : ''
  ))

  // should match RouterLink from Vue Router
  function navigateToRouterLink (e) {
    if (
      // component is not disabled
      props.disable === true

      // don't redirect with control keys
      || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey

      // don't redirect when preventDefault called
      // ...unless calling go() from @click(e, go)
      || (e.__qNavigate !== true && e.defaultPrevented === true)

      // don't redirect on right click
      || (e.button !== undefined && e.button !== 0)

      // don't redirect if it should open in a new window
      || props.target === '_blank'
    ) {
      return false
    }

    prevent(e)

    return proxy.$router[ props.replace === true ? 'replace' : 'push' ](props.to)
      .catch(() => {})
  }

  return {
    hasRouterLink,
    hasHrefLink,
    hasLink,

    linkTag,
    linkRoute,
    linkIsActive,
    linkIsExactActive,
    linkClass,
    linkProps,

    navigateToRouterLink
  }
}
