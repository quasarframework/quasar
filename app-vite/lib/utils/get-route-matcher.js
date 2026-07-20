import picomatch from 'picomatch'

const trailingSlashRE = /\/+$/

export function getRouteMatcher(patterns) {
  const isMatch = picomatch(patterns)

  return route =>
    isMatch(route) ||
    (route.length > 1 &&
      route.endsWith('/') &&
      isMatch(route.replace(trailingSlashRE, '')))
}
