/*
 * Inspired by RouterLink from Vue Router
 *  --> API should match!
 */

import { computed, getCurrentInstance } from 'vue'

import { vmHasRouter } from '../../utils/private.vm/vm.js'

// Get the original path value of a record by following its aliasOf
function getOriginalPath(record) {
  return record ? (record.aliasOf ? record.aliasOf.path : record.path) : ''
}

function isSameRouteRecord(a, b) {
  // since the original record has an undefined value for aliasOf
  // but all aliases point to the original record, this will always compare
  // the original record
  return (a.aliasOf || a) === (b.aliasOf || b)
}

function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key],
      outerValue = outer[key]

    if (typeof innerValue === 'string') {
      if (innerValue !== outerValue) return false
    } else if (
      !Array.isArray(outerValue) ||
      outerValue.length !== innerValue.length ||
      innerValue.some((value, i) => value !== outerValue[i])
    ) {
      return false
    }
  }

  return true
}

function isEquivalentArray(a, b) {
  return Array.isArray(b)
    ? a.length === b.length && a.every((value, i) => value === b[i])
    : a.length === 1 && a[0] === b
}

function isSameRouteLocationParamsValue(a, b) {
  return Array.isArray(a)
    ? isEquivalentArray(a, b)
    : Array.isArray(b)
      ? isEquivalentArray(b, a)
      : a === b
}

function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false
  }

  for (const key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key])) {
      return false
    }
  }

  return true
}

export const useRouterLinkNonMatchingProps = {
  // router-link
  to: [String, Object],
  replace: Boolean,

  // regular <a> link
  href: String,
  target: String,

  // state
  disable: Boolean
}

export const useRouterLinkProps = {
  ...useRouterLinkNonMatchingProps,

  // router-link
  exact: Boolean,
  activeClass: {
    type: String,
    default: 'q-router-link--active'
  },
  exactActiveClass: {
    type: String,
    default: 'q-router-link--exact-active'
  }
}

const emptyLinkAttrs = {}

// ref-shaped constants shared by all instances in router-less apps;
// consumers only ever read .value on them (never watch() them directly)
const linkFalse = { value: false }
const linkNull = { value: null }
const linkNoClass = { value: '' }

// external props: type, tag

export default function useRouterLink({
  fallbackTag,
  useDisableForRouterLinkProps = true
} = {}) {
  const vm = getCurrentInstance()
  const { props, proxy, emit } = vm

  const hasHrefLink = computed(() => !props.disable && props.href !== void 0)

  if (!vmHasRouter(vm)) {
    // the router-link half can never activate
    const linkTag = computed(() =>
      props.type === 'a' || hasHrefLink.value
        ? 'a'
        : props.tag || fallbackTag || 'div'
    )

    const linkAttrs = computed(() =>
      hasHrefLink.value
        ? { href: props.href, target: props.target }
        : emptyLinkAttrs
    )

    return {
      hasRouterLink: linkFalse,
      hasHrefLink,
      hasLink: hasHrefLink,

      linkTag,
      resolvedLink: linkNull,
      linkIsActive: linkFalse,
      linkIsExactActive: linkFalse,
      linkClass: linkNoClass,
      linkAttrs,

      getLink: () => null,

      navigateToRouterLink(e) {
        e.preventDefault()
        return Promise.resolve(false)
      },

      navigateOnClick(e) {
        emit('click', e)
      }
    }
  }

  // for perf reasons, we use minimum amount of runtime work
  const hasRouterLinkProps = useDisableForRouterLinkProps
    ? computed(
        () =>
          !props.disable &&
          !hasHrefLink.value &&
          props.to !== void 0 &&
          props.to !== null &&
          props.to !== ''
      )
    : computed(
        () =>
          !hasHrefLink.value &&
          props.to !== void 0 &&
          props.to !== null &&
          props.to !== ''
      )

  const resolvedLink = computed(() =>
    hasRouterLinkProps.value ? getLink(props.to) : null
  )

  const hasRouterLink = computed(() => resolvedLink.value !== null)
  const hasLink = computed(() => hasHrefLink.value || hasRouterLink.value)

  const linkTag = computed(() =>
    props.type === 'a' || hasLink.value
      ? 'a'
      : props.tag || fallbackTag || 'div'
  )

  const linkAttrs = computed(() =>
    hasHrefLink.value
      ? {
          href: props.href,
          target: props.target
        }
      : hasRouterLink.value
        ? {
            href: resolvedLink.value.href,
            target: props.target
          }
        : emptyLinkAttrs
  )

  const linkActiveIndex = computed(() => {
    if (!hasRouterLink.value) return -1

    const { matched } = resolvedLink.value,
      { length } = matched,
      routeMatched = matched[length - 1]

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

    if (index !== -1) return index

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
        currentMatched.at(-1).path !== parentRecordPath
        ? currentMatched.findIndex(
            isSameRouteRecord.bind(null, matched[length - 2])
          )
        : index
    )
  })

  const linkIsActive = computed(
    () =>
      hasRouterLink.value &&
      linkActiveIndex.value !== -1 &&
      includesParams(proxy.$route.params, resolvedLink.value.params)
  )

  const linkIsExactActive = computed(
    () =>
      linkIsActive.value &&
      linkActiveIndex.value === proxy.$route.matched.length - 1 &&
      isSameRouteLocationParams(proxy.$route.params, resolvedLink.value.params)
  )

  const linkClass = computed(() =>
    hasRouterLink.value
      ? linkIsExactActive.value
        ? ` ${props.exactActiveClass} ${props.activeClass}`
        : props.exact
          ? ''
          : linkIsActive.value
            ? ` ${props.activeClass}`
            : ''
      : ''
  )

  function getLink(to) {
    try {
      return proxy.$router.resolve(to)
    } catch {}

    return null
  }

  /**
   * @returns Promise<RouterError | false | undefined>
   */
  function navigateToRouterLink(
    e,
    { returnRouterError, to = props.to, replace = props.replace } = {}
  ) {
    if (props.disable) {
      // ensure native navigation is prevented in all cases,
      // like when useDisableForRouterLinkProps === false (QRouteTab)
      e.preventDefault()
      return Promise.resolve(false)
    }

    if (
      // don't redirect with control keys;
      // should match RouterLink from Vue Router
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey ||
      // don't redirect on right click
      (e.button !== void 0 && e.button !== 0) ||
      // don't redirect if it should open in a new window
      props.target === '_blank'
    ) {
      return Promise.resolve(false)
    }

    // hinder the native navigation
    e.preventDefault()

    // then() can also return a "soft" router error (Vue Router behavior)
    const promise = proxy.$router[replace ? 'replace' : 'push'](to)

    return returnRouterError
      ? promise
      : // else catching hard errors and also "soft" ones - then(err => ...)
        promise.then(() => {}).catch(() => {})
  }

  // warning! ensure that the component using it has 'click' included in its 'emits' definition prop
  function navigateOnClick(e) {
    if (hasRouterLink.value) {
      const go = opts => navigateToRouterLink(e, opts)

      emit('click', e, go)
      if (!e.defaultPrevented) go()
    } else {
      emit('click', e)
    }
  }

  return {
    hasRouterLink,
    hasHrefLink,
    hasLink,

    linkTag,
    resolvedLink,
    linkIsActive,
    linkIsExactActive,
    linkClass,
    linkAttrs,

    getLink,
    navigateToRouterLink,
    navigateOnClick
  }
}
