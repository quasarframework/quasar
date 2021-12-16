export function injectGetter (target, propName, get) {
  Object.defineProperty(target, propName, {
    get,
    configurable: true,
    enumerable: true
  })
}

export function injectProp (target, propName, get, set) {
  Object.defineProperty(target, propName, {
    get,
    set,
    configurable: true,
    enumerable: true
  })
}
