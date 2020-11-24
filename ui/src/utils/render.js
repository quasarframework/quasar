import { h, withDirectives } from 'vue'

export function hSlot (vm, slotName, otherwise) {
  return vm.$slots[ slotName ] !== void 0
    ? vm.$slots[ slotName ]()
    : otherwise
}

export function hUniqueSlot (vm, slotName, otherwise) {
  return vm.$slots[ slotName ] !== void 0
    ? vm.$slots[ slotName ]().slice()
    : otherwise
}

/**
 * Source definitely exists,
 * so it's merged with the possible slot
 */
export function hMergeSlot (vm, slotName, source) {
  return vm.$slots[ slotName ] !== void 0
    ? source.concat(vm.$slots[ slotName ]())
    : source
}

/**
 * Merge with possible slot,
 * even if source might not exist
 */
export function hMergeSlotSafely (vm, slotName, source) {
  if (vm.$slots[ slotName ] === void 0) {
    return source
  }

  const slot = vm.$slots[ slotName ]()
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
