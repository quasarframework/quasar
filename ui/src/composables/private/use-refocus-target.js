import { h, computed, ref } from 'vue'

export default function (props, rootRef) {
  const refocusRef = ref(null)

  const refocusTargetEl = computed(() => {
    if (props.disable === true) {
      return null
    }

    return h('span', {
      ref: refocusRef,
      class: 'no-outline',
      tabindex: -1
    })
  })

  function refocusTarget (e) {
    const root = rootRef.value

    if (e !== void 0 && e.type.indexOf('key') === 0) {
      if (
        root !== null
        && document.activeElement !== root
        && root.contains(document.activeElement) === true
      ) {
        root.focus()
      }
    }
    else if (
      refocusRef.value !== null
      && (e === void 0 || (root !== null && root.contains(e.target) === true))
    ) {
      refocusRef.value.focus()
    }
  }

  return {
    refocusTargetEl,
    refocusTarget
  }
}
