import { ref, watch } from 'vue'

function getVal (val) {
  return Array.isArray(val)
    ? val.slice()
    : []
}

export const useTableRowExpandProps = {
  expanded: Array // v-model:expanded
}

export const useTableRowExpandEmits = [ 'update:expanded' ]

export function useTableRowExpand (props, emit) {
  const innerExpanded = ref(getVal(props.expanded))

  watch(() => props.expanded, val => {
    innerExpanded.value = getVal(val)
  })

  function isRowExpanded (key) {
    return innerExpanded.value.includes(key)
  }

  function setExpanded (val) {
    if (props.expanded !== void 0) {
      emit('update:expanded', val)
    }
    else {
      innerExpanded.value = val
    }
  }

  function updateExpanded (key, add) {
    const target = innerExpanded.value.slice()
    const index = target.indexOf(key)

    if (add === true) {
      if (index === -1) {
        target.push(key)
        setExpanded(target)
      }
    }
    else if (index !== -1) {
      target.splice(index, 1)
      setExpanded(target)
    }
  }

  return {
    isRowExpanded,
    setExpanded,
    updateExpanded
  }
}
