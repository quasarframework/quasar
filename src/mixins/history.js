const History = {}
export default History

export const HistoryMixin = {
  data () {
    return {
      manualURL: false,
      to: null,
      next: null,
      callbacks: []
    }
  },
  methods: {
    __addToHistory (cb) {
      console.log('__addToHistory')
      this.callbacks.push(cb)
      const len = this.callbacks.length

      const state = window.history.state || {}
      state.qHistoryLevel = len
      window.history.replaceState(state, '')
      window.history.pushState({qHistoryHasBack: true}, '')
      if (len === 1) {
        console.log('add popstate')
        window.addEventListener('popstate', this.__popstate)
      }
    },
    __removeFromHistory () {
      console.log('__removeFromHistory')
      if (this.callbacks.length > 0) {
        console.log('remove: history back')
        window.history.go(-1)
      }
    },
    __popstate () {
      console.log('popstate', window.history.state)
      const len = this.callbacks.length

      if (this.manualURL) {
        console.log('popstate[manualURL] modals', this.modals)
        if (len > 0) {
          console.log('popstate: manualURL; going back one more')
          const cb = this.callbacks.pop()
          cb().then(() => {
            window.history.state.qHistoryLevel = null
            window.history.go(-1)
          })
        }
        else {
          console.log('popstate: resetting manualURL')
          window.history.state.qHistoryLevel = null
          console.log('popstate: remove popstate')
          this.manualURL = false
          window.removeEventListener('popstate', this.__popstate)
          this.$router.push(this.to)
        }
        return
      }

      if (window.history.state && window.history.state.qHistoryLevel) {
        const cb = this.callbacks.pop()
        cb().then(() => {
          window.history.state.qHistoryLevel = null

          if (this.next && len > 1) {
            console.log('popstate: going back one more')
            window.history.go(-1)
            return
          }

          if (len === 1) {
            console.log('remove popstate')
            window.removeEventListener('popstate', this.__popstate)
          }

          if (this.next) {
            const fn = this.next
            this.next = null
            console.log('calling next')
            fn()
          }
        })
        return
      }

      // manually changed route
      console.log('manually changed route')
      this.manualURL = true
      this.next(false)
    },
    __clearBogusHistory () {
      console.log('__clearBogusHistory')
      window.removeEventListener('popstate', this.__clearBogusHistory)

      if (window.history.state && window.history.state.qHistoryHasBack) {
        console.log('__clearBogusHistory: qHistoryHasBack; going back in history')
        const state = window.history.state
        state.qHistoryHasBack = null
        state.forceBack = true
        window.history.replaceState(state, '')
        window.addEventListener('popstate', this.__clearBogusHistory)
        window.history.go(-1)
        return
      }

      window.addEventListener('popstate', this.__genericPopstate)
    },
    __genericPopstate () {
      console.log('generic popstate')
      if (window.history.state && window.history.state.forceBack) {
        console.log('generic popstate: detected forceBack')
        window.history.go(-1)
      }
    }
  },
  created () {
    this.__clearBogusHistory()
    this.removeRouteListener = this.$router.beforeEach((to, from, next) => {
      console.log('route change', from, to)
      if (this.callbacks.length > 0) {
        this.next = next
        this.to = to
        window.history.go(-1)
      }
      else {
        console.log('next')
        next()
      }
    })

    History.getLevel = () => this.callbacks.length
    History.add = this.__addToHistory
    History.remove = this.__removeFromHistory
  },
  beforeDestroy () {
    console.log('layout beforeDestroy')
    this.removeRouteListener()
    window.removeEventListener('popstate', this.__genericPopstate)
  }
}
