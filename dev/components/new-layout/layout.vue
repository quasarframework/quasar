<template>
  <div>
    <q-tabs inverted>
      <q-route-tab slot="title" to="/back/a" label="A" />
      <q-route-tab slot="title" to="/back/b" label="B" />
      <q-route-tab slot="title" to="/back/c" label="C" />
    </q-tabs>

    <div>
      {{modals}}
      <q-btn @click="add" label="Add" />
      <q-btn @click="remove" label="Remove" />
    </div>

    <br>

    <router-view />
  </div>
</template>

<script>
export default {
  data () {
    return {
      modals: 0
    }
  },
  methods: {
    add () {
      console.log('add')
      this.modals++
      const state = window.history.state || {}
      state.modal = this.modals
      window.history.replaceState(state, '')
      window.history.pushState({hasBack: true}, '')
      if (this.modals === 1) {
        console.log('add popstate')
        window.addEventListener('popstate', this.__popstate)
      }
    },
    remove (next) {
      console.log('remove')
      if (this.modals) {
        this.modals--
        window.history.go(-1)
        console.log('remove: history back')
        if (next) {
          console.log('remove: calling next')
          next()
        }
      }
    },
    __popstate () {
      console.log('popstate', window.history.state)
      if (this.manual) {
        console.log('popstate[manual] modals', this.modals)
        if (this.modals > 0) {
          console.log('popstate: manual; going back one more')
          this.modals--
          window.history.state.modal = null
          window.history.go(-1)
          return
        }
        else {
          console.log('popstate: resetting manual')
          window.history.state.modal = null
          console.log('popstate: remove popstate')
          this.manual = false
          window.removeEventListener('popstate', this.__popstate)
          this.$router.push(this.to)
          return
        }
      }
      else if (window.history.state && window.history.state.modal) {
        this.modals--
        window.history.state.modal = null
        if (this.modals === 0) {
          console.log('remove popstate')
          window.removeEventListener('popstate', this.__popstate)
        }
        else {
          console.log('popstate: going back one more')
          window.history.go(-1)
          return
        }
      }
      else {
        // manually changed route
        console.log('manually changed route')
        this.manual = true
        this.next(false)
        return
      }

      if (this.next) {
        const fn = this.next
        this.next = null
        console.log('calling next')
        fn()
        return
      }

      console.log('back detected')
    },
    __clearBogusHistory () {
      console.log('__clearBogusHistory')
      window.removeEventListener('popstate', this.__clearBogusHistory)
      if (window.history.state && window.history.state.hasBack) {
        console.log('__clearBogusHistory: hasBack; going back in history')
        const state = window.history.state
        state.hasBack = null
        state.forceBack = true
        window.history.replaceState(state, '')
        window.addEventListener('popstate', this.__clearBogusHistory)
        window.history.go(-1)
      }
      else {
        window.addEventListener('popstate', () => {
          console.log('generic popstate')
          if (window.history.state && window.history.state.forceBack) {
            console.log('generic popstate: detected forceBack')
            window.history.go(-1)
          }
        })
      }
    }
  },
  created () {
    console.log('layout created')
    this.__clearBogusHistory()
    this.beforeEach = this.$router.beforeEach((to, from, next) => {
      console.log('route change', from, to)
      if (this.modals) {
        this.next = next
        this.to = to
        window.history.go(-1)
      }
      else {
        console.log('next')
        next()
      }
    })
  },
  beforeDestroy () {
    console.log('layout beforeDestroy')
    this.beforeEach()
  }
}
</script>
