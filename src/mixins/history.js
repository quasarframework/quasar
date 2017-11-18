const History = {
  add: () => {},
  remove: () => {}
}

export default History

export const HistoryMixin = {
  data () {
    return {
      history: []
    }
  },
  methods: {
    __addHistory (definition) {
      console.log('HIST ADD')
      this.history.push(definition)
    },
    __removeHistory (definition) {
      console.log('HIST REMOVE')
      const index = this.history.indexOf(definition)
      if (index >= 0) {
        this.history.splice(index, 1)
      }
    }
  },
  created () {
    if (!this.$q.platform.is.cordova) {
      return
    }

    History.add = this.__addHistory
    History.remove = this.__removeHistory

    document.addEventListener('backbutton', () => {
      if (this.history.length) {
        const fn = this.history.pop().handler
        fn()
      }
      else {
        window.history.back()
      }
    }, false)
  }
}
