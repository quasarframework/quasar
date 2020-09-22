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
