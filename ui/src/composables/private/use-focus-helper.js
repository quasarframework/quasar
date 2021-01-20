import { h } from 'vue'

export default function (targetRef = void 0) {
  return [
    h('span', {
      ref: targetRef,
      ariaHidden: 'true',
      tabindex: -1,
      class: 'q-focus-helper'
    })
  ]
}
