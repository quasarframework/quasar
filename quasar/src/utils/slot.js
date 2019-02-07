export default function (vm, slotName) {
  return vm.$scopedSlots[slotName] !== void 0
    ? vm.$scopedSlots[slotName]()
    : void 0
}
