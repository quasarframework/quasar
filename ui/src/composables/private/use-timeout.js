import { onBeforeUnmount } from 'vue'

export default function () {
  let timer

  onBeforeUnmount(() => {
    clearTimeout(timer)
  })

  return {
    registerTimeout (fn, delay) {
      clearTimeout(timer)
      timer = setTimeout(fn, delay)
    },

    removeTimeout () {
      clearTimeout(timer)
    }
  }
}
