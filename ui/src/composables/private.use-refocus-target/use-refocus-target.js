import { h, computed, ref } from 'vue'

export default function useRefocusTarget(props, rootRef) {
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

  function refocusTarget(e) {
    const root = rootRef.value

    if (e?.qAvoidFocus === true) return

    if (e?.type.indexOf('key') === 0) {
      if (
        document.activeElement !== root &&
        root?.contains(document.activeElement) === true
      ) {
        root.focus()
      }
    } else if (
      refocusRef.value !== null &&
      (e === void 0 || root?.contains(e.target) === true)
    ) {
      refocusRef.value.focus()
    }
  }

  return {
    refocusTargetEl,
    refocusTarget
  }
}
