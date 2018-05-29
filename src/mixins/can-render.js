// using it to manage SSR rendering with best performance

export default {
  data () {
    const is = this.$q.platform.is
    return {
      canRender: is.cordova || is.electron
    }
  },
  mounted () {
    this.canRender = true
  }
}
