export function injectProp (target, propName, get, set) {
  Object.defineProperty(target, propName, {
    get,
    set,
    enumerable: true
  })
  return target
}

export function injectMultipleProps (target, props) {
  Object.keys(props).forEach(key => {
    injectProp(target, key, props[ key ])
  })
  return target
}
