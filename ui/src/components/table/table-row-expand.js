import { ref, watch } from 'vue'

function getVal(val) {
  return Array.isArray(val) ? [...val] : []
}

export const useTableRowExpandProps = {
  /**
   * Keeps the array with expanded rows keys
   *
   * @api prop expanded
   * @type {Array}
   * @category expansion
   * @syncable
   */
  expanded: Array // v-model:expanded
}

export const useTableRowExpandEmits = [
  /**
   * Emitted when the expanded rows change
   *
   * @api event update:expanded
   * @param {Array} newExpanded New expanded rows keys
   */
  'update:expanded'
]

export function useTableRowExpand(props, emit) {
  const innerExpanded = ref(getVal(props.expanded))

  watch(
    () => props.expanded,
    val => {
      innerExpanded.value = getVal(val)
    }
  )

  /**
   * Determine if a row key is expanded
   *
   * @api method isRowExpanded
   * @param {Any} key Row key
   * @returns {Boolean} Is row expanded
   */
  function isRowExpanded(key) {
    return innerExpanded.value.includes(key)
  }

  /**
   * Sets the expanded rows keys
   *
   * @api method setExpanded
   * @param {Array} val Expanded rows keys
   */
  function setExpanded(val) {
    if (props.expanded !== void 0) {
      emit('update:expanded', val)
    } else {
      innerExpanded.value = val
    }
  }

  function updateExpanded(key, add) {
    const target = [...innerExpanded.value]
    const index = target.indexOf(key)

    if (add) {
      if (index === -1) {
        target.push(key)
        setExpanded(target)
      }
    } else if (index !== -1) {
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
