import { h, withDirectives } from 'vue'

export function slot (vm, slotName, otherwise) {
  return vm.$slots[slotName] !== void 0
    ? vm.$slots[slotName]()
    : otherwise
}

export function uniqueSlot (vm, slotName, otherwise) {
  return vm.$slots[slotName] !== void 0
    ? vm.$slots[slotName]().slice()
    : otherwise
}

/**
 * Source definitely exists,
 * so it's merged with the possible slot
 */
export function mergeSlot (source, vm, slotName) {
  return vm.$slots[slotName] !== void 0
    ? source.concat(vm.$slots[slotName]())
    : source
}

/**
 * Merge with possible slot,
 * even if source might not exist
 */
export function mergeSlotSafely (source, vm, slotName) {
  if (vm.$slots[slotName] === void 0) {
    return source
  }

  const slot = vm.$slots[slotName]()
  return source !== void 0
    ? source.concat(slot)
    : slot
}

/*
 * (String)  key       - unique vnode key
 * (Boolean) condition - should change ONLY when adding/removing directive
 */
export function hDir (
  tag,
  data,
  children,
  key,
  condition,
  getDirsFn
) {
  data.key = key + condition

  const vnode = h(tag, data, children)

  return condition === true
    ? withDirectives(vnode, getDirsFn())
    : vnode
}
