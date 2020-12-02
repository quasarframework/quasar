import { hDir as dir } from './composition-render.js'

// this file will eventually be removed
// and superseeded by render-composition.js
// after all components use composition api

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

export const hDir = dir
