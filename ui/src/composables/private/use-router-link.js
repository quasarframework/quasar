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

export const useRouterLinkProps = {
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

export default function () {
  const vm = getCurrentInstance()
  const { props, attrs, proxy } = vm

  const hasRouter = vmHasRouter(vm)

  const hasLink = computed(() =>
    hasRouter === true
    && props.disable !== true
    && props.to !== void 0 && props.to !== null && props.to !== ''
  )

  const linkTag = computed(() => (
    hasLink.value === true
      ? 'a'
      : (props.tag || 'div')
  ))

  const linkRoute = computed(() => (
    hasLink.value === true
      ? proxy.$router.resolve(props.to)
      : null
  ))

  const linkActiveIndex = computed(() => {
    if (hasLink.value === false) {
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
    hasLink.value === true
    && linkActiveIndex.value > -1
    && includesParams(proxy.$route.params, linkRoute.value.params)
  )

  const linkIsExactActive = computed(() =>
    linkIsActive.value === true
      && linkActiveIndex.value === proxy.$route.matched.length - 1
  )

  const linkClass = computed(() => (
    hasLink.value === true
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

  const linkProps = computed(() => (
    hasLink.value === true
      ? {
          href: linkRoute.value.href,
          target: attrs.target,
          role: 'link'
        }
      : {}
  ))

  // should match RouterLink from Vue Router
  function navigateToLink (e) {
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
      || attrs.target === '_blank'
    ) {
      return false
    }

    prevent(e)

    proxy.$router[ props.replace === true ? 'replace' : 'push' ](props.to)
      .catch(() => {})

    return true
  }

  return {
    hasLink,
    linkTag,
    linkRoute,
    linkIsActive,
    linkIsExactActive,
    linkClass,
    linkProps,

    navigateToLink
  }
}
