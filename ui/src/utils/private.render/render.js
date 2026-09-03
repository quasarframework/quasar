export function hSlot(slot, otherwise) {
  return slot !== void 0 ? slot() || otherwise : otherwise
}

export function hUniqueSlot(slot, otherwise) {
  if (slot !== void 0) {
    const vnode = slot()
    if (vnode !== void 0 && vnode !== null) {
      return [...vnode]
    }
  }

  return otherwise
}

/**
 * Source definitely exists,
 * so it's merged with the possible slot
 */
export function hMergeSlot(slot, source) {
  // oxlint-disable-next-line unicorn/prefer-spread
  return slot !== void 0 ? source.concat(slot()) : source
}

/**
 * Merge with possible slot,
 * even if source might not exist
 */
export function hMergeSlotSafely(slot, source) {
  if (slot === void 0) return source

  // oxlint-disable-next-line unicorn/prefer-spread
  return source !== void 0 ? source.concat(slot()) : slot()
}
