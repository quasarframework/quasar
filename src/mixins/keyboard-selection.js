import { getEventKey, stopAndPrevent } from '../utils/event.js'
import { normalizeToInterval } from '../utils/format.js'

export default {
  data: () => ({
    keyboardIndex: 0,
    keyboardMoveDirection: false,
    keyboardMoveTimer: false
  }),
  watch: {
    keyboardIndex (val) {
      if (this.$refs.popover && this.$refs.popover.showing && this.keyboardMoveDirection && val > -1) {
        this.$nextTick(() => {
          if (!this.$refs.popover) {
            return
          }
          const selected = this.$refs.popover.$el.querySelector('.q-select-highlight')
          if (selected && selected.scrollIntoView) {
            if (selected.scrollIntoViewIfNeeded) {
              return selected.scrollIntoViewIfNeeded(false)
            }
            selected.scrollIntoView(this.keyboardMoveDirection < 0)
          }
        })
      }
    }
  },
  methods: {
    __keyboardShow (index = 0) {
      if (this.keyboardIndex !== index) {
        this.keyboardIndex = index
      }
    },
    __keyboardSetCurrentSelection (navigation) {
      if (this.keyboardIndex >= 0 && this.keyboardIndex <= this.keyboardMaxIndex) {
        this.__keyboardSetSelection(this.keyboardIndex, navigation)
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
            -1,
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
