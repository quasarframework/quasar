import { isDeepEqual } from './is'

const trailingSlashRE = /\/?$/

function queryIncludes (current, target) {
  for (const key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

export function isSameRoute (current, target) {
  if (!target) {
    return false
  }
  if (current.path && target.path) {
    return (
      current.path.replace(trailingSlashRE, '') === target.path.replace(trailingSlashRE, '') &&
      current.hash === target.hash &&
      isDeepEqual(current.query, target.query)
    )
  }
  if (current.name && target.name) {
    return (
      current.name === target.name &&
      current.hash === target.hash &&
      isDeepEqual(current.query, target.query) &&
      isDeepEqual(current.params, target.params)
    )
  }
  return false
}

export function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(target.path.replace(trailingSlashRE, '/')) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}
