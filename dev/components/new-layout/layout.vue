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
      if (window.history.state && window.history.state.modal) {
        this.modals--
        window.history.state.modal = null
        if (this.modals === 0) {
          console.log('remove popstate')
          window.removeEventListener('popstate', this.__popstate)
        }
      }
      if (this.push) {
        const to = this.push
        console.log('pushing', to)
        this.push = null
        this.$router.push(to)
      }
      else if (this.replace) {
        const to = this.replace
        console.log('replacing', to)
        this.replace = null
        this.$router.replace(to)
      }
      else {
        console.log('back detected; replacing state')
        // window.history.replaceState({}, '')
      }
    },
    __clearBogusHistory () {
      console.log('__clearBogusHistory')
      window.removeEventListener('popstate', this.__clearBogusHistory)
      if (window.history.state && window.history.state.hasBack) {
        console.log('__clearBogusHistory: hasBack; going back in history')
        window.addEventListener('popstate', this.__clearBogusHistory)
        window.history.go(-1)
      }
    }
  },
  created () {
    console.log('layout created')
    this.__clearBogusHistory()
    this.beforeEach = this.$router.beforeEach((to, from, next) => {
      console.log('route change', from, to)
      console.log('HISTORY length', window.history.length)
      if (this.modals) {
        if (window.history.state) {
          console.log('HISTORY. modal: ', window.history.state.modal, 'hasBack:', window.history.state.hasBack)
        }
        const prop = window.history.state && window.history.state.hasBack
          ? 'push'
          : 'replace'
        console.log('going back', prop)
        this[prop] = to
        next(false)
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
