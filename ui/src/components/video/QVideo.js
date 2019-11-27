import Vue from 'vue'

export default Vue.extend({
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
      staticClass: 'q-video',
      on: this.$listeners
    }, [
      h('iframe', this.iframeData)
    ])
  }
})
