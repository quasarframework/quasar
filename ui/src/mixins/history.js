import History from '../history.js'

export default {
  methods: {
    __addHistory () {
      this.__historyEntry = {
        condition: () => { return this.hideOnRouteChange === true },
        handler: this.hide
      }
      History.add(this.__historyEntry)
    },

    __removeHistory () {
      if (this.__historyEntry !== void 0) {
        History.remove(this.__historyEntry)
        this.__historyEntry = void 0
      }
    }
  },

  beforeUnmount () {
    this.showing === true && this.__removeHistory()
  }
}
