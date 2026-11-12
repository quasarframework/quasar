export function injectProp(target, propName, get, set) {
  Object.defineProperty(target, propName, {
    get,
    set,
    enumerable: true
  })
  return target
}

export function injectMultipleProps(target, props) {
  for (const key in props) {
    injectProp(target, key, props[key])
  }
  return target
}

/**
 * For objects created over and over (slot scopes): V8 15.1+ (Chrome 153+)
 * keeps the first accessor pair defined on a literal-born object alive
 * for the lifetime of the page (#18577), so a per-object closure would
 * pin whatever it captures (the whole component instance).
 *
 * The accessors of "descriptors" must therefore be module-level functions
 * shared by all objects, reaching their instance-bound data
 * through this[ scopeOwnerKey ].
 */
export const scopeOwnerKey = Symbol('scopeOwner')

export function injectScopeProps(target, owner, descriptors) {
  Object.defineProperty(target, scopeOwnerKey, { value: owner })
  return Object.defineProperties(target, descriptors)
}
