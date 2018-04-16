import { getEventKey, stopAndPrevent } from '../utils/event'
import { normalizeToInterval } from '../utils/format'

export default {
  data: () => ({
    keyboardIndex: 0,
    keyboardMoveDirection: false,
    keyboardMoveTimer: false
  }),
  methods: {
    __keyboardShow (index = 0) {
      if (this.keyboardIndex !== index) {
        this.keyboardIndex = index
      }
    },
    __keyboardSetCurrentSelection () {
      if (this.keyboardIndex >= 0 && this.keyboardIndex <= this.keyboardMaxIndex) {
        this.__keyboardSetSelection(this.keyboardIndex)
      }
    },
    __keyboardHandleKey (e) {
      const key = getEventKey(e)

      switch (key) {
        case 38: // UP key
          this.__keyboardMoveCursor(-1, e)
          break
        case 40: // DOWN key
          this.__keyboardMoveCursor(1, e)
          break
        case 13: // ENTER key
          if (this.$refs.popover.showing) {
            stopAndPrevent(e)
            this.__keyboardSetCurrentSelection()
            return
          }
          break
        case 9: // TAB key
          this.hide()
          break
      }

      this.__keyboardCustomKeyHandle(key, e)
    },
    __keyboardMoveCursor (offset, e) {
      stopAndPrevent(e)

      if (this.$refs.popover.showing) {
        clearTimeout(this.keyboardMoveTimer)
        let
          index = this.keyboardIndex,
          valid = this.__keyboardIsSelectableIndex || (() => true)

        do {
          index = normalizeToInterval(
            index + offset,
            0,
            this.keyboardMaxIndex
          )
        }
        while (index !== this.keyboardIndex && !valid(index))

        this.keyboardMoveDirection = index > this.keyboardIndex ? 1 : -1
        this.keyboardMoveTimer = setTimeout(() => { this.keyboardMoveDirection = false }, 500)
        this.keyboardIndex = index
        return
      }

      this.__keyboardShowTrigger()
    }
  }
}
