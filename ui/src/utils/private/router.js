const trailingSlashRE = /\/?$/

function equals (current, target) {
  if (Object.keys(current).length !== Object.keys(target).length) {
    return false
  }

  // route query and params are strings when read from URL
  for (const key in target) {
    if (!(key in current) || String(current[key]) !== String(target[key])) {
      return false
    }
  }
  return true
}

function includes (current, target) {
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
      equals(current.query, target.query)
    )
  }

  return typeof current.name === 'string' &&
    current.name === target.name &&
    current.hash === target.hash &&
    equals(current.query, target.query) === true &&
    equals(current.params, target.params) === true
}

export function isIncludedRoute (current, target) {
  return current.path.replace(trailingSlashRE, '/').indexOf(target.path.replace(trailingSlashRE, '/')) === 0 &&
    (typeof target.hash !== 'string' || target.hash.length < 2 || current.hash === target.hash) &&
    includes(current.query, target.query) === true
}
