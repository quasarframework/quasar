export function injectProp (target, propName, get, set) {
  Object.defineProperty(target, propName, {
    get,
    set,
    enumerable: true
  })
}

export function createObject (props) {
  const acc = {}
  for (const key in props) {
    injectProp(acc, key, props[ key ])
  }
  return acc
}

export function injectMultipleProps (target, props) {
  for (const key in props) {
    injectProp(target, key, props[ key ])
  }
}
