let bus

export function installEvents (_Vue) {
  bus = new _Vue()
  return bus
}

export default {
  $on (...args) { bus && bus.$on(...args) },
  $once (...args) { bus && bus.$once(...args) },
  $emit (...args) { bus && bus.$emit(...args) },
  $off (...args) { bus && bus.$off(...args) }
}
