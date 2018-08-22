export default {
  name: 'QVideo',
  props: {
    src: {
      type: String,
      required: true
    }
  },
  computed: {
    iframeData () {
      return {
        attrs: {
          src: this.src,
          frameborder: '0',
          allowfullscreen: true
        }
      }
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-video'
    }, [
      h('iframe', this.iframeData)
    ])
  }
}
