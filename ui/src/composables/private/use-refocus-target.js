import { h, computed, ref } from 'vue'

export default function (props, rootRef) {
  const refocusRef = ref(null)

  const refocusTargetEl = computed(() => {
    if (props.disable !== true) {
      return null
    }

    return h('span', {
      ref: refocusRef,
      class: 'no-outline',
      tabindex: -1
    })
  })

  function refocusTarget (e) {
    if (e !== void 0 && e.type.indexOf('key') === 0) {
      if (document.activeElement !== rootRef.value && rootRef.value.contains(document.activeElement) === true) {
        rootRef.value.focus()
      }
    }
    else if ((e === void 0 || rootRef.value.contains(e.target) === true) && refocusRef.value !== null) {
      refocusRef.value.focus()
    }
  }

  return {
    refocusTargetEl,
    refocusTarget
  }
}
