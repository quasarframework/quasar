import { onBeforeUnmount } from 'vue'

import History from '../../history.js'

export default function (showing, hide, hideOnRouteChange) {
  let historyEntry

  function removeFromHistory () {
    if (historyEntry !== void 0) {
      History.remove(historyEntry)
      historyEntry = void 0
    }
  }

  onBeforeUnmount(() => {
    showing.value === true && removeFromHistory()
  })

  return {
    removeFromHistory,

    addToHistory () {
      historyEntry = {
        condition: () => hideOnRouteChange.value === true,
        handler: hide
      }

      History.add(historyEntry)
    }
  }
}
