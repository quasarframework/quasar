export default function (vm, slotName, otherwise) {
  return vm.$scopedSlots[slotName] !== void 0
    ? vm.$scopedSlots[slotName]()
    : otherwise
}

export function uniqueSlot (vm, slotName, otherwise) {
  return vm.$scopedSlots[slotName] !== void 0
    ? vm.$scopedSlots[slotName]().slice()
    : otherwise
}
