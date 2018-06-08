// using it to manage SSR rendering with best performance

export default {
  data () {
    return {
      canRender: !this.$q.platform.is.fromSSR
    }
  },
  mounted () {
    this.canRender = true
  }
}
