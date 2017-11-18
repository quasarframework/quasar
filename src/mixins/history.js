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
      console.log('NOT CORDOVA')
      return
    }

    History.add = this.__addHistory
    History.remove = this.__removeHistory

    console.log('CORDOVA adding backbutton')
    document.addEventListener('backbutton', () => {
      console.log('backbutton', this.history.length)
      if (this.history.length) {
        const fn = this.history.pop().handler
        console.log('executing', fn)
        fn()
      }
      else {
        console.log('go -1')
        window.history.back()
      }
    }, false)
  }
}
