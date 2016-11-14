let bus

export function install (_Vue) {
  bus = new _Vue()
}

export default {
  $on (...args) { bus && bus.$on(...args) },
  $once (...args) { bus && bus.$once(...args) },
  $emit (...args) { bus && bus.$emit(...args) },
  $off (...args) { bus && bus.$off(...args) }
}
